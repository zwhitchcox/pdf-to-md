import { test } from "../test/test.js";
import { getPageStream, loadDocument } from "./load.js";
import { gatherStylesAndHeights } from "./Preprocessing/gather.js";
import { getTestFile } from "./test-util.js";
import { run } from './run.js'

test('transform', async () => {
  const file = await getTestFile('single');
  run(await getPageStream(doc), global)
    .on('data', console.log);
})