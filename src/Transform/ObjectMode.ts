import { Transform, TransformOptions } from "stream";

export const DEFAULT_BUF_LEN = 16; // number of pages to load at a time

// transform base for all streams. They should all be in object mode
export class TransformObjectMode extends Transform {
  constructor(opts: Omit<TransformOptions, 'objectMode'> = {}) {
    super({
      ...opts,
      objectMode: true,
    });
  }
}