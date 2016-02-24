const listQuestions = require('./listQuestions.js');
const getAnswer = require('./getAnswer.js');
const goGet = require('./goGet.js');
const SO = "http://stackoverflow.com";

function showQuestions (search) {
    return new Promise((resolve, reject)=>{
        goGet(`${SO}/search?q=${search}`)
            .then(listQuestions)
            .then(resolve)
            .catch(e=>{
                console.error('Failed retrieving data!', e);
                reject(e);
            });
    });
}

function showAnswer (href) {
    return new Promise((resolve, reject)=>{
        
        let cli = require('cli-color');
        console.log(cli.bold('    LINK: '), cli.bold.underline(SO + href));
        console.log(cli.bold('    ANSWER: '));
        
        goGet(SO + href)
            .then(getAnswer)
            .catch(function(err){
                console.log(err);
                reject(err);
            })
            .then(resolve);
    });
}

module.exports = {
    showQuestions,
    showAnswer
};
