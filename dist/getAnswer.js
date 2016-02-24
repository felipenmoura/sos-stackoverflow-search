'use strict';

var DOMParser = require('dom-parser');
var treatString = require('./treatString.js');

module.exports = function getAnswer(html) {
    return new Promise(function (resolve, reject) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        var ans = doc.getElementsByClassName('accepted-answer')[0].getElementsByClassName('post-text')[0];
        var inner = ans.innerHTML;

        try {
            console.log(treatString(inner));
        } catch (e) {
            console.error(e);
        }

        resolve();
    });
};