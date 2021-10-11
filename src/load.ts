import pdfjs from 'pdfjs-dist/legacy/build/pdf.js';
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { Readable } from "stream";
import { TextItem as TI, TextStyle } from "pdfjs-dist/types/display/api";

export type TextItem = TI & {hasEOL: boolean};
export type TextContent = {
  styles: {[x: string]: TextStyle};
  items: TextItem[];
}

export async function*genPage(doc: PDFDocumentProxy) {
  for (let i = 0; i < doc.numPages; i++) {
    yield await doc.getPage(i+1).then(page => page.getTextContent())
  }
}

export async function loadDocument(file: string) {
  pdfjs.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.js';
  return pdfjs.getDocument(file).promise;
}

export async function getPageStream(doc: PDFDocumentProxy, options?: {highWaterMark?: number}) {
  return Readable.from(genPage(doc), {objectMode: true})
}

