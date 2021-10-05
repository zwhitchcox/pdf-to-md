import { TextContent, TextItem } from '../../init/load.js'
import { PageTransform } from "./Base.js";

export type Line = TextItem[];
export type Page = Line[]

// merge all text items to same line
export class Preprocessing extends PageTransform {
  _transform(text: TextContent, _encoding, cb) {
    const state = this.globalState;
    const {styles, heights, pages, minBlockBuf} = state;
    Object.assign(styles, text.styles);
    pages.processed++

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
    if (this.globalState.blockBuffering) {
      if (pages.processed > minBlockBuf.pages || pages.processed/pages.total > minBlockBuf.percent) {
        state.blockBuffering = false
      }
    }
    this.push(lines)
    cb()
  }
}