
let stringUtils = require('./stringUtils.js');

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
