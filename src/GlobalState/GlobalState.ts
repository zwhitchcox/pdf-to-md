import { TextStyle } from "pdfjs-dist/types/display/api"

type Dict<T> = {
  [key: string]: T
}

const DEFAULT_MIN_BLOCK_BUF = {
  percent: 0.25,
  pages: 100,
}

export class GlobalState {
  minBlockBuf = DEFAULT_MIN_BLOCK_BUF;
  blockBuffering = false;
  constructor(options: {
    minBlockBufPercent?: number;
    minBlockBufPages?: number;
  } = {}) {
    if (options.minBlockBufPercent) {
      this.minBlockBuf.percent = options.minBlockBufPercent;
    }
    if (options.minBlockBufPages) {
      this.minBlockBuf.pages = options.minBlockBufPages;
    }
  }
  heights: Dict<number> = {} // frequency of heights of all characters, useful for detecting headings
  styles: Dict<TextStyle> = {} // merged object of all page styles
  pages: {
    processed: number;
    total: number;
  } = {
    processed: 0, // # of pages we have gathered this info for
    total: 0, // total # of pages in doc
  }
}
