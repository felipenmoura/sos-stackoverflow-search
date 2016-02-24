
let StringUtils = require('./stringUtils.js');

module.exports = function treatString (str) {    
    return (new StringUtils(str))
        .treatLinks()
        .removeUnusedTags()
        .cleanGarbage()
        .treatStrong()
        .treatItalic()
        .treatLists()
        .treatBars()
        .highlightURLs()
        .highlightExtras()
        .limitLineLength()
        .treatMultilineCode()
        .treatSinglelineCode()
        .treatBlockquotes()
        .removeExtraSpaces()
        .getResult();
};
