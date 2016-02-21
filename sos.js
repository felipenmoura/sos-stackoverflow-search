const listQuestions = require('./listQuestions.js');
const getAnswer = require('./getAnswer.js');
const goGet = require('./goGet.js');
const SO = "http://stackoverflow.com/";

export function showQuestions (search) {
    return new Promise((resolve, reject)=>{
        goGet(`${SO}search?q=${search}`)
            .then(listQuestions)
            .then(resolve)
            .catch(e=>{
                console.error('Failed retrieving data!', e);
            });
    });
};

export function showAnswer (href) {
    return new Promise((resolve, reject)=>{
        
        goGet(SO + href)
            .then(getAnswer)
            .catch(function(err){
                console.log(err);
                reject(err);
            })
            .then(resolve);
    });
};

