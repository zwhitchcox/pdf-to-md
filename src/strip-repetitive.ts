import { Transform } from "stream";

const MIN_DIGIT_CHAR_CODE = "0".charCodeAt(0);
const MAX_DIGIT_CHAR_CODE = "9".charCodeAt(0);
const isDigit = char => char >= MIN_DIGIT_CHAR_CODE && char <= MAX_DIGIT_CHAR_CODE;

function hashCodeIgnoringSpacesAndNumbers(string) {
    var hash = 0;
    if (string.trim().length === 0) return hash;
    for (var i = 0; i < string.length; i++) {
        const charCode = string.charCodeAt(i);
        if (!isDigit(charCode) && charCode != 32 && charCode != 160) {
            hash = ((hash << 5) - hash) + charCode;
            hash |= 0; // Convert to 32bit integer
        }
    }
    return hash;
}


class StripRepetitive extends Transform {
  constructor(opts) {
    super({
      ...opts,
      highWaterMark: opts.highWaterMark,
    })
  }
  _transform(page, encoding, cb) {

  }
}
