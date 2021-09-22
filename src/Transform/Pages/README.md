## Page Transformations

These transformations operate at the page level. We operate one page at a time.

For example, stripping the margins from a page is a page operation.

The order of processing should go:

1. [PageTextLines](./PageTextLines.ts): Combine all text items from same line into an array
1. [StripMarginsLines](./StripMargins.ts): Remove headers and footers from pages
1. [ContinousTextLines](./ContinuousTextLines.ts): Convert Page into individual lines for processing by [Lines](../Lines) transformers