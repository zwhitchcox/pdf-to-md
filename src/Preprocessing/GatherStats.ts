import { TextStyle } from "pdfjs-dist/types/display/api"
import { Transform } from "stream";
import { TextItem } from '../load.js'

export type Line = TextItem[];
export type Page = Line[]
export type Dict<T> = {
  [key: string]: T
}

export type Styles = Dict<TextStyle>;

const sum = (arr: number[]) => arr.reduce((prev, cur) => (prev + cur), 0);
const { keys:oKeys, values:oVals } = Object;

const getHeadings = (heights: Dict<number>) => {
  const keys = oKeys(heights);
  const vals = oVals(heights);
  keys.sort((a, b) => heights[a] - heights[b]);
  const total = sum(vals);
  let soFar = 0, i = 0;
  // headlines probably compose less than 10% of the book
  while ((soFar += heights[keys[i++]]) < .9*total);
  const hKeys = keys.slice(i).reverse();
  if (hKeys.length > 5) {
    console.warn('Too many heights to detect headings.');
  }
  const headings = {};
  for (let i = 0, height; i < 6 && i < hKeys.length; height = heights[keys[i++]]) {
    headings[height] = `h${i}`;
  }
  return headings;
}

const oMode = (dict: Dict<number>) => {
  const keys = oKeys(dict);
  keys.sort((a, b) => dict[b] - dict[a]);
  return keys[0];
}

const getAvgLength = (lengths: Dict<number>) => {
  let total = 0;
  for (const key of oKeys(lengths)) {
    total+=Number(key)*lengths[key];
  }
  return total / sum(oVals(lengths));
}

const getMaxLength = (lengths: Dict<number>) => {
  let keys = oKeys(lengths);
  if (!keys.length) {
    return undefined;
  }
  keys.sort((a, b) => lengths[a] - lengths[b]);
  const lowestFreq = lengths[0]
  const nextLowest = keys.findIndex(key => lengths[key] !== lowestFreq);
  keys = keys.slice(nextLowest ?? 0);
  // key is the length of the string
  const nums = keys.map(Number);
  nums.sort();
  return String(nums[0]);
}

const TRANSFORM_Y_INDEX = 5;

// merge all text items on same line to array of items
export class GatherStats extends Transform {
  constructor({styles}: {styles: Styles}) {
    super({objectMode: true})
    this.styles = styles;
  }
  styles: Styles;
  heights: Dict<number> = {} // frequency of heights of all characters, useful for detecting headings
  lengths: Dict<number> = {}
  leadings: Dict<number> = {}
  last: Line[] = [];
  _transform(line: Line, _encoding, cb) {
    const {heights, lengths, leadings, styles, last} = this;
    if (!line.length) {
      last.push(line);
      return cb();
    }

    if (line.every(item => styles[item.fontName].fontFamily === 'monospace' || item.str === '')) {
      last.push(line);
      return cb();
    }
    let str = '';
    for (const item of line) {
      if (!item.height || !item.str?.length) {
        continue;
      }
      str += item.str;
      heights[item.height] ??= 0;
      heights[item.height] += item.str.length;
    }
    if (!str.length) {
      last.push(line);
      return cb();
    }

    if (last.length) {
      const lastY = last[last.length - 1][0]?.transform[TRANSFORM_Y_INDEX];
      const curY = line[0].transform[TRANSFORM_Y_INDEX];

      if (curY < lastY) {
        const leading = lastY - curY - line[0].height;
        leadings[leading] ??= 0;
        leadings[leading]++;
      }
    }
    lengths[str.length] ??= 0;
    lengths[str.length]++;
    last.push(line);
    if (last.length > 10) {
      last.shift();
    }

    // console.log(str, str.length)
    cb()
  }
  _final() {
    const { heights, lengths, leadings } = this;
    const headings = getHeadings(heights);
    const modeLeading = oMode(leadings);
    const avgLength = getAvgLength(lengths);
    const maxLength = getMaxLength(lengths);
    console.log({
      heights,
      lengths,
      leadings,
    })
    console.log({
      headings,
      modeLeading,
      avgLength,
    })
    this.push({
      headings: getHeadings(heights),
      modeLeading: oMode(leadings),
      avgLength: getAvgLength(lengths),
      maxLength: getMaxLength(lengths),
    })
  }
}

