import { TextStyle } from "pdfjs-dist/types/display/api"
import { Transform } from "stream";
import { TextContent, TextItem } from '../load.js'

export type Line = TextItem[];
export type Page = Line[]
export type Dict<T> = {
  [key: string]: T
}

export type Styles = Dict<TextStyle>;
export type Heights = Dict<number>;

// merge all text items on same line to array of items
export class Preprocessing extends Transform {
  styles: Styles = {} // merged object of all page styles
  heights: Heights = {} // frequency of heights of all characters, useful for detecting headings
  _transform(text: TextContent, _encoding, cb) {
    const {styles, heights} = this;
    Object.assign(styles, text.styles);

    const lines: Line[] = [];
    let items: TextItem[] = [];
    let str = '';
    for (const item of text.items) {
      items.push(item);
      heights[item.height] = (heights[item.height] ?? 0) + item.str.length;
      str += item.str;
      if (item.hasEOL) {
        lines.push(items);
        str = '';
        items = [];
      }
    }
    cb()
  }
  _final() {
    this.push({
      styles: this.styles,
      heights: this.heights,
    })
  }
}