'use strict';

var DOMParser = require('dom-parser');
var cardinal = require('cardinal');
var cliColor = require('cli-color');

var INDENT = "    ";
var CODE_START = '+--------------------';
var CODE_LINE = '\n' + INDENT + '| ';
var CODE_END = '\n' + INDENT + '+--------------------\n\n';
var LINE_SIZE = process.stdout.columns > 80 ? 80 : process.stdout.columns;

module.exports = function (str) {

    var originalValue = str + '';
    var that = this;

    var parser = new DOMParser();
    var doc = parser.parseFromString(str, "text/html");
    var finalStr = originalValue;

    var lengthInUtf8Bytes = function lengthInUtf8Bytes(str) {
        // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
        var m = encodeURIComponent(str).match(/\%[03-9A-Ba-b]{1,2}([0-9]{1, 2}m)?|\<(?!pre|code|\/pre|\/code|a|\/a|strong|\/strong|i|\/i|blockquote|\/blockquote).*?\>/g);
        return str.length - (m ? m.join().length : 0);
    };

    // removes useless tags
    this.removeUnusedTags = function () {
        finalStr = finalStr.replace(/\<(?!pre|code|\/pre|\/code|a|\/a|strong|\/strong|i|\/i|blockquote|\/blockquote).*?\>/g, "").replace(/\<code\>/g, '<code>');
        return that;
    };

    // replacing some garbage
    this.cleanGarbage = function () {
        finalStr = finalStr.replace(/\r/g, '');
        finalStr = finalStr.replace(/\n\n/g, '\n');
        finalStr = finalStr.replace(/\&lt\;/g, '<').replace(/\&gt\;/g, '>');
        return that;
    };

    // replacing strong
    this.treatStrong = function () {
        var bolds = finalStr.match(/\<strong\>(.+?(?=\<\/strong\>))\<\/strong\>/g);
        if (bolds && bolds.length) {
            bolds.forEach(function (cur) {
                finalStr = finalStr.replace(cur, cliColor.bold(cur.replace(/\<(\/)?strong\>/g, '')));
            });
        }
        return that;
    };

    // replacing blockquote
    this.treatBlockquotes = function () {
        var bqs = finalStr.match(/\<blockquote\>(([\s\S]+)?(?=\<\/blockquote\>))?\<\/blockquote\>/g);
        if (bqs && bqs.length) {
            bqs.forEach(function (cur) {
                finalStr = finalStr.replace(cur, cliColor.bold.yellow(cur.replace(/\<(\/)?blockquote\>/g, '')));
            });
        }
        return that;
    };

    // replacing italics
    this.treatItalic = function () {
        var intalics = finalStr.match(/\<i\>(.+?(?=\<\/i\>))\<\/i\>/g);
        if (intalics && intalics.length) {
            intalics.forEach(function (cur) {
                finalStr = finalStr.replace(cur, cliColor.italic(cur.replace(/\<(\/)?strong\>/g, '')));
            });
        }
        return that;
    };

    // replacing links with different text contents (so we can show the href instead)
    this.treatLinks = function () {
        var links = finalStr.match(/\<a(.+?(?=\<\/a\>))\<\/a\>/g);
        if (links && links.length) {
            links.forEach(function (cur) {
                var href = cur.match(/href\=\"(.+?(?=\"))\"/);
                var inner = cur.match(/\>(.+?(?=\<\/a))\<\/a/);
                if (href && inner) {
                    finalStr = finalStr.replace(cur, cliColor.underline(href[1]));
                }
            });
        }
        return that;
    };

    // limmiting the length of each line
    this.limitLineLength = function () {
        var LineBreaker = require('linebreak');
        var breaker = new LineBreaker(finalStr);
        var last = 0;
        var bk = undefined;
        var curLine = '';
        var finalResult = '';
        var prevWord = null;

        while (bk = breaker.nextBreak()) {
            var word = finalStr.slice(last, bk.position);
            last = bk.position;

            //            if(prevWord && prevWord.match(/(http|https|ftp)\:\/\//)) {
            //                curLine+= word;
            //                //console.log(word[0])
            //                //prevWord[prevWord.length-1] != '/' && !
            //                if (word.match(/[ \n\t]|$/)) {
            //                    console.log(prevWord, word);
            //                    prevWord = word;
            //                }
            //                continue;
            //            }

            if (lengthInUtf8Bytes(curLine) > LINE_SIZE && word.match(/^[ -~]+$/) || word.indexOf('<pre><code>') === 0 || word.indexOf('</code></pre>') > -1) {
                finalResult += INDENT + curLine + '\n';
                curLine = '';
            }

            curLine += word;

            if (bk.required) {
                //                if (word.match(/\\\[([0-9]{1, 2}m)/)) {
                //                    curLine += INDENT;
                //                } else if (word == CODE_START || word == CODE_END){
                //                    curLine += INDENT;
                //                }else{
                curLine += INDENT;
                //                }
            }
            prevWord = word;
        }
        if (curLine) {
            finalResult += INDENT + curLine;
        }

        finalResult = finalResult.replace(/\n( +)?\<\/code\>/gm, '</code>');
        finalStr = finalResult;
        finalStr = finalStr.replace(/\n\[((0-9){1,2}m)?\n/g, '\n');

        return that;
    };

    // replacing multiline pre/codes
    this.treatMultilineCode = function () {
        var codes = finalStr.match(/\<pre\>\<code\>([\s\S]+?(?=\<\/code\>))\<\/code\>\<\/pre\>/g);
        if (codes && codes.length) {
            (function () {
                var replacement = "";

                codes.forEach(function (cur) {
                    try {
                        replacement = cardinal.highlight(cur.replace(/\<(\/)?(code|pre)\>/g, ''), {
                            linenos: true //,
                            //theme: __dirname + '/sh-theme.js'
                        });
                    } catch (e) {
                        // not able to highlight it...ok, let's go on!
                        replacement = cur.replace(/\<(\/)?(code|pre)\>/g, '');
                    }
                    finalStr = finalStr.replace(cur, CODE_START + CODE_LINE + replacement.replace(/\n/g, CODE_LINE) + CODE_END);
                });
            })();
        }
        return that;
    };

    // replacing single line pre/codes
    this.treatSinglelineCode = function () {
        finalStr = finalStr.replace(/\<(\/)?pre\>/g, '');
        var codes = finalStr.match(/\<code\>(.+?(?=\<\/code\>))\<\/code\>/g);
        if (codes && codes.length) {
            (function () {
                var replacement = "";
                codes.forEach(function (cur) {
                    replacement = cliColor.redBright(cur.replace(/\<(\/)?code\>/g, ''));
                    finalStr = finalStr.replace(cur, replacement);
                });
            })();
        }
        return that;
    };

    // highlighting URLS
    this.highlightURLs = function () {
        finalStr = finalStr.replace(/(http(s)?:\/\/[^\s]+)/gi, cliColor.underline.bold('$1'));
        return that;
    };

    // removing tans, /r and extra double lines
    this.removeExtraSpaces = function () {
        finalStr = finalStr.replace(/\t|\r/g, '');
        finalStr = finalStr.replace(/\n\n/g, '\n');
        finalStr = finalStr.replace(/http\:\/\/\n    /g, 'http://');
        return that;
    };

    // get the final result after applying all the filters
    this.getResult = function () {
        return finalStr;
    };
};