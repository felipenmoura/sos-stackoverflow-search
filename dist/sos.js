'use strict';

var listQuestions = require('./listQuestions.js');
var getAnswer = require('./getAnswer.js');
var goGet = require('./goGet.js');
var SO = "http://stackoverflow.com";

function showQuestions(search) {
    return new Promise(function (resolve, reject) {
        goGet(SO + '/search?q=' + search).then(listQuestions).then(resolve)['catch'](function (e) {
            console.error('Failed retrieving data!', e);
        });
    });
};

function showAnswer(href) {
    return new Promise(function (resolve, reject) {

        var cli = require('cli-color');
        console.log(cli.bold('    LINK: '), cli.bold.underline(SO + href));
        console.log(cli.bold('    ANSWER: '));

        goGet(SO + href).then(getAnswer)['catch'](function (err) {
            console.log(err);
            reject(err);
        }).then(resolve);
    });
};

module.exports = {
    showQuestions: showQuestions,
    showAnswer: showAnswer
};