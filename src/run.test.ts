import { pipeline } from "stream";
import { test } from "../test/test.js";
import { Preprocessing } from "./Preprocessing/Preprocessing.js";
import { StripMargins } from "./Transform/Pages/StripMargins.js";
import { getTestFile } from "./test-util.js";
import { Lines } from "./Transform/Lines/Lines.js";
import { Buffer } from './Transform/Blocks/Buffer.js';
import { ReplaceWeirdDoubleQuotes } from "./Transform/Atomic/ReplaceWeirdDoubleQuotes.js";
import { getTextStream, loadDocument } from "./load.js";

const onError = err => {
  if (err) {
    console.error('pipeline error:', err)
  } else {
    console.log('done')
  }
}

test('integration', async () => {
  const file = await getTestFile('toc');
  const doc = await loadDocument(file);
  const stream = await getTextStream(doc)
  const totalPages = doc.numPages;
  const {styles, heights} = await new Promise((res, rej) => {
    const pre = new Preprocessing;
    pipeline(stream, pre, err => {
      if (err) {
        return rej(err)
      }
    });
    pre.on('data', res)
  })

  const stripMargins = new StripMargins;
  const replaceWeirdDoubleQuotes = new ReplaceWeirdDoubleQuotes(),

  pipeline(stream,
    // new StripMargins(),
    // new Lines(),
    // new ReplaceWeirdDoubleQuotes(),
    // new Buffer(),
    // new TOC(),
    // new ToMD({globalState}),
    onError)
})

