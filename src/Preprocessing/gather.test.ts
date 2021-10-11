import { expect, test } from "../../test/test.js";
import { getPageStream, loadDocument } from "../load.js";
import { getTestFile } from "../test-util.js";
import { gatherStylesAndHeights } from "./gather.js";
const { keys } = Object


test('gather styles and heights', async () => {
  const file = await getTestFile('single');
  const doc = await loadDocument(file);
  const stream = await getPageStream(doc)
  const { styles, heights } = await gatherStylesAndHeights(stream);
  expect(keys(styles)).toEqual(expect.arrayContaining([
    'g_d0_f1',
    'g_d0_f2',
    'g_d0_f3',
  ]));
  expect(heights).toMatchObject({
    '0': 0,
    '12': 1772,
    '10.02': 618,
    '13.5': 20,
  })
})