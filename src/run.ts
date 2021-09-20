import { readFileSync } from 'fs'
import pdfjs from 'pdfjs-dist/legacy/build/pdf.js'
import { expect, test } from './test.js'
import { fileURLToPath } from 'url';
import * as path from 'path'



async function parsePdf(file: string) {
  pdfjs.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.js';
  const loadingTask = pdfjs.getDocument(file)
  return await loadingTask.promise
}

async function pdfToMd(file: string) {
}

test(async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const TEST_FILE = 'file://' + path.join(__dirname, '..','/pages/test-page.pdf')
  const pdf = await parsePdf(TEST_FILE)
  console.log(pdf)
  const metadata = await pdf.getMetadata()
  console.log(metadata)
  console.log('total pages', pdf.numPages)
  const page = await pdf.getPage(1)
  console.log(page)
  const text = await page.getTextContent()
  console.log(text)
})