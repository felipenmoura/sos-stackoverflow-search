let fetch = require('node-fetch');
let listQuestions = require('./listQuestions.js');
let getAnswer = require('./getAnswer.js');

const SO = "http://stackoverflow.com/";

function goGet (src, questions=true) {

    return new Promise(function(resolve, reject){
        fetch(src).then(function(result){
            return result.text();
        }).then(function (html) {
            resolve(html);
        }).catch(function(err){
            reject(err);
        });
    });

}

export function showQuestions (search) {
    return new Promise((resolve, reject)=>{
        goGet(`${SO}search?q=${search}`)
            .then(listQuestions)
            .then(resolve)
    });
};

export function showAnswer (href) {
    return new Promise((resolve, reject)=>{
        
        let cli = require('cli-color');
        console.log(cli.blueBright('Link:'), cli.bold.underline(SO + href));
        console.log(cli.bold('Answer:'));
        
        goGet(SO + href)
            .then(getAnswer)
            .catch(function(err){
                console.log(err);
                reject(err);
            })
            .then(resolve)
    });
};