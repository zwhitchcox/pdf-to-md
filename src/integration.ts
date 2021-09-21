import { pipeline } from "stream";
import { test } from "../test/test.js";
import { getTextStream } from "./load.js";
import { StripMargins } from "./Transform/StripMargins.js";
import { ToTextLines } from "./Transform/ToTextLines.js";
import { getTestFile } from "./util.js";

test('integration', async () => {
  // for await (const textContent of genText(doc)) {
  //   console.log(textContent)
  // }
  const testPage = await getTestFile('test-page');
  const textStream = await getTextStream(testPage);
  // textStream.on('data', console.log)
  pipeline(textStream, new ToTextLines, new StripMargins, (err) => {
    if (err) {
      console.error('pipeline error:', err)
    } else {
      console.log('done')
    }
  })
})
