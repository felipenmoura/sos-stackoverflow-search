"use strict";

var cursor = require('term-cursor');

var LOAD_STATUSES = ["    [     ] ", "    [*    ] ", "    [**   ] ", "    [***  ] ", "    [**** ] ", "    [*****] ", "    [ ****] ", "    [  ***] ", "    [   **] ", "    [    *] "];

var curloadingStatus = 0;
var loadingTimer = null;

function loading(status) {
    if (status) {
        process.stdout.write(LOAD_STATUSES[curloadingStatus]);
        curloadingStatus++;
        if (curloadingStatus >= LOAD_STATUSES.length) {
            curloadingStatus = 0;
        }
        loadingTimer = setTimeout(function (_) {
            return loading(true, _);
        }, 60);
        cursor.left(99);
    } else {
        clearTimeout(loadingTimer);
        curloadingStatus = 0;
        cursor.left(99);
        process.stdout.write(' '.repeat(20));
        cursor.left(99);
    }
}

module.exports = loading;