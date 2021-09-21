import { Transform } from "stream";
import { TextContent } from "./interfaces";
import { hashLine } from "./util";

type HashFreq = {[key: string]: number}

const getHeaderOrFooterHash = (freqs, total) => {
  let headerOrFooter = [];
  const hashes = Object.keys(freqs).sort();
  for (let i = 0; i < hashes.length; i++) {
    const freq = freqs[hashes[i]]
    // if the same hash exists 2/3s of the time, it's probably
    // a page number, book title, etc., and thus, a header/footer
    if (freq/total > 2/3) {
      const hash = hashes[i]
      headerOrFooter.push(hash)
      while (i < hashes.length && hash.charAt(0) === hashes[i+1]?.charAt(0)) {
        i++;
      }
    }
  }
  return headerOrFooter
}

export class HeaderFooterHashes extends Transform {
  constructor(opts) {
    super({
      ...opts,
      highWaterMark: opts.highWaterMark,
    });
  }
  startFreqs: HashFreq = {};
  endFreqs: HashFreq = {};
  totalPages = 0;
  _transform(text: TextContent, encoding, cb) {
    let i = 0;
    let j = text.items.length - 1;
    while (i < j) {
      const startHash = `${i}${hashLine(text[i])}`
      this.startFreqs[startHash] = (this.startFreqs[startHash] ?? 0) + 1
      const endHash = `${i}${hashLine(text[j])}`
      this.endFreqs[startHash] = (this.endFreqs[endHash] ?? 0) + 1
    }
    this.totalPages++
    cb();
  }
  _final() {
    const header = getHeaderOrFooterHash(this.startFreqs, this.totalPages);
    const footer = getHeaderOrFooterHash(this.endFreqs, this.totalPages);
    this.push({header, footer})
  }
}

