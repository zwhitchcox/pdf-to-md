import { Transform } from 'stream';
import { TextContent, TextItem } from '../../load.js'

export type Line = TextItem[];
export type Page = Line[]

// merge all text items to same line
export class ToPageLines extends Transform {
  constructor() {
    super({objectMode: true});
  }
  _transform(text: TextContent, _encoding, cb) {
    const lines: Line[] = [];
    let items: TextItem[] = [];
    for (const item of text.items) {
      items.push(item);
      if (item.hasEOL) {
        lines.push(items);
        items = [];
      }
    }
    this.push(lines)
    cb()
  }
}