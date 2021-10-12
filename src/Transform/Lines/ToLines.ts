import { Transform } from "stream";
import { Line } from "../Pages/ToPageLines";


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