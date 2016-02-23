'use strict';

var stringUtils = require('./stringUtils.js');

module.exports = function treatString(str) {
    return new stringUtils(str).treatLinks().removeUnusedTags().cleanGarbage().treatStrong().treatItalic().treatLists().treatBars().highlightURLs().highlightExtras().limitLineLength().treatMultilineCode().treatSinglelineCode().treatBlockquotes().removeExtraSpaces().getResult();
};