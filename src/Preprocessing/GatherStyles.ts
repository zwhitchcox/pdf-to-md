import { TextStyle } from "pdfjs-dist/types/display/api"
import { Transform } from "stream";
import { Dict } from "../interfaces.js";
import { TextContent } from '../load.js'

export type Styles = Dict<TextStyle>;

// merge all text items on same line to array of items
export class GatherStyles extends Transform {
  constructor(public styles: Styles) {
    super({objectMode: true})
  }
  _transform(text: TextContent, _encoding, cb) {
    Object.assign(this.styles, text.styles);
    cb()
  }
  _final() {
    this.push(this.styles);
  }
}
