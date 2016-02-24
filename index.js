#!/usr/bin/env node

"use strict";

var sos = require('./dist/sos.js');

var search = encodeURI(process.argv.slice(2).join(' '));

sos .showQuestions(search)
    .catch(function(err){
        console.log('failed showing the list of questions!\n'); console.error(err);
    })
    .then(sos.showAnswer)
    .catch(function(err){
        console.log('failed showing the answer!\n'); console.error(err);
    })
    .then(function(){
        process.exit(0);
    });
