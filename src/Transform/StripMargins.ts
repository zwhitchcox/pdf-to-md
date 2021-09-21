// Strip the top and bottom margins from the page.
//
// We create a hash of each line of the page, excluding numbers (e.g., page numbers) and spaces,
// from top to bottom and bottom to top.
//
// If the next page has matching hash lines at the top or bottom, we remove them, outward-in,
// until we see a non-matching line or reach the end (meaning all lines matched).
//
// Skip blank pages

import { Transform, TransformOptions } from "stream";
import { DEFAULT_BUF_LEN } from "../constants";
import { TextLines } from "../interfaces";
import { hashLine } from "../util";


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
  items: text.items.slice(start, text.items.length - end),
})

const hashPage = (text: TextLines) => text.items.map(hashLine);

export class StripMargins extends Transform {
  constructor(opts: Omit<TransformOptions, 'objectMode'> = {}) {
    super({
      ...opts,
      highWaterMark: opts.highWaterMark ?? DEFAULT_BUF_LEN,
      objectMode: true,
    });
  }

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

    if (top < bot) { // ignore blank pages
      this.push(strip(prevText, top, bot))
    }

    cb();
  }

  _final(cb) {
    if (this.prevText) {
      // previous page compared to current page, so
      // top and bottom margins will be the same
      const {top, bot} = this.prevMarg;
      this.push(strip(this.prevText, top, bot))
    }
    cb()
  }
}