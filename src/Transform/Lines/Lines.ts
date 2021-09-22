import { TextLines } from "../../interfaces.js";
import { LineTransform } from "./Base.js";

export class Lines extends LineTransform {
  _transform(text: TextLines, _encoding, cb) {
    const { lines, styles } = text
    for (const line of lines) {
      this.push({styles, line})
    }
    cb()
  }
}