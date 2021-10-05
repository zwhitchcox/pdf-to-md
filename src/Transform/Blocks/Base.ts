import { TransformOptions } from "stream";
import { GlobalState } from "../../GlobalState/GlobalState.js";
import { DEFAULT_BUF_LEN, TransformObjectMode } from "../ObjectMode.js";

// use default buffer length for lines
export class BlockTransform extends TransformObjectMode {
  globalState: GlobalState;
  constructor(opts: Omit<TransformOptions, 'objectMode'> & {globalState: GlobalState}) {
    super({
      ...opts,
      highWaterMark: opts.highWaterMark ?? DEFAULT_BUF_LEN * 50, // Assume ~50 lines per page
    });
    this.globalState = opts.globalState;
  }
}