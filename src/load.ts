import pdfjs from 'pdfjs-dist/legacy/build/pdf.js';
import { test } from '../test/test.js';
import { fileURLToPath } from 'url';
import * as path from 'path';
import { getTextStream } from './text-stream.js';


export async function loadDocument(file: string) {
  pdfjs.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.js';
  const loadingTask = pdfjs.getDocument(file);
  return await loadingTask.promise;
}

