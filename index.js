#!/usr/bin/env node

"use strict";

//require("babel-preset-es2015");
//require("babel-polyfill");
//require('babel-register');
require('babel/register');

var sos = require('./sos.js');

var search = encodeURI(process.argv.slice(2).join(' '));

sos .showQuestions(search)
    .catch(function(err){ console.lot('failed showing the list of questions!'); console.error(err);})
    .then(sos.showAnswer)
    .catch(function(err){ console.lot('failed showing the answer!'); console.error(err);});