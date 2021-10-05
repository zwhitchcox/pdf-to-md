import { Line } from "../Pages/Preprocessing.js";
import { BlockTransform } from "./Base.js";

export class TOC extends BlockTransform {
  buf = [];
  flushed = false;
  _transform(line: Line, _encoding, cb) {
    cb()
  }
}