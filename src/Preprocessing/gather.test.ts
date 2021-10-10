import { test } from "../../test/test.js";
import { getPageStream, loadDocument } from "../load.js";
import { getTestFile } from "../test-util.js";
import { gatherStylesAndHeights } from "./gather.js";

test('integration', async () => {
  const file = await getTestFile('');
  const doc = await loadDocument(file);
  const stream = await getPageStream(doc)
  const {styles, heights} = await gatherStylesAndHeights(stream);
  console.log({styles, heights});
})