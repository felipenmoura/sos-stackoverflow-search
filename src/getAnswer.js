
let DOMParser = require('dom-parser');
let treatString = require('./treatString.js');

module.exports = function getAnswer (html) {
    return new Promise(function(resolve, reject){
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        let ans = doc.getElementsByClassName('accepted-answer')[0]
                     .getElementsByClassName('post-text')[0];
        let inner = ans.innerHTML;
        
        try{
            console.log( treatString(inner) );
        }catch(e){
            console.error(e);
        }
        
        resolve();
        
    });
};

