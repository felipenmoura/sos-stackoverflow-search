let cardinal = require('cardinal');
let cliColor = require('cli-color');

const INDENT = "    ";
const CODE_START = cliColor.red(`+--------------------`);
const CODE_LINE = cliColor.red(`\n${INDENT}| `);
const CODE_END = cliColor.red(`\n${INDENT}+--------------------\n`);
const LINE_SIZE = process.stdout.columns > 80? 80: process.stdout.columns;
const ALLOWED_TAGS = [
    'pre',
    'code',
    'a',
    'i',
    '\/p',
    'strong',
    'blockquote',
    'li',
    'hr\/'
];
let allowedTags = ALLOWED_TAGS.join('|') + '|\/' + ALLOWED_TAGS.join('|\/');

module.exports = function (str) {
    
    let originalValue = str + '';
    let that = this;
    
    let finalStr = originalValue;
    
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    let lengthInUtf8Bytes = function (str) {
        let r = new RegExp(`\%[03-9A-Ba-b]{1,2}([0-9]{1, 2}m)?|\<(?!${allowedTags}).*?\>`, 'g');
        let m = encodeURIComponent(str).match(r);
        return str.length - (m ? m.join().length : 0);
    };
    
    // removes useless tags
    this.removeUnusedTags = function () {
        finalStr = finalStr .replace(new RegExp(`\<(?!${allowedTags}).*?\>`, 'g'), "")
                            .replace(/\<code\>/g, '<code>');
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
        let bolds = finalStr.match(/\<strong\>([\s\S]+?(?=\<\/strong\>))\<\/strong\>/g);
        if (bolds && bolds.length) {
            bolds.forEach(function(cur){
                finalStr = finalStr.replace(cur, cliColor.bold(cur.replace(/\<(\/)?strong\>/g, '')));
            });
        }
        return that;
    };
    
    // replacing blockquote
    this.treatBlockquotes = function () {
        let bqs = finalStr.match(/\<blockquote\>([\s\S])+?(?=\<\/blockquote\>)\<\/blockquote\>/g);
        if (bqs && bqs.length) {
            bqs.forEach(function(cur){
                finalStr = finalStr.replace(cur, cliColor.bold.yellow(cur.replace(/\<(\/)?blockquote\>/g, '')));
            });
        }
        return that;
    };
    
    // replacing italics
    this.treatItalic = function () {
        let intalics = finalStr.match(/\<i\>([\s\S]+?(?=\<\/i\>))\<\/i\>/g);
        if (intalics && intalics.length) {
            intalics.forEach(function(cur){
                finalStr = finalStr.replace(cur, cliColor.italic(cur.replace(/\<(\/)?i\>/g, '')));
            });
        }
        return that;
    };
    
    // replacing lists
    this.treatLists = function () {
        let lists = finalStr.match(/\<li\>([\s\S]+?(?=\<\/li\>))\<\/li\>/g);
        if (lists && lists.length) {
            lists.forEach(function(cur){
                finalStr = finalStr.replace(cur, cliColor.bold('- ') + cur.replace(/\<(\/)?li\>/g, ''));
            });
        }
        return that;
    };
    
    // replacing bars
    this.treatBars = function () {
        let bars = finalStr.match(/\<hr\/\>/g);
        if (bars && bars.length) {
            bars.forEach(function(cur){
                finalStr = finalStr.replace(cur, '_'.repeat(LINE_SIZE - INDENT.length));
            });
        }
        return that;
    };
    
    // replacing links with different text contents (so we can show the href instead)
    this.treatLinks = function () {
        let links = finalStr.match(/\<a([\s\S]+?(?=\<\/a\>))\<\/a\>/g);
        if (links && links.length) {
            links.forEach(function(cur){
                let href = cur.match(/href\=\"(.+?(?=\"))\"/);
                let inner = cur.match(/\>(.+?(?=\<\/a))\<\/a/);
                if(href && inner){
                    finalStr = finalStr.replace(cur, cliColor.underline(href[1]));
                }
            });
        }
        return that;
    };
    
    // highlighting URLS
    this.highlightURLs = function () {
        finalStr = finalStr.replace(/((http|ftp)(s)?:\/\/([^\s\"]|[\~\?\&\@\=])+)/gi , cliColor.underline.bold('$1'));
        return that;
    };
    
    // limmiting the length of each line
    this.limitLineLength = function () {
        let curLine;
        let finalResult = '';
        let lines = finalStr.split('\n');
        
        lines.forEach(line=>{
            curLine = '';
            let words = line.split(' ');
            let word;
            
            if (line.replace(/ /g, '') !== '') {
                while(words[0] !== void(0)){
                    word = words.shift();
                    curLine += word + ' ';

                    if (lengthInUtf8Bytes(curLine) > LINE_SIZE) {
                        finalResult += INDENT + curLine + '\n';
                        curLine = '';
                    }
                }
                finalResult += INDENT + curLine + '\n';
            }
        });
        
        if(curLine){
            finalResult += INDENT + curLine;
        }
        
        finalResult = finalResult.replace(/\n( +)?\<\/code\>/gm, '</code>');
        finalStr = finalResult;
        finalStr = finalStr.replace(/\n\[((0-9){1,2}m)?\n/g, '\n');
        
        return that;
    };
    
    // replacing multiline pre/codes
    this.treatMultilineCode = function () {
        let codes = finalStr.match(/\<pre\>\<code\>([\s\S]+?(?=\<\/code\>))\<\/code\>\<\/pre\>/g);
        if (codes && codes.length) {
            let replacement = "";
            
            codes.forEach(function(cur){
                try{
                    let tmp = cur.replace(/\<(\/)?(code|pre)\>/g, '')
                             .replace(/\&amp\;/g, '&')
                             .replace(/(^|\n)( +)?\#/g, '$1$2\/\/'); // lines starting with #

                    replacement = cardinal.highlight(tmp, {
                        linenos: true
                    });
                }catch(e){
                    replacement = require('./highlighter.js').highlight(cur.replace(/\<(\/)?(code|pre)\>/g, ''));
                    // not able to highlight it...ok, let's go on!
                    replacement = replacement.replace(/\<(\/)?(code|pre)\>/g, '');
                }
                finalStr = finalStr.replace(cur,
                                            CODE_START +
                                            CODE_LINE +
                                            replacement.replace(/\n/g, CODE_LINE) +
                                            CODE_END);
            });
        }
        return that;
    };
    
    // replacing single line pre/codes
    this.treatSinglelineCode = function () {
        finalStr = finalStr.replace(/\<(\/)?pre\>/g, '');
        let codes = finalStr.match(/\<code\>([\s\S]+?(?=\<\/code\>))\<\/code\>/g);
        if (codes && codes.length) {
            let replacement = "";
            codes.forEach(function(cur){
                replacement = cliColor.redBright(cur.replace(/\<(\/)?code\>/g, ''));
                finalStr = finalStr.replace(cur, replacement);
            });
        }
        return that;
    };
    
    // highlighting some extra useful words
    this.highlightExtras = function () {
        finalStr = finalStr.replace(/(note\:)/ig, cliColor.bold.blueBright('Note:'));
        finalStr = finalStr.replace(/(edit\:)/ig, cliColor.bold.blueBright('EDIT:'));
        return that;
    };
    
    // removing tabs, /r and extra double lines
    this.removeExtraSpaces = function () {
        finalStr = finalStr.replace(/\t|\r/g, '');
        finalStr = finalStr.replace(/\n\n/g, '\n');
        finalStr = finalStr.replace(/\<\/p\>/g, '\n');
        finalStr = finalStr.replace(/http\:\/\/\n {4}/g, 'http://');
        finalStr = finalStr.replace(/\|(.+)?([0-9]{1,3})? {4}/g, '|$1$2');
        return that;
    };

    // get the final result after applying all the filters
    this.getResult = function () {
        return finalStr;
    };

};