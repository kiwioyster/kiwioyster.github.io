// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
// var DB = {};
var dbRequest = indexedDB.open("StocksDatabase", 1)

dbRequest.onupgradeneeded = function () {
    // var db = dbRequest.result;
    // var storeThree = db.createObjectStore(COMPANY_THREE, {
    //     keyPath: "day"
    // });
    // var storeTwo = db.createObjectStore(COMPANY_TWO, {
    //     keyPath: "day"
    // });
    // var gdpStore = db.createObjectStore(QUARTERLY_GDP, {
    //     keyPath: "DATE"
    // });
    // var storeOne = db.createObjectStore(COMPANY_ONE, {
    //     keyPath: "day"
    // });
    // storeThree.transaction.oncomplete = function (event) {
    //     var tx = db.transaction("companyOne", "readwrite");
    //     var companyOneStore = tx.objectStore("companyOne");
    //     tx.oncomplete = function () {
    //         db.close();
    //     };
    // }
    // };
}

dbRequest.onsuccess = function () {
    var getAllCompanyOne = DB.getAll(COMPANY_ONE);
    var getAllCompanyTwo = DB.getAll(COMPANY_THREE);
    var getAllQuarterlyGdp = DB.getAll(QUARTERLY_GDP);
    getAllCompanyTwo.onsuccess = function () {
        if (getAllCompanyTwo.result.prices) {
            CompanyOneStock.populate(getAllCompanyTwo.result.prices);
        } else {
            CompanyOneStock.populate(getAllCompanyTwo.result);
        }
    }
    // getAllCompanyTwo.onsuccess = function () {
    // if (getAllCompanyTwo.result.prices) {
    //     CompanyTwoStock.populate(getAllCompanyTwo.result.prices);
    // } else {
    //     CompanyTwoStock.populate(getAllCompanyTwo.result);
    // }
    // }
    getAllQuarterlyGdp.onsuccess = function () {
        QUARTERLY_GDP_ARRAY.set(getAllQuarterlyGdp.result);
    }
}

const DB = {

    addRows: (storeName, rows) => {
        // Start a new transaction
        var db = dbRequest.result;
        var tx = db.transaction(storeName, "readwrite");
        var store = tx.objectStore(storeName);

        rows.forEach(r => {
            store.add(r);
        })

        tx.oncomplete = function () {
            db.close();
        };
    },

    deleteRows: (storeName, rows) => {
        // Start a new transaction
        var db = dbRequest.result;
        var tx = db.transaction(storeName, "readwrite");
        var store = tx.objectStore(storeName);

        rows.forEach(r => {
            store.delete(r.day);
        })

        tx.oncomplete = function () {
            db.close();
        };
    },

    getAll: (storeName) => {
        var db = dbRequest.result;
        var tx = db.transaction(storeName, "readwrite");
        var store = tx.objectStore(storeName);
        return store.getAll();

        tx.oncomplete = function () {
            db.close();
        };
    },

    clear: (storeName) => {
        var db = dbRequest.result;
        var tx = db.transaction(storeName, "readwrite");
        var store = tx.objectStore(storeName);
        store.clear();

        tx.oncomplete = function () {
            db.close();
        };
    }
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