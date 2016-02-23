'use strict';

var keys = {
    blueBright: ['function', '\(', '\)', '\[', '\]', '\(', '\{', '\}', '\;', '\:', '\=\>'],
    redBright: ['\+', '\-', '\*', '\/', '\%', '\^', '\/[\s\S]+?(?=\/)\/', '\}', '\;', '\:']
};

module.exports = {
    heighlight: function heighlight(str) {
        //if(str.indexOf(/^\./))
        return str;
    }
};