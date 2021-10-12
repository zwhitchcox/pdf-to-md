import { once } from "events";
import { Duplex, pipeline, Readable, Transform } from "stream";
import { Dict } from "../interfaces.js";
import { ToLines } from "../Transform/Lines/ToLines.js";
import { StripMargins } from "../Transform/Pages/StripMargins.js";
import { ToPageLines } from "../Transform/Pages/ToPageLines.js";
import { GatherStats } from "./GatherStats.js";
import { GatherStyles, Styles } from "./GatherStyles.js";

export type Stats = {
  styles: Styles;
  headings: Dict<string>;
  modeLeading: number;
  avgLineLength: number;
}

async function gather<T = any>(stream: Readable, t1: Transform, ...transforms: Transform[]): Promise<T> {
  pipeline(stream, t1, ...transforms, err => {
    if (err) {
      throw err;
    }
  });
  const last = transforms.length ? transforms[transforms.length - 1] : t1;
  // @ts-ignore
  return once(t1, 'data')
}

export const gatherStatsAndStyles = stream => {
  const styles = {}
  Promise.all([
    gather(stream, new GatherStyles(styles)),
    gather(stream, new ToPageLines, new StripMargins, new ToLines, new GatherStats({styles})),
  ])
}