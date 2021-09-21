import { pipeline } from "stream";
import { test } from "../test/test.js";
import { getTestStream } from "./test-util.js";
import { ToMD } from "./ToMD.js";
import { PageTextLines } from "./Transform/Pages/PageTextLines.js";
import { StripMargins } from "./Transform/Pages/StripMargins.js";

test('integration', async () => {
  const testStream = await getTestStream('test-page');
  pipeline(testStream, new PageTextLines, new StripMargins, new ToMD, (err) => {
    if (err) {
      console.error('pipeline error:', err)
    } else {
      console.log('done')
    }
  })
})
