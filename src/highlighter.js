
const keys = {
    blueBright : [
        'function',
        '\(',
        '\)',
        '\[',
        '\]',
        '\(',
        '\{',
        '\}',
        '\;',
        '\:',
        '\=\>'
    ],
    redBright : [
        '\+',
        '\-',
        '\*',
        '\/',
        '\%',
        '\^',
        '\/[\s\S]+?(?=\/)\/',
        '\}',
        '\;',
        '\:'
    ]
}

module.exports = {
    heighlight: function (str) {
        //if(str.indexOf(/^\./))
        return str;
    }
};
