import { Transform } from "stream";

class StripRepetitive extends Transform {
  constructor(opts) {
    super({
      ...opts,
      highWaterMark: opts.highWaterMark,
    })
  }
  _transform(page, encoding, cb) {

  }
}
