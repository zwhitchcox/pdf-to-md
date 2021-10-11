import { Transform } from "stream";
import { Line } from "../../Preprocessing/Preprocessing.js";

export class Paragraph extends Transform {
  constructor() {
    super({objectMode: true});
  }
  _transform(line: Line, _encoding, cb) {
    cb();
  }
}
