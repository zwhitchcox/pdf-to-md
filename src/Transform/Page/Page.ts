import { TransformOptions } from "stream";
import { DEFAULT_BUF_LEN, TransformObjectMode } from "../ObjectMode";

// use default buffer length for pages
export class PageTransform extends TransformObjectMode {
  constructor(opts: Omit<TransformOptions, 'objectMode'> = {}) {
    super({
      ...opts,
      highWaterMark: opts.highWaterMark ?? DEFAULT_BUF_LEN,
    });
  }
}
