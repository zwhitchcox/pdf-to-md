import { Transform, TransformOptions } from "stream";
import { DEFAULT_BUF_LEN } from "./constants.js";
import { TextContent } from "./interfaces.js";


export class ToTextLines extends Transform {
  constructor(opts: TransformOptions = {}) {
    super({
      ...opts,
      objectMode: true,
      highWaterMark: opts.highWaterMark || DEFAULT_BUF_LEN,
    })
  }

  _transform(text: TextContent, _encoding, cb) {
    const items = text.items;
    let cursor = 0;
    const page = []
    while (cursor < items.length) {
      const line = [];
      let item;
      while ((item = items[cursor++]) && !item.hasEOL) {
        line.push(item)
      }
      if (item) {
        line.push(item)
      }
      page.push(line)
    }
    this.push(page)
    cb()
  }
}
