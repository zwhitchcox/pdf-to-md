import { LineTransform } from "./Transform/Lines/Base.js";
import { Line } from "./Transform/Lines/Lines.js";
import { TextLine } from "./Transform/Pages/PageTextLines.js";


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