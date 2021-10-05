import path from "path/posix";
import { fileURLToPath } from "url";

export function getTestFile(basename: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return 'file://' + path.join(__dirname, '..','/pages/', basename + '.pdf')
}