import { TextStyle } from "pdfjs-dist/types/display/api"
import { Transform } from "stream";
import { TextContent, TextItem } from '../load.js'

export type Line = TextItem[];
export type Page = Line[]
export type Dict<T> = {
  [key: string]: T
}

export type Styles = Dict<TextStyle>;
export type Height = {
  fonts: string[];
  height: number;
  freq: number;
}
export type Heights = Dict<Height>;
export type Headings = number[];

export type _Heights = Dict<{
  fonts: Dict<boolean>;
  height: number;
  freq: number;
}>;

const copy = obj => JSON.parse(JSON.stringify(obj));

const getTotal = (heights: Heights) => {
  let total = 0;
  for (const height of Object.values(heights)) {
    total += height.freq;
  }
  return total;
}

const getHeadings = (heights: Heights) => {
  const heightsArr: Height[] = copy(Object.values(heights));
  heightsArr.sort((a, b) => a.height - b.height);
  const total = getTotal(heights);
  let soFar = 0, i = 0;
  // headlines probably compose less than 10% of the book
  while ((soFar += heightsArr[i++].freq) < .9*total);
  const headingHeights = heightsArr.slice(i).reverse();
  const headings = [];
  for (let i = 0; i < 6 && i < headingHeights.length; i++) {
    headings.push(headingHeights[i].height);
  }
  return headings;
}

const TRANSFORM_Y_INDEX = 5;

// merge all text items on same line to array of items
export class Preprocessing extends Transform {
  constructor() {
    super({objectMode: true})
  }
  styles: Styles = {} // merged object of all page styles
  heights: _Heights = {} // frequency of heights of all characters, useful for detecting headings
  lengths: Dict<number> = {}
  kernings: Dict<number> = {}
  _transform(text: TextContent, _encoding, cb) {
    const {styles, heights, lengths, kernings} = this;
    Object.assign(styles, text.styles);

    let items: TextItem[] = [];
    let str = '';
    let lastLineY;
    for (const item of text.items) {
      if (!item.height) {
        continue
      }
      items.push(item);
      const h = heights[item.height] ?? (heights[item.height] = {
        freq: 0,
        fonts: {},
        height: item.height,
      });
      h.freq += item.str.length;
      h.fonts[item.fontName] = true;
      str += item.str;
      if (item.hasEOL) {
        const curY = item.transform[TRANSFORM_Y_INDEX];
        if (lastLineY && lastLineY < curY) {
          const kerning = lastLineY - curY;
          kernings[kerning] ??= 0;
          kernings[kerning]++;
        }
        lastLineY = curY;
        lengths[str.length] ??= 0;
        lengths[str.length]++;
        str = '';
      }
    }
    cb()
  }
  _final() {
    const heights: Heights = {};
    let total = 0;
    for (const h of Object.values(this.heights)) {
      total += h.freq;
      heights[h.height] = {
        ...h,
        fonts: Object.keys(h.fonts),
      }
    }

    this.push({
      styles: this.styles,
      heights,
      headings: getHeadings(heights),
    })
  }
}