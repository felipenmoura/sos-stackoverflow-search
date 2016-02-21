let DOMParser = require('dom-parser');
let cardinal = require('cardinal');
let cliColor = require('cli-color');

const CODE_START = "\n+--------------------";
const CODE_LINE = "\n| ";
const CODE_END = "\n+--------------------\n";

module.exports = function treatString (str) {
    
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, "text/html");
    let codes;// = [].slice.call(doc.getElementsByTagName('pre'));
    let finalStr = "";
    
    finalStr = str.replace(/\<(?!pre|code|\/pre|\/code).*?\>/g, "")
                .replace(/\<code\>/g, '<code>');
    
    finalStr = finalStr.replace(/\r/g, '');
    finalStr = finalStr.replace(/\n\n/g, '\n');
    finalStr = finalStr.replace(/\&lt\;/g, '<').replace(/\&gt\;/g, '>');
    
    codes = finalStr.match(/\<pre\>\<code\>([\s\S]+?(?=\<\/code\>))\<\/code\>\<\/pre\>/g);
    
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
    
    finalStr = finalStr.replace(/\<(\/)?pre\>/g, '');
    
    codes = finalStr.match(/\<code\>(.+?(?=\<\/code\>))\<\/code\>/g);
    if (codes && codes.length) {
        let replacement = "";
        codes.forEach(function(cur){
            replacement = cliColor.bgWhite.black(cur.replace(/\<(\/)?code\>/g, ''));
            finalStr = finalStr.replace(cur, replacement);
        });
    }
    
    
    return finalStr;
};
