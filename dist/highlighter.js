'use strict';

var cliColor = require('cli-color');

var keys = {
    blueBright: ['function', '\(', '\)', '\[', '\]', '\(', '\{', '\}', '\;', '\:', '\=\>'],
    redBright: ['\+', '\-', '\*', '\/', '\%', '\^', '\/[\s\S]+?(?=\/)\/', '\}', '\;', '\:']
};

module.exports = {
    highlight: function highlight(str) {
        var tags = null;
        if (tags = str.match(/(\<(\/)?[a-z](([^\>])+)?\>)/ig)) {

            // is probably an html code
            tags.forEach(function (tag) {
                var tagName = tag.substring(0, tag.indexOf(tag.match(/ |\>/)));
                var tagStr = undefined;

                // replace single quotes by doubles
                tagStr = tag.replace(/\=\'([^\']+)\'/g, '="$1"');

                if (tagName.length > 1) {

                    // attribute names
                    attrs = tagStr.match(/([a-z0-9\-\_\@\$])+\=\"/ig);
                    if (attrs) {
                        attrs.forEach(function (attr) {
                            tagStr = tagStr.replace(attr, cliColor.red(attr));
                        });
                    }

                    //attribute values
                    var attrs = tagStr.match(/"(?:[^"\\]|\\.)*"/g);
                    if (attrs) {
                        attrs.forEach(function (attr) {
                            tagStr = tagStr.replace(attr, cliColor.redBright(attr));
                        });
                    }

                    tagStr = tagStr.replace(new RegExp('\\' + tagName, 'ig'), cliColor.blueBright(tagName));

                    str = str.replace(tag, tagStr);
                }
            });
            str = str.replace(/\>/g, cliColor.blueBright('>'));
            str = str.replace(/\<\!DOCTYPE html(.+)?\>(.+)?/i, cliColor.bold.blackBright('<!DOCTYPE html>'));
        } else if (str.matc(/(^|\n)( +)?[\.\:\#][a-z0-9\-\_]/i)) {
            // is probably css
            //str += "was css";
            console.log('>>>>>> CSS');
        }

        return str;
    }
};