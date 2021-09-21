import path from "path/posix";
import { fileURLToPath } from "url";
import { getTextStream } from "./load.js";

export function getTestFile(basename: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return 'file://' + path.join(__dirname, '..','/pages/', basename + '.pdf')
}

export function getTestStream(basename) {
  const file = getTestFile(basename);
  return getTextStream(file);
}