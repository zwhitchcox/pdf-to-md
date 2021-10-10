import { pipeline } from "stream";
import { Preprocessing, Styles, Heights } from "./Preprocessing.js";

export const gatherStylesAndHeights = stream => (
  new Promise<{styles: Styles, heights: Heights}>((res, rej) => {
    const pre = new Preprocessing;
    pipeline(stream, pre, err => {
      if (err) {
        return rej(err)
      }
    });
    pre.on('data', res)
  })
)