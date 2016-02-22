
let stringUtils = require('./stringUtils.js');

const INDENT = "    ";
const CODE_START = `+--------------------`;
const CODE_LINE = `\n${INDENT}| `;
const CODE_END = `\n${INDENT}+--------------------\n\n`;
const LINE_SIZE = process.stdout.columns > 80? 80: process.stdout.columns;


function lengthInUtf8Bytes(str) {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    var m = encodeURIComponent(str).match(
        /\%[03-9A-Ba-b]{1,2}([0-9]{1, 2}m)?|\<(?!pre|code|\/pre|\/code|a|\/a|strong|\/strong|i|\/i).*?\>/g
    );
    return str.length - (m ? m.join().length : 0);
}

module.exports = function treatString (str) {
    
    return (new stringUtils(str))
        .removeUnusedTags()
        .cleanGarbage()
        .treatStrong()
        .treatItalic()
        .treatLinks()
        .limitLineLength()
        .treatMultilineCode()
        .treatSinglelineCode()
        .highlightURLs()
        .removeExtraSpaces()
        .getResult();

};
