import { Transform } from 'stream';
import { TextContent, TextItem } from '../../load.js'

export type Line = TextItem[];
export type Page = Line[]

const TRANSFORM_Y_INDEX = 5;

// merge all text items to same line
export class ToPageLines extends Transform {
  constructor() {
    super({objectMode: true});
  }
  _transform(text: TextContent, _encoding, cb) {
    const lines: Line[] = [];
    let items: TextItem[] = [];
    let lastItemY;

    const endLine = () => {
      lines.push(items);
      items = [];
    }

    for (const item of text.items) {
      const itemY = item?.transform[TRANSFORM_Y_INDEX];
      const deltaY = lastItemY - itemY;
      // sometimes hasEOL is wrong, so measure delta y between two lines
      if (item.height && deltaY > item.height/2) {
        endLine();
        continue;
      }
      items.push(item);
      if (item.hasEOL) {
        endLine();
      }
      lastItemY = itemY;
    }
    this.push(lines)
    cb()
  }
}