import { TextContent, TextItem } from "pdfjs-dist/types/display/api";
import { Transform, TransformOptions } from "stream";
import { DEFAULT_BUF_LEN } from "./constants.js";

type TI = TextItem & {hasEOL: boolean};

export class ToLines extends Transform {
  constructor(opts: TransformOptions = {}) {
    super({
      ...opts,
      objectMode: true,
      highWaterMark: opts.highWaterMark || DEFAULT_BUF_LEN,
    })
  }

  _transform(text: TextContent, encoding, cb) {
    const items = text.items as TI[];
    for (const item of items) {
      console.log(item)
    }
    let cursor = 0;
    while (cursor < items.length) {
      const line = [];
      let item;
      while ((item = items[cursor++]) && !item.hasEOL) {
        line.push(item)
      }
      this.push(line)
    }
  }
}
