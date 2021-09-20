import path from "path/posix";
import { pipeline } from "stream";
import { fileURLToPath } from "url";
import { test } from "../test/test.js";
import { loadDocument } from "./load.js";
import { genText, getTextStream } from "./text-stream.js";
import { ToLines } from "./to-lines.js";

test('integration', async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const TEST_FILE = 'file://' + path.join(__dirname, '..','/pages/test-page.pdf')
  const doc = await loadDocument(TEST_FILE);
  // for await (const textContent of genText(doc)) {
  //   console.log(textContent)
  // }
  const textStream = getTextStream(doc);
  // textStream.on('data', console.log)
  pipeline(getTextStream(doc), new ToLines, (err) => {
    if (err) {
      console.error('pipeline error:', err)
    } else {
      console.log('done')
    }
  })
})
