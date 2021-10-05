## Lines

Processing for individual lines should go here, before they are transformed into [Blocks](../Blocks)

1. [Lines](./Lines.ts): Convert Page into individual lines, since pages don't mean anything anymore
1. [ReplaceDoubleQuotes](./ReplaceDoubleQuotes.ts): This may not be very common, but my setup is outputing \`\`'' instead of "". This just fixes that.