import { Line, TextLines } from "../../interfaces.js";
import { LineTransform } from "./Base.js";

// convert "``_''" to '"_"'
export class ReplaceDoubleQuotes extends LineTransform {
  _transform({line, styles}: Line, _encoding, cb) {
    const newLine = [];
    for (let i = 0; i < line.length; i++) {
      const item = line[i]
      if (item.str.endsWith("``") && line[line.indexOf(item)+2]?.str?.startsWith("''")) {
        const item2 = line[line.indexOf(item)+1];
        const item3 = line[line.indexOf(item)+2];
        line.push({
          ...item,
          str: item.str.replace("``", '"'),
        }, {
          ...item2,
        }, {
          ...item3,
          str: item3.str.replace(/^''/, '"'),
        })
        i+=2
      } else {
        newLine.push(item)
      }
    }

    this.push({
      styles,
      line: newLine,
    })
    cb()
  }
}