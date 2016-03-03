
let DOMParser = require('dom-parser');
let inq = require('inquirer');

module.exports = function listQuestions (html) {
    return new Promise(function(resolve){
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        let opts = {}, qOpts = [];
        let i = 0;
        let link, answered, cur, linkText, formattedQuestion;
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
            formattedQuestion = linkText.replace(/\&amp\;/g, '&')
                    .replace(/\&\#39\;/g, "'")
                    .substring(0, 80)

            opts[formattedQuestion] = link.getAttribute('href');
            qOpts.push(formattedQuestion);

            if(qOpts.length >= limit){
                break;
            }
        }

        if(qOpts.length){
            inq.prompt([
                    {
                        name: 'question',
                        type: 'list',
                        message: '  These are the questions found:',
                        choices: qOpts
                    }
                ],
                function (q) {
                    resolve(opts[q.question]);
                }
            );
        } else {
            console.log('    Sorry, did not find any question matching your problem!');
        }
    });
};
