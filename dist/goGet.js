'use strict';

var fetch = require('node-fetch');
var loading = require('./loader.js');

function goGet(src) {
    var questions = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    console.log('');
    loading(true);
    return new Promise(function (resolve, reject) {
        fetch(src).then(function (result) {
            return result.text();
        }).then(function (html) {
            resolve(html);
            loading(false);
        })['catch'](function (err) {
            reject(err);
            loading(false);
        });
    });
}

module.exports = goGet;