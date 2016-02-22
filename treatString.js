let DOMParser = require('dom-parser');
let cardinal = require('cardinal');
let cliColor = require('cli-color');

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
    
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, "text/html");
    let finalStr = "";
    
    // removing all tags except some specific ones
    finalStr = str.replace(/\<(?!pre|code|\/pre|\/code|a|\/a|strong|\/strong|i|\/i).*?\>/g, "")
                .replace(/\<code\>/g, '<code>');
    
    // replacing some garbage
    finalStr = finalStr.replace(/\r/g, '');
    finalStr = finalStr.replace(/\n\n/g, '\n');
    finalStr = finalStr.replace(/\&lt\;/g, '<').replace(/\&gt\;/g, '>');
    
    // replacing strong
    let bolds = finalStr.match(/\<strong\>(.+?(?=\<\/strong\>))\<\/strong\>/g);
    if (bolds && bolds.length) {
        bolds.forEach(function(cur){
            finalStr = finalStr.replace(cur, cliColor.bold(cur.replace(/\<(\/)?strong\>/g, '')));
        });
    }
    
    // replacing italics
    let intalics = finalStr.match(/\<i\>(.+?(?=\<\/i\>))\<\/i\>/g);
    if (intalics && intalics.length) {
        intalics.forEach(function(cur){
            finalStr = finalStr.replace(cur, cliColor.italic(cur.replace(/\<(\/)?strong\>/g, '')));
        });
    }
    
    // replacing links with different text contents (so we can show the href instead)
    let links = finalStr.match(/\<a(.+?(?=\<\/a\>))\<\/a\>/g);
    if (links && links.length) {
        links.forEach(function(cur){
            let href = cur.match(/href\=\"(.+?(?=\"))\"/);
            let inner = cur.match(/\>(.+?(?=\<\/a))\<\/a/);
            if(href && inner){
                finalStr = finalStr.replace(cur, cliColor.underline(href[1]));
            }
        });
    }
    
    // limmiting the length of each line
    let LineBreaker = require('linebreak');
    let breaker = new LineBreaker(finalStr);
    let last = 0;
    let bk;
    let curLine = '';
    let finalResult = '';
    
    while (bk = breaker.nextBreak()) {
        var word = finalStr.slice(last, bk.position);
        last = bk.position;
        
        if (
            ( (lengthInUtf8Bytes(curLine) > LINE_SIZE) && word.match(/^[ -~]+$/) )
            || word.indexOf('<pre><code>') === 0
            || word.indexOf('</code></pre>') > -1
        ) {
            finalResult += INDENT + curLine + '\n';
            curLine = '';
        }
        
        curLine += word;
        
        if (bk.required) {
            if (word.match(/\\\[([0-9]{1, 2}m)/)) {
                curLine += INDENT;
            } else if (word == CODE_START || word == CODE_END){
                curLine += INDENT;
            }else{
                curLine += INDENT;
            }
        }
    }
    if(curLine){
        finalResult += INDENT + curLine;
    }
    
    finalResult = finalResult.replace(/\n( +)?\<\/code\>/gm, '</code>');
    finalStr = finalResult;
    finalStr = finalStr.replace(/\n\[((0-9){1,2}m)?\n/g, '\n');
    
    // replacing multiline pre/codes
    let codes = finalStr.match(/\<pre\>\<code\>([\s\S]+?(?=\<\/code\>))\<\/code\>\<\/pre\>/g);
    if (codes && codes.length) {
        let replacement = "";
        codes.forEach(function(cur){
            try{
                replacement = cardinal.highlight(cur.replace(/\<(\/)?(code|pre)\>/g, ''), {
                    linenos: true
                });
            }catch(e){
                // not able to highlight it...ok, let's go on!
                replacement = cur.replace(/\<(\/)?(code|pre)\>/g, '');
            }
            finalStr = finalStr.replace(cur,
                                        CODE_START +
                                        CODE_LINE +
                                        replacement.replace(/\n/g, CODE_LINE) +
                                        CODE_END);
        });
    }
    
    // replacing single line pre/codes
    finalStr = finalStr.replace(/\<(\/)?pre\>/g, '');
    codes = finalStr.match(/\<code\>(.+?(?=\<\/code\>))\<\/code\>/g);
    if (codes && codes.length) {
        let replacement = "";
        codes.forEach(function(cur){
            replacement = cliColor.redBright(cur.replace(/\<(\/)?code\>/g, ''));
            finalStr = finalStr.replace(cur, replacement);
        });
    }
    
    // highlighting URLS
    finalStr = finalStr.replace(/(http(s)?:\/\/[^\s]+)/gi , cliColor.underline.bold('$1'));
    
    // removing tabs
    finalStr = finalStr.replace(/\t|\r/g, '');
    finalStr = finalStr.replace(/\n\n/g, '\n');
    
    return finalStr+"\n\n";
};
