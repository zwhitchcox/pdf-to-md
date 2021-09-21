import pdfjs from 'pdfjs-dist/legacy/build/pdf.js';
import { test } from '../test/test.js';
import { fileURLToPath } from 'url';
import * as path from 'path';

import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
import { Readable } from "stream";
import { DEFAULT_BUF_LEN } from "./constants.js";
import { OnProgressFn } from './interfaces.js';

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

export async function loadDocument(file: string) {
  pdfjs.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.js';
  const loadingTask = pdfjs.getDocument(file);
  return await loadingTask.promise;
}

export async function getTextStream(file: string, options?: {highWaterMark?: number, onProgress?: OnProgressFn}) {
  const doc = await loadDocument(file);
  const highWaterMark = options?.highWaterMark ?? DEFAULT_BUF_LEN;
  const objectMode = true;
  return Readable.from(genText(doc, options?.onProgress), {objectMode, highWaterMark})
}