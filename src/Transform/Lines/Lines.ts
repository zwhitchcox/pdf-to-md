import { debuglog } from "util";
import { Line } from "../Pages/Preprocessing.js";
import { LineTransform } from "./Base.js";

const debug = debuglog('pdf-to-md-debug');

export class Lines extends LineTransform {
  _transform(page: Line[], _encoding, cb) {
    for (const line of page) {
      debug('line', line);
      this.push(line);
    }
    cb()
  }
}