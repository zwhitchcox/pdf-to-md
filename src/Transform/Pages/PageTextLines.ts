import { TextContent } from "../../interfaces.js";
import { PageTransform } from "./Page.js";


// merge all text items to same line
export class PageTextLines extends PageTransform {
  _transform(text: TextContent, _encoding, cb) {
    const items = text.items;
    let cursor = 0;
    const lines = []
    while (cursor < items.length) {
      const line = [];
      let item;
      while ((item = items[cursor++]) && !item.hasEOL) {
        line.push(item)
      }
      if (item) {
        line.push(item)
      }
      lines.push(line)
    }
    this.push({
      styles: text.styles,
      lines,
    })
    cb()
  }
}
