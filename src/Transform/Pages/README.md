## Page Transformations

These transformations operate at the page level. We operate one page at a time.

For example, stripping the margins from a page is a page operation.

The order of processing should go:

1. [PageTextLines](./PageTextLines.ts): Combine all text items from same line into an array
1. [GatherStyles](./GatherStyles.ts): Gather all styles into one global object
1. [StripMarginsLines](./StripMargins.ts): Remove headers and footers from pages