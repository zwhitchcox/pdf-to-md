import pdfjs from 'pdfjs-dist/legacy/build/pdf.js';
import { expect, test } from './test.js';
import { fileURLToPath } from 'url';
import * as path from 'path';
import { PDFDocumentProxy, PDFPageProxy, TextContent } from 'pdfjs-dist/types/display/api';
import { Readable, ReadableOptions } from 'stream';

// number of pages to process at a time
const BUF_LEN = 16;

function getPageItems(doc: PDFDocumentProxy, i: number) {
  const pageP = doc.getPage(i+1)
  return [pageP, pageP.then(page => page.getTextContent())]
}

async function*genPageItems(doc: PDFDocumentProxy) {
  const buf = []
  for (let i = 0; i < Math.max(BUF_LEN, doc.numPages); i++) {
    buf.push(getPageItems(doc, i))
  }
  for (let i = 0; i < doc.numPages; i++) {
    yield buf[i]
    const cursor = i + BUF_LEN;
    if (cursor < doc.numPages) {
      buf.push(getPageItems(doc, cursor))
    }
  }
}

async function loadDocument(file: string) {
  pdfjs.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.js';
  const loadingTask = pdfjs.getDocument(file);
  return await loadingTask.promise;

}

async function getGlobalStats(textContents: TextContent[]) {
  for (const textContent of textContents) {
    for (const item of textContent.items) {
      console.log(item)
    }
  }
}



async function pdfToMd(file: string) {
}

test(async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const TEST_FILE = 'file://' + path.join(__dirname, '..','/pages/test-page.pdf')
  const doc = await loadDocument(TEST_FILE)
  const {pages, textContents} = await parsePdf(TEST_FILE)
  const globalStats = getGlobalStats(textContents)
})
  const pageP: Promise<PDFPageProxy>[] = []
  const textContentsP: Promise<TextContent>[] = []
  for (let i = 0; i < loaded.numPages; i++) {
    const prom = pageP[i] = loaded.getPage(i+1)
    prom.then(page => textContentsP[i] = page.getTextContent())
  }
  const pages = await Promise.all(pageP)
  const textContents = await Promise.all(textContentsP)
  return {pages, textContents}