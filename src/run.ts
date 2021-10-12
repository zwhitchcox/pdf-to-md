import { pipeline } from "stream";
import EventEmitter from "events";
import { Markdown } from "./Transform/Markdown/Markdown.js";
import { StripMargins } from "./Transform/Pages/StripMargins.js";
import { ToPageLines } from "./Transform/Pages/ToPageLines.js";
import { ToLines } from "./Transform/Lines/ToLines.js";
import { ReplaceWeirdDoubleQuotes } from "./Transform/Lines/ReplaceWeirdDoubleQuotes.js";
import { Paragraph } from "./Transform/Blocks/Paragraph.js";
import { getPageStream, loadDocument } from "./load.js";
import { gatherStats } from "./Preprocessing/gather.js";

export async function run(file: string) {
  const doc = await loadDocument(file);
  const global = await gatherStats(await getPageStream(doc))
  const emitter = new EventEmitter;
  const stream = await getPageStream(doc)
  const last = new Markdown;
  pipeline(
    stream,
    // Pages
    new ToPageLines,
    new StripMargins,
    // Lines
    new ToLines,
    new ReplaceWeirdDoubleQuotes,
    // Block
    new Paragraph(global),
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
