import { pipeline } from "stream";
import { Preprocessing, Styles, Heights, Headings, Height } from "./Preprocessing.js";

type Stats = {
  styles: Styles;
  heights: Heights;
  headings: Headings;
  mostUsedLeading: number;
  avgLineLength: number;
}

export const gatherStats = stream => (
  new Promise<Stats>((res, rej) => {
    const pre = new Preprocessing;
    pipeline(stream, pre, err => {
      if (err) {
        return rej(err)
      }
    });
    pre.on('data', res)
  })
)