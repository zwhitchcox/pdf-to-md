import { expect, test } from "../test/test.js";
import { getPageStream, loadDocument } from "./load.js";
import { getTestFile } from "./test-util.js";
const { keys } = Object;

test('load pages as stream', async () => {
  const file = await getTestFile('single');
  const doc = await loadDocument(file);
  const pageStream = await getPageStream(doc)
  const arr = [];
  for await (const page of pageStream) {
    arr.push(page);
  }
  expect(arr.length).toBe(1);
  expect(keys(arr[0].styles))
    .toEqual(expect.arrayContaining(['g_d0_f1', 'g_d0_f2', 'g_d0_f3']));
});
