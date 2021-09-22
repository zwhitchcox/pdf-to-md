import { TextStyle } from "pdfjs-dist/types/display/api";
import { TextLine, TextLines } from "../Pages/PageTextLines.js";
import { LineTransform } from "./Base.js";

export type Line = {
  styles: {[x: string]: TextStyle};
  line: TextLine;
}

export class Lines extends LineTransform {
  _transform(text: TextLines, _encoding, cb) {
    const { lines, styles } = text
    for (const line of lines) {
      this.push({styles, line})
    }
    cb()
  }
}