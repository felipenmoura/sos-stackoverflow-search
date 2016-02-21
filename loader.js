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
        console.log(LOAD_STATUSES[curloadingStatus]);
        curloadingStatus++;
        if(curloadingStatus >= LOAD_STATUSES.length){
            curloadingStatus= 0;
        }
        loadingTimer = setTimeout(_=>loading(true), 60);
        cursor.left(99);
        cursor.up(1);
    }else{
        clearTimeout(loadingTimer);
        curloadingStatus = 0;
        cursor.left(99);
        cursor.up(1);
    }
}

module.exports = loading;
