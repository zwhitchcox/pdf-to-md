import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { Readable } from "stream";
import { DEFAULT_BUF_LEN } from "./constants.js";

export function*genText(doc: PDFDocumentProxy, onProgress?) {
  const buf = []
  const add = (i: number) => {
    if (onProgress) {
      onProgress(i / doc.numPages);
    }
    buf.push(doc.getPage(i+1).then(page => page.getTextContent()))
  }
  for (let i = 0; i < Math.min(DEFAULT_BUF_LEN, doc.numPages); i++) {
    add(i)
  }
  for (let i = 0; i < doc.numPages; i++) {
    yield buf[i]
    const cursor = i + DEFAULT_BUF_LEN;
    if (cursor < doc.numPages) {
      add(i)
    }
  }
}

type OnProgressFn = (num: number) => any

export function getTextStream(doc: PDFDocumentProxy, options?: {highWaterMark?: number, onProgress?: OnProgressFn}) {
  const highWaterMark = options?.highWaterMark ?? DEFAULT_BUF_LEN;
  const objectMode = true;
  return Readable.from(genText(doc, options?.onProgress), {objectMode, highWaterMark})
}
