import { Transform } from "stream";
import { Line } from "./ToPageLines";

export type PageInfo = {
  text: Line[];
  hash: {
    top: number[]; // hash of lines top-down
    bot: number[]; // hash of lines bot-up
  };
  margin: {
    top: number; // # of lines removed from top of previous text
    bot: number; // # of lines removed from bot of previous text
  }
};

const MIN_DIGIT_CHAR_CODE = "0".charCodeAt(0);
const MAX_DIGIT_CHAR_CODE = "9".charCodeAt(0);
const isDigit = char => char >= MIN_DIGIT_CHAR_CODE && char <= MAX_DIGIT_CHAR_CODE;

// create a hash of each line of the page, excluding numbers (e.g., page numbers) and spaces
export function hashLine(line: Line) {
  let string = ''
  for (const item of line) {
    string += item.str;
  }
  let hash = 0;
  if (string.trim().length === 0) return hash;
  for (let i = 0; i < string.length; i++) {
    const charCode = string.charCodeAt(i);
    if (!isDigit(charCode) && charCode != 32 && charCode != 160) {
      hash = ((hash << 5) - hash) + charCode;
      hash |= 0; // Convert to 32bit integer
    }
  }
  return hash;
}

const hashPage = (page: Line[]): number[] => page.map(hashLine);


// output only text between margins
const strip = (page: PageInfo): Line[] => {
  const { text, margin } = page;
  return text.slice(margin.top, text.length - margin.bot);
}

const detectMargin = (h1, h2) => {
  if (!(h1 && h2)) {
    return 0;
  }
  let i = 0;
  while (h1[i] === h2[i]) {
    i++
  }
  return i;
}

const reverse = (arr: any[]) => arr.slice().reverse();
// We check margins from both directions.
//
// Overlapping top/bottom margins will just mean the
// page is blank.
const getHash = (page: Line[]) => {
  const top = hashPage(page);
  const bot = reverse(top);
  return {top, bot};
}

const maxMargin = (m1: PageInfo["margin"], m2: PageInfo["margin"]) => {
  return {
    // We compare top and bottom margins separately, because
    // the top margin may contain the book title for instance
    top: Math.max(m1?.top || 0, m2?.top || 0),
    bot: Math.max(m1?.top || 0, m2?.top || 0),
  }
}

const getMargin = (h1: PageInfo["hash"], h2: PageInfo["hash"]) => {
  return {
    top: detectMargin(h1?.top, h2?.top),
    bot: detectMargin(h1?.bot, h2?.bot),
  }
}

const getInfo = (prev: PageInfo, text: Line[]) => {
  const hash = getHash(text);
  const margin = getMargin(hash, prev?.hash)
  return {
    text,
    hash,
    margin,
  }
}

export class StripMargins extends Transform {
  constructor() {
    super({objectMode: true});
  }
  prev: PageInfo;

  _transform(page: Line[], _encoding, cb) {
    const {prev} = this;

    // Gather page info, comparing hash of previous page's lines,
    // excluding numbers and spaces, to hash of current page's lines,
    // from top-to-bottom and bottom-to-top.
    //
    // Matching hash lines constitute a margin, because the same line of
    // the previous page contained the same content.
    //
    // We exclude numbers because page numbers change every page.
    const cur = getInfo(prev, page);
    this.prev = cur;
    if (!prev) { // on first page, nothing to push
      return cb();
    }

    // Detected margins are saved from the previous page's previous page.
    // Getting the maximum of the previous and current page's margins
    // means we're getting the maximum of both surrounding pages.
    const {top, bot} = maxMargin(cur.margin, prev?.margin);
    if (top + bot < prev.text.length) {
      // output page if not blank
      this.push(strip(prev))
    }

    cb();
  }

  _flush(cb) {
    // there is no next page to compare to, so margins are set
    this.push(strip(this.prev))
    cb()
  }
}