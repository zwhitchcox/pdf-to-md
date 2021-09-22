import { pipeline } from "stream";
import { test } from "../test/test.js";
import { getTestStream } from "./test-util.js";
import { ToMD } from "./ToMD.js";
import { Lines } from "./Transform/Lines/Lines.js";
import { ReplaceDoubleQuotes } from "./Transform/Lines/ReplaceDoubleQuote.js";
import { PageTextLines } from "./Transform/Pages/PageTextLines.js";
import { StripMargins } from "./Transform/Pages/StripMargins.js";

const onError = err => {
  if (err) {
    console.error('pipeline error:', err)
  } else {
    console.log('done')
  }
}

test('integration', async () => {
  const testStream = await getTestStream('long-test');
  pipeline(testStream,
    new PageTextLines,
    new StripMargins,
    new Lines,
    new ReplaceDoubleQuotes,
    new ToMD,
    onError)
})
