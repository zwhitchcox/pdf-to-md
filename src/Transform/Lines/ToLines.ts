import { Transform } from "stream";
import { Line } from "../../Preprocessing/Preprocessing.js";


export class ToLines extends Transform {
  constructor() {
    super({objectMode: true})
  }
  _transform(page: Line[], _encoding, cb) {
    for (const line of page) {
      this.push(line);
    }
    cb()
  }
}