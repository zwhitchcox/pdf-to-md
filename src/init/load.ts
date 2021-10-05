import pdfjs from 'pdfjs-dist/legacy/build/pdf.js';
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { Readable } from "stream";
import { OnProgressFn } from '../interfaces.js';
import { DEFAULT_BUF_LEN } from '../Transform/ObjectMode.js';
import { TextItem as TI, TextStyle } from "pdfjs-dist/types/display/api";

export type TextItem = TI & {hasEOL: boolean};
export type TextContent = {
  styles: {[x: string]: TextStyle};
  items: TextItem[];
}

export function*genText(doc: PDFDocumentProxy, onProgress?) {
  const buf = []
  const add = (i: number) => {
    if (onProgress) {
      onProgress(i / doc.numPages);
    }
    buf.push(doc.getPage(i+1).then(page => page.getTextContent()))
  }
  for (let i = 0; i < Math.min(DEFAULT_BUF_LEN, doc.numPages); i++) {
    add(i);
  }
  for (let i = 0; i < doc.numPages; i++) {
    yield buf[i];
    const cursor = i + DEFAULT_BUF_LEN;
    if (cursor < doc.numPages) {
      add(i)
    }
  }
}

export async function loadDocument(file: string) {
  pdfjs.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.js';
  return pdfjs.getDocument(file).promise;
}

export async function getTextStream(doc: PDFDocumentProxy, options?: {highWaterMark?: number, onProgress?: OnProgressFn}) {
  const highWaterMark = options?.highWaterMark ?? DEFAULT_BUF_LEN;
  const objectMode = true;
  return Readable.from(genText(doc, options?.onProgress), {objectMode, highWaterMark})
}