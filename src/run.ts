import pdfjs from 'pdfjs-dist/legacy/build/pdf.js';
import { expect, test } from './test.js';
import { fileURLToPath } from 'url';
import * as path from 'path';
import { PDFDocumentProxy, PDFPageProxy, TextContent } from 'pdfjs-dist/types/display/api';
import { pipeline, Readable, ReadableOptions, Transform } from 'stream';
import { PDFPageViewport } from 'pdfjs-dist';

// number of pages to process at a time
const BUF_LEN = 16;


const getContent = ({items, page}) => {

}

function getPageAndContent(doc: PDFDocumentProxy, i: number) {
  const pageP = doc.getPage(i+1);
  pageP.then(page => {
    const scale = 1.0;
    return Promise.all<TextContent,PDFPageViewport>([
      page.getTextContent(),
      page.getViewport({scale}),
    ]);
  }).then(([content, viewport]) => {
    const normalized = []
  });

  const normalizedItemsP = textContentP.then(({items}) => {
    for (const item of items) {
      const normalizedItem = {
          x: Math.round(item.transform[4]),
          y: Math.round(item.transform[5]),
          width: Math.round(item.width),
          height: Math.round(dividedHeight <= 1 ? item.height : dividedHeight),
          text: item.str,
          font: item.fontName,
          style: textContent.styles[item.fontName],
      });

    }
  })
  return [pageP, pageP.then(page => page.getTextContent()), normalizedItemsP]
}

function*genPagesAndContent(doc: PDFDocumentProxy) {
  const buf = []
  for (let i = 0; i < Math.min(BUF_LEN, doc.numPages); i++) {
    buf.push(getPageAndContent(doc, i))
  }
  for (let i = 0; i < doc.numPages; i++) {
    yield Promise.all(buf[i])
      .then(([page, textContent, items]) => ({page, textContent, items}))
    const cursor = i + BUF_LEN;
    if (cursor < doc.numPages) {
      buf.push(getPageAndContent(doc, cursor))
    }
  }
}

class Normalize extends Transform {
  _transform({page, textContent}, encoding, callback) {
    for (const item of textContent.items) {

    }
  }
}

async function getGlobalStats(textContents: TextContent[]) {
  for (const textContent of textContents) {
    for (const item of textContent.items) {
      console.log(item)
    }
  }
}


async function loadDocument(file: string) {
  pdfjs.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.js';
  const loadingTask = pdfjs.getDocument(file);
  return await loadingTask.promise;

}



async function pdfToMd(file: string) {
}

test('main', async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const TEST_FILE = 'file://' + path.join(__dirname, '..','/pages/test-page.pdf')
  const doc = await loadDocument(TEST_FILE);
  const highWaterMark = BUF_LEN;
  const objectMode = true;
  for await (const {page, textContent} of genPagesAndContent(doc)) {
    console.log(textContent)
  }
  // const pageStream = Readable.from(genPagesAndContent(doc), {objectMode, highWaterMark});
})