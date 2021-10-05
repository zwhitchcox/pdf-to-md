import { Line } from "../Pages/Preprocessing.js";
import { BlockTransform } from "./Base.js";

export class Buffer extends BlockTransform {
  buf = [];
  flushed = false;
  _transform(line: Line, _encoding, cb) {
    if (this.globalState.blockBuffering) {
      this.buf.push(line)
    } else {
      for (const line of this.buf) {
        this.push(line);
      }
    }
    this.push(line);
    cb()
  }
}