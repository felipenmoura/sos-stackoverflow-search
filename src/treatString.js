
let stringUtils = require('./stringUtils.js');

module.exports = function treatString (str) {    
    return (new stringUtils(str))
        .treatLinks()
        .removeUnusedTags()
        .cleanGarbage()
        .treatStrong()
        .treatBlockquotes()
        .treatItalic()
        .highlightURLs()
        .limitLineLength()
        .treatMultilineCode()
        .treatSinglelineCode()
        .removeExtraSpaces()
        .getResult();
};
