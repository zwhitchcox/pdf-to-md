import { TextStyle } from "pdfjs-dist/types/display/api"
import { Transform } from "stream";
import { TextItem } from '../load.js'

export type Line = TextItem[];
export type Page = Line[]
export type Dict<T> = {
  [key: string]: T
}
export type FreqMap = Dict<number>

export type Styles = Dict<TextStyle>;

const sum = (arr: number[]) => arr.reduce((prev, cur) => (prev + cur), 0);
const { keys:oKeys, values:oVals } = Object;
const getHeadings = (heightFreq: Dict<number>) => {
  const keys = oKeys(heightFreq);
  const vals = oVals(heightFreq);
  keys.sort((a, b) => heightFreq[b] - heightFreq[a]);
  const total = sum(vals);
  let soFar = 0, i = -1;
  let lowestCommon = Infinity;
  // headlines probably compose less than 10% of the book
  while ((soFar += heightFreq[keys[++i]]) < .9*total) {
    lowestCommon = Math.min(lowestCommon, Number(keys[i]));
  }
  let hKeys = keys.map(Number).slice(i).filter(key => key > lowestCommon);
  hKeys.sort();
  hKeys.reverse();

  if (hKeys.length > 5) {
    console.warn('Too many heightFreq to detect headings.');
  }
  const headings = {};
  // if there is more than one of a particular height, start at h2
  const offset = heightFreq[hKeys[0]] > 1 ? 1 : 0;
  for (let i = 0; i < 7 && i < hKeys.length; i++) {
    headings[hKeys[i]] = i + offset;
  }
  return headings;
}

const freqMapMode = (dict: Dict<number>) => {
  const keys = oKeys(dict);
  keys.sort((a, b) => dict[b] - dict[a]);
  return Number(keys[0]);
}

const freqMapAvg = (strLengths: Dict<number>) => {
  let total = 0;
  for (const key of oKeys(strLengths)) {
    total+=Number(key)*strLengths[key];
  }
  return total / sum(oVals(strLengths));
}


const freqMapMax = (map: FreqMap) => {
  let keys = oKeys(map);
  if (!keys.length) {
    return undefined;
  }
  keys.sort((a, b) => map[a] - map[b]);
  const lowestFreq = map[0]
  const nextLowest = keys.findIndex(key => map[key] !== lowestFreq);
  keys = keys.slice(nextLowest ?? 0);
  // key is the length of the string
  const nums = keys.map(Number);
  nums.sort((a, b) => b - a);
  return nums[0];
}


const TRANSFORM_Y_INDEX = 5;

// merge all text items on same line to array of items
export class GatherStats extends Transform {
  constructor({styles}: {styles: Styles}) {
    super({objectMode: true})
    this.styles = styles;
  }
  styles: Styles;
  heights: FreqMap = {} // frequency of heights of all characters, useful for detecting headings
  strLengths: FreqMap = {}
  leadings: FreqMap = {}
  last: Line[] = [];
  _transform(line: Line, _encoding, cb) {
    const {heights, strLengths, leadings, styles, last} = this;
    if (!line.length) {
      last.push(line);
      return cb();
    }

    if (line.every(item => styles[item.fontName].fontFamily === 'monospace' || item.str === '')) {
      last.push(line);
      return cb();
    }
    let str = '';
    let lastItemY;
    for (const item of line) {
      const itemY = item?.transform[TRANSFORM_Y_INDEX];
      let hasEOL = item.hasEOL;
      if (Math.abs(itemY - lastItemY) > item.height) {
        hasEOL = true;
      }
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
    strLengths[str.length] ??= 0;
    strLengths[str.length]++;
    // if (str.length > 180) {
    //   for (const item of line) {
    //     console.log(item)
    //   }
    //   console.log(str)
    // }
    last.push(line);
    if (last.length > 10) {
      last.shift();
    }

    // console.log(str, str.length)
    cb()
  }
  _final() {
    const { heights, strLengths, leadings } = this;
    const headings = getHeadings(heights);
    const modeLeading = freqMapMode(leadings);
    const avgStrLength = freqMapAvg(strLengths);
    const maxStrLength = freqMapMax(strLengths);
    // console.log({
      // heights,
      // strLengths,
      // leadings,
    // })
    console.log({
      headings,
      modeLeading,
      avgStrLength,
      maxStrLength,
    })
    this.push({
      headings: getHeadings(heights),
      leadings: {
        mode: freqMapMode(leadings)
      },
      strLength: {
        avg: freqMapAvg(strLengths),
        max: freqMapMax(strLengths),
      }
    })
  }
}

