import { Line, TextLine, TextLines } from "./interfaces.js";
import { LineTransform } from "./Transform/Lines/Base.js";


const joinLine = (line: TextLine) => line.map(item => item.str).join('')

export class ToMD extends LineTransform {
  _transform({line}: Line, _encoding, cb) {
    console.log(joinLine(line))
    cb()
    // for (const line of textLines.lines) {
    //   console.log(joinLine(line));
    // }
    // cb();
  }
}