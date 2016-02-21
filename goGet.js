const fetch = require('node-fetch');
const loading = require('./loader.js');

function goGet (src, questions=true) {
    loading(true);
    return new Promise(function(resolve, reject){
        fetch(src).then(function(result){
            return result.text();
        }).then(function (html) {
            resolve(html);
            loading(false);
        }).catch(function(err){
            reject(err);
            loading(false);
        });
    });
}

module.exports = goGet;
