import { TextLine } from "./interfaces.js";
import { LineTransform } from "./Transform/Lines/Lines.js";


const joinLine = (line: TextLine) => line.map(item => item.str).join('')

export class ToMD extends LineTransform {
  _transform(line: TextLine, _encoding, cb) {
    console.log(joinLine(line));
    cb();
  }
}