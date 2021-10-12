import { Transform } from "stream";
import { Stats } from "../../Preprocessing/gather.js";
import { Line } from "../../Preprocessing/Preprocessing.js";

const lineToString = (line: Line) => line.map(item => item.str).join('')
const TRANSFORM_Y_INDEX = 5;

const getY = (line: Line) => line[0]?.transform[TRANSFORM_Y_INDEX];

export class Paragraph extends Transform {
  queue: Line[];
  paragraph: Line;
  constructor(public stats: Stats) {
    super({objectMode: true});
  }
  _transform(cur: Line, _encoding, cb) {
    const {queue, paragraph, stats} = this;
    if (queue.length < 3) {
      queue.push(cur);
      return cb();
    }
    const curY = getY(cur);
    const prevY = getY(prev)
    if (curY < prevY) {
      if (lineToString(prev).length < stats.avgLineLength * .8) {

      }
    }
    const leading = prevLine[0]?.transform[TRANSFORM_Y_INDEX]
    if (inParagraph && leading > stats.modeLeading) {
    }
    this.prevLine
    cb();
  }
  _final() {
    this.push({type: 'p', val: this.paragraph.concat(this.prev)});
  }
}
