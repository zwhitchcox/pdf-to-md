import { expect, test } from "../../test/test.js";
import { getPageStream, loadDocument } from "../load.js";
import { getTestFile } from "../test-util.js";
import { gatherStatsAndStyles } from "./gather.js";
const { keys } = Object


test.manual('gather stats', async () => {
  const file = await getTestFile('full');
  const doc = await loadDocument(file);
  const stream = await getPageStream(doc)
  const stats = await gatherStatsAndStyles(stream);
  // this doesn't actually test anything right now.
  // need to figure out how to make snapshots
  console.log(stats)
})