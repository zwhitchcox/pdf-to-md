import { TextItem as TI, TextStyle } from "pdfjs-dist/types/display/api";

export type TextItem = TI & {hasEOL: boolean};

export type TextContent = {
  styles: {[x: string]: TextStyle};
  items: TextItem[];
}

export type TextLines = {
  styles: {[x: string]: TextStyle};
  items: TextLine[];
}

export type TextLine = TextItem[];

export type OnProgressFn = (num: number) => any

export type Line = {
  styles: {[x: string]: TextStyle};
  line: TextLine;
}