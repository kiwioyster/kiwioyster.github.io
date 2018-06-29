// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// Open (or create) the database
// var open = indexedDB.open("MyDatabase", 1);
var dbRequest = indexedDB.open("StockDatabase", 1);


dbRequest.onupgradeneeded = function () {
    var db = dbRequest.result;
    var store = db.createObjectStore("companyOne", {
        keyPath: "day"
    });
    store.transaction.oncomplete = function (event) {
        var tx = db.transaction("companyOne", "readwrite");
        var companyOneStore = tx.objectStore("companyOne");
        _addInitialStockData(companyOneStore);
        tx.oncomplete = function () {
            db.close();
        };
    }
};

dbRequest.onsuccess = function () {
    // Start a new transaction
    var db = dbRequest.result;
    var tx = db.transaction("companyOne", "readwrite");
    var store = tx.objectStore("companyOne");

    // Query the data
    var allDays = store.getAll();

    allDays.onsuccess = function () {
        StockChart.populate(allDays.result);
    };

    // Close the db when the transaction is done
    tx.oncomplete = function () {
        db.close();
    };
}

function _addInitialStockData(store) {
    store.add({
        day: 0,
        open: 123,
        high: 145,
        low: 123,
        close: 142
    });
    store.add({
        day: 1,
        open: 140,
        high: 146,
        low: 133,
        close: 139
    });
    store.add({
        day: 2,
        open: 134,
        high: 136,
        low: 123,
        close: 124
    });
}