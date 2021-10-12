import { Transform } from "stream";
import { Line } from "../../Preprocessing/Preprocessing.js";


const joinLine = (line: Line) => line.map(item => item.str).join('')

export class Markdown extends Transform {
  constructor() {
    super({objectMode: true});
  }
  _transform(line: Line, _encoding, cb) {
    console.log(joinLine(line));
    cb();
  }
}