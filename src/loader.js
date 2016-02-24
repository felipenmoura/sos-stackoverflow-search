let cursor = require('term-cursor');

const LOAD_STATUSES = [
    "    [     ] ",
    "    [*    ] ",
    "    [**   ] ",
    "    [***  ] ",
    "    [**** ] ",
    "    [*****] ",
    "    [ ****] ",
    "    [  ***] ",
    "    [   **] ",
    "    [    *] "
];

let curloadingStatus = 0;
let loadingTimer = null;

function loading (status) {
    if (status) {
        process.stdout.write(LOAD_STATUSES[curloadingStatus]);
        curloadingStatus++;
        if(curloadingStatus >= LOAD_STATUSES.length){
            curloadingStatus= 0;
        }
        loadingTimer = setTimeout(_=>loading(true, _), 60);
        cursor.left(99);
    }else{
        clearTimeout(loadingTimer);
        curloadingStatus = 0;
        cursor.left(99);
        process.stdout.write(' '.repeate(20));
        cursor.left(99);
    }
}

module.exports = loading;
