import { pipeline } from "stream";
import { test } from "../test/test.js";
import { ToMD } from "./Transform/Output/ToMD.js";
import { ReplaceWeirdDoubleQuotes } from "./Transform/Lines/ReplaceWeirdDoubleQuotes.js";
import { Preprocessing } from "./Transform/Pages/Preprocessing.js";
import { StripMargins } from "./Transform/Pages/StripMargins.js";
import { getTestFile } from "./test-util.js";
import { getTextStream, loadDocument } from "./init/load.js";
import { GlobalState } from "./GlobalState/GlobalState.js";
import { Lines } from "./Transform/Lines/Lines.js";
import { Buffer } from './Transform/Blocks/Buffer.js';

const onError = err => {
  if (err) {
    console.error('pipeline error:', err)
  } else {
    console.log('done')
  }
}

test('integration', async () => {
  const file = await getTestFile('test-page');
  const doc = await loadDocument(file);
  const stream = await getTextStream(doc)
  const globalState = new GlobalState;
  globalState.pages.total = doc.numPages;

  pipeline(stream,
    new Preprocessing({globalState}),
    new StripMargins({globalState}),
    new Lines({globalState}),
    new ReplaceWeirdDoubleQuotes({globalState}),
    new Buffer({globalState}),
    new ToMD({globalState}),
    onError)
})
