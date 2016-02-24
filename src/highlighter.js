let cliColor = require('cli-color');

module.exports = {
    highlight (str) {
        let tags = null;
        let selectors = null;
        if(tags = str.match(/(\<(\/)?[a-z](([^\>])+)?\>)/ig)) {
            
            // is probably an html code
            tags.forEach(tag=>{
                let tagName = tag.substring(0, tag.indexOf(tag.match(/ |\>/)));
                let tagStr;
                
                // replace single quotes by doubles
                tagStr = tag.replace(/\=\'([^\']+)\'/g, '="$1"');
                
                if(tagName.length > 1){
                    
                    // attribute names
                    let attrs = tagStr.match(/([a-z0-9\-\_\@\$])+\=\"/ig);
                    if (attrs) {
                        attrs.forEach(attr=>{
                            tagStr = tagStr.replace(attr, cliColor.red(attr));
                        });
                    }
                    
                    //attribute values
                    attrs = tagStr.match(/"(?:[^"\\]|\\.)*"/g);
                    if (attrs) {
                        attrs.forEach(attr=>{
                            tagStr = tagStr.replace(attr, cliColor.redBright(attr));
                        });
                    }
                    
                    tagStr = tagStr.replace(new RegExp('\\'+tagName, 'ig'), cliColor.blueBright(tagName));
                        
                    str = str.replace(tag, tagStr);
                }
            });
            str = str.replace(/\>/g, cliColor.blueBright('>'));
            str = str.replace(/\<\!DOCTYPE html(.+)?\>(.+)?/i, cliColor.bold.blackBright('<!DOCTYPE html>'));
            
        }else if (selectors = str.match(/(^|\n)( +)?[\.\:\#\[\]][a-z0-9\-\_\=\(\)\, \[\]]([\s\S]+)?\{/i)) {
            // is probably css
            let css = require('css');
            let obj = css.parse(str, {silent:true});
            let cssResult = '';
            
            if(!obj.parsingErrors){
                
                let i = 1;
                obj.stylesheet.rules.forEach(rule=>{
                    let sels = [];
                    rule.selectors.forEach(selector => {
                        let selStr = cliColor.blueBright(selector
                            .replace(/\[/g, cliColor.magenta('['))
                            .replace(/\:hover/g, cliColor.redBright(":hover"))
                            .replace(/\:active/g, cliColor.redBright(":active"))
                            .replace(/\:visited/g, cliColor.redBright(":visited"))
                            .replace(/\:link/g, cliColor.redBright(":link"))
                            .replace(/\:after/g, cliColor.redBright(":after"))
                            .replace(/\:before/g, cliColor.redBright(":before"))
                            .replace(/\./g, cliColor.magenta('.'))
                            .replace(/\#/g, cliColor.magenta('.'))
                            //.replace(/\:/g, cliColor.magenta(':'))
                            .replace(/\,/g, cliColor.magenta(','))
                            .replace(/\(/g, cliColor.magenta('('))
                            .replace(/\)/g, cliColor.magenta(')'))
                            .replace(/\]/g, cliColor.magenta(']'))
                            .replace(/\=/g, cliColor.magenta('='))
                            .replace(/\"/g, cliColor.magenta('"'))
                            .replace(/\'/g, cliColor.magenta("'"))
                        );
                        sels.push(selStr);
                    });
                    cssResult+= sels.join(',') + '{\n';
                        
                    
                    rule.declarations.forEach(declaration => {
                        let decStr = cliColor.blueBright(
                            cliColor.white(declaration.property) + cliColor.magenta(': ') + cliColor.redBright(declaration.value)
                        );
                        
                        declaration = new RegExp(declaration.property+'([\s\S]+)?:([\s\S]+)?'+declaration.value, 'i');
                        cssResult+= '        ' + decStr + cliColor.magenta(';\n');
                    });
                    cssResult+= '}';
                    
                    if(i < obj.stylesheet.rules.length){
                        cssResult += '\n'
                    }
                    i++;
                });
            }
            str = cssResult
                    .replace(/\{/g, cliColor.red('{'))
                    .replace(/\}/g, cliColor.red('}'))
                    .replace(/\n\nmagenta/g, cliColor.red('\n'));
        }
        
        return str;
    }
};
