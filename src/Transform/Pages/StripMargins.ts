import { TextLines, TextItem } from "../../interfaces.js";
import { PageTransform } from "./Page.js";

const MIN_DIGIT_CHAR_CODE = "0".charCodeAt(0);
const MAX_DIGIT_CHAR_CODE = "9".charCodeAt(0);
const isDigit = char => char >= MIN_DIGIT_CHAR_CODE && char <= MAX_DIGIT_CHAR_CODE;

// create a hash of each line of the page, excluding numbers (e.g., page numbers) and spaces
export function hashLine(line: TextItem[]) {
  let string = ''
  for (const item of line) {
    string += item.str;
  }
  var hash = 0;
  if (string.trim().length === 0) return hash;
  for (var i = 0; i < string.length; i++) {
    const charCode = string.charCodeAt(i);
    if (!isDigit(charCode) && charCode != 32 && charCode != 160) {
      hash = ((hash << 5) - hash) + charCode;
      hash |= 0; // Convert to 32bit integer
    }
  }
  return hash;
}

const reverse = (arr: any[]) => arr.slice().reverse();

const detectMargin = (h1, h2) => {
  let i = 0;
  while (h1[i] === h2[i]) {
    i++
  }
  return i;
}

const strip = (text: TextLines, start: number, end: number) => ({
  ...text,
  lines: text.lines.slice(start, text.lines.length - end),
})

const hashPage = (text: TextLines) => text.lines.map(hashLine);

// Strip margins from the page by comparing a hash of previous and current
// page lines, from top-to-bottom and bottom-to-top
export class StripMargins extends PageTransform {
  prevHash: {
    topHash: number[]; // hash of lines top-down
    botHash: number[]; // hash of lines bot-up
  };
  prevText: TextLines;
  prevMarg: {
    top: number; // # of lines removed from top of previous text
    bot: number; // # of lines removed from bot of previous text
  };

  _transform(text: TextLines, _encoding, cb) {
    const {prevHash, prevText} = this;
    this.prevText = text

    const topHash = hashPage(text);
    const botHash = reverse(topHash);

    this.prevHash = {
      topHash,
      botHash,
    }

    if (!prevHash) {
      // we are on first page, nothing to compare against
      this.prevMarg = {
        top: 0,
        bot: 0,
      }
      return cb();
    }

    // number of matching lines in previous/cur page
    const top = detectMargin(prevHash.topHash, topHash);
    const bot = detectMargin(prevHash.botHash, botHash);

    this.prevMarg = {
      top,
      bot,
    }

    const len = topHash.length
    if (top >= len - 1 || bot >= len - 1) { // ignore blank pages
      return cb();
    }

    this.push(strip(prevText, top, bot))
    cb();
  }

  _flush(cb) {
    try {
      if (this.prevText) {
        // previous page compared to current page, so
        // top and bottom margins will be the same
        const {top, bot} = this.prevMarg;
        this.push(strip(this.prevText, top, bot))
      }
    } catch (err) {
      console.error('error final', err)
    }
    cb()
  }
}