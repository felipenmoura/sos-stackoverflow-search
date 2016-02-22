
let DOMParser = require('dom-parser');
let inq = require('inquirer');

module.exports = function listQuestions (html) {
    return new Promise(function(resolve, reject){
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        let opts = {}, qOpts = [];
        let i = 0;
        let link, answered, cur, linkText;
        let limit = 9;

        let qList = [].slice.call(doc.getElementsByClassName('question-summary search-result'));
        for (i=0; i<qList.length; i++) {
            cur = qList[i];
            link = cur.getElementsByTagName('a')[0];
            answered = cur.getElementsByClassName('answered-accepted')[0] || null;

            if(!answered){
                continue;
            }

            linkText = (1 + qOpts.length) + ')' + link.innerHTML.replace(/\r|\n|/g, '').replace(/^ Q: /, '');

            opts[linkText] = link.getAttribute('href');
            qOpts.push(linkText);
            
            if(qOpts.length >= limit){
                break;
            }
        }
        
        inq.prompt([
                {
                    name: 'question',
                    type: 'list',
                    message: '  These are the questions found:',
                    choices: qOpts
                }
            ],
            function (q) {
                resolve(opts[q.question])
            }
        );
    });
};

