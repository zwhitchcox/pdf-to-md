import { LineTransform } from "../Lines/Base.js";
import { Line } from "../Pages/Preprocessing.js";


const joinLine = (line: Line) => line.map(item => item.str).join('')

export class ToMD extends LineTransform {
  _transform(line: Line, _encoding, cb) {
    console.log(joinLine(line));
    cb();
  }
}