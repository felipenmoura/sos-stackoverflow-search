'use strict';

var DOMParser = require('dom-parser');
var inq = require('inquirer');

module.exports = function listQuestions(html) {
    return new Promise(function (resolve, reject) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        var opts = {},
            qOpts = [];
        var i = 0;
        var link = undefined,
            answered = undefined,
            cur = undefined,
            linkText = undefined;
        var limit = 9;

        var qList = [].slice.call(doc.getElementsByClassName('question-summary search-result'));
        for (i = 0; i < qList.length; i++) {
            cur = qList[i];
            link = cur.getElementsByTagName('a')[0];
            answered = cur.getElementsByClassName('answered-accepted')[0] || null;

            if (!answered) {
                continue;
            }

            linkText = 1 + qOpts.length + ')' + link.innerHTML.replace(/\r|\n|/g, '').replace(/^ Q: /, '');

            opts[linkText] = link.getAttribute('href');
            qOpts.push(linkText);

            if (qOpts.length >= limit) {
                break;
            }
        }

        if (qOpts.length) {
            inq.prompt([{
                name: 'question',
                type: 'list',
                message: '  These are the questions found:',
                choices: qOpts
            }], function (q) {
                resolve(opts[q.question]);
            });
        } else {
            console.log('    Sorry, did not find any question matching your problem!');
        }
    });
};