import { PageTransform } from "./Base.js";
import { TextLines } from "./PageTextLines.js";

// continuous output of text lines including styles
export class ContinuousTextLines extends PageTransform {
  styles = {}
  _transform(text: TextLines, _encoding, cb) {
    this.styles = {
      ...this.styles,
      ...text.styles,
    }
    for (const line of text.lines) {
      this.push({styles: this.styles, line});
    }
    cb();
  }
}