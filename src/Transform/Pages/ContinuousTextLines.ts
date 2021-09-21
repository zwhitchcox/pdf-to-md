import { TextContent } from "../../interfaces.js";
import { PageTransform } from "./Page.js";

// continuous output of text lines including styles
export class ContinuousTextLines extends PageTransform {
  styles = {}
  _transform(text: TextContent, _encoding, cb) {
    this.styles = {
      ...this.styles,
      ...text.styles,
    }
    for (const item of text.items) {
      this.push({styles: this.styles, line: item});
    }
    cb();
  }
}