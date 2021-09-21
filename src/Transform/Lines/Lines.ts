import { TransformOptions } from "stream";
import { DEFAULT_BUF_LEN, TransformObjectMode } from "../ObjectMode.js";

// use default buffer length for lines
export class LineTransform extends TransformObjectMode {
  constructor(opts: Omit<TransformOptions, 'objectMode'> = {}) {
    super({
      ...opts,
      highWaterMark: opts.highWaterMark ?? DEFAULT_BUF_LEN * 50, // Assume ~50 lines per page
    });
  }
}

