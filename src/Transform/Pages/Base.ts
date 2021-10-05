import { TransformOptions } from "stream";
import { GlobalState } from "../../GlobalState/GlobalState.js";
import { DEFAULT_BUF_LEN, TransformObjectMode } from "../ObjectMode.js";

// use default buffer length for pages
export class PageTransform extends TransformObjectMode {
  globalState: GlobalState;
  constructor(opts: Omit<TransformOptions, 'objectMode'> & {globalState: GlobalState}) {
    super({
      ...opts,
      highWaterMark: opts.highWaterMark ?? DEFAULT_BUF_LEN,
    });
    this.globalState = opts.globalState;
  }
}
