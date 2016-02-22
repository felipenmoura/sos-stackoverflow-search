"use strict";

var cursor = require('term-cursor');

var LOAD_STATUSES = ["    [     ] ", "    [*    ] ", "    [**   ] ", "    [***  ] ", "    [**** ] ", "    [*****] ", "    [ ****] ", "    [  ***] ", "    [   **] ", "    [    *] "];

var curloadingStatus = 0;
var loadingTimer = null;

function loading(status) {
    if (status) {
        console.log(LOAD_STATUSES[curloadingStatus]);
        curloadingStatus++;
        if (curloadingStatus >= LOAD_STATUSES.length) {
            curloadingStatus = 0;
        }
        loadingTimer = setTimeout(function (_) {
            return loading(true);
        }, 60);
        cursor.left(99);
        cursor.up(1);
    } else {
        clearTimeout(loadingTimer);
        curloadingStatus = 0;
        cursor.left(99);
        console.log('                  ');
        cursor.up(2);
    }
}

module.exports = loading;