import { TextItem as TI, TextStyle } from "pdfjs-dist/types/display/api";

export type TextItem = TI & {hasEOL: boolean};

export type TextContent = {
  styles: {[x: string]: TextStyle};
  items: TextItem[];
}