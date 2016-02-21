let DOMParser = require('dom-parser');
let cardinal = require('cardinal');
let cliColor = require('cli-color');

const CODE_START = "\n+--------------------";
const CODE_LINE = "\n| ";
const CODE_END = "\n+--------------------\n";
const LINE_SIZE = 80;

module.exports = function treatString (str) {
    
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, "text/html");
    let codes;// = [].slice.call(doc.getElementsByTagName('pre'));
    let finalStr = "";
    
    finalStr = str.replace(/\<(?!pre|code|\/pre|\/code|a|\/a).*?\>/g, "")
                .replace(/\<code\>/g, '<code>');
    
    finalStr = finalStr.replace(/\r/g, '');
    finalStr = finalStr.replace(/\n\n/g, '\n');
    finalStr = finalStr.replace(/\&lt\;/g, '<').replace(/\&gt\;/g, '>');
    
    // replacing multiline pre/codes
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
    
    // replacing single line pre/codes
    finalStr = finalStr.replace(/\<(\/)?pre\>/g, '');
    codes = finalStr.match(/\<code\>(.+?(?=\<\/code\>))\<\/code\>/g);
    if (codes && codes.length) {
        let replacement = "";
        codes.forEach(function(cur){
            replacement = cliColor.bgWhite.black(cur.replace(/\<(\/)?code\>/g, ''));
            finalStr = finalStr.replace(cur, replacement);
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
    
    // highlighting URLS
    finalStr = finalStr.replace( /(http(s)?:\/\/[^\s]+)/gi , cliColor.underline.bold('$1') );
    
    // limiting the width on the screen
//    finalStr.match(/(.+)/g).forEach(cur=>{
//        if (cur.length > LINE_SIZE) {
//            cur = cur.match(new RegExp(`.{1,${LINE_SIZE}}`, 'g'));
//            console.log(cur);
//        }
//    });
    
    return finalStr;
};
