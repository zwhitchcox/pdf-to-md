import { pipeline, Readable } from "stream";
import EventEmitter from "events";
import { Heights, Styles } from "./Preprocessing/Preprocessing.js";
import { Markdown } from "./Transform/Markdown/Markdown.js";
import { StripMargins } from "./Transform/Pages/StripMargins.js";
import { ToPageLines } from "./Transform/Pages/ToPageLines.js";
import { ToLines } from "./Transform/Lines/ToLines.js";
import { ReplaceWeirdDoubleQuotes } from "./Transform/Lines/ReplaceWeirdDoubleQuotes.js";

export function run(stream: Readable, global: {
  styles: Styles;
  headings: number[];
  heights: Heights;
}) {
  const emitter = new EventEmitter;
  const last = new Markdown;
  pipeline(
    stream,
    new ToPageLines,
    new StripMargins,
    new ToLines,
    new ReplaceWeirdDoubleQuotes,
    last,
    err => {
      if (err) {
        emitter.emit('error', err);
      }
    }
  )
  last.on('data', d => emitter.emit('data', d))
  return emitter;
}
