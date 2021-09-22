import { TextContent } from "pdfjs-dist/types/display/api"
import { PageTransform } from "./Base"

// // really need at least 100 pages for a good sample size
// // for detecting headings and whatnot
// const PAGE_BUF = 100;
//   constructor(opts: TransformOptions = {}) {
//     super({
//       ...opts,
//       highWaterMark: opts.highWaterMark || PAGE_BUF,
//     })
//   }

export class GatherStyles extends PageTransform {
  styles = {}
  _transform(page: TextContent, encoding, cb) {
    // combine all styles into single object
    Object.assign(this.styles, page.styles)
    page.styles = this.styles
    cb()
  }
  _final() {
    this.emit('styles', this.styles);
  }
}
