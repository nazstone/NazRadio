var sqlite3 = require('sqlite3').verbose();

var RadioDB = function() {
    db = new sqlite3.Database('radio.sqlite3', function() {
        db.run("CREATE TABLE IF NOT EXISTS radio (id TEXT, title TEXT, url TEXT);", function() {
            //console.log("table created");
        });
    });
    this.db = db;
};

RadioDB.prototype = {
    getAll : function(callback) {
        this.db.all("select id, title, url from radio", function(err, row) {
            callback(err, row);
        });
    },
    getRadioById : function(id, callback) {
        this.db.get("select id, title, url from radio where id = ?", id, function(err, row) {
            callback(err, row);
        });
    },
    insertRadio : function(id, title, url, callback) {
        this.db.run("INSERT INTO radio (id, title, url) VALUES (?, ?, ?);", [id, title, url], callback);
    },
    removeRadio : function(id, callback) {
        this.db.run("delete from radio where id = ?", id, callback);
    },
    closeDb : function() {
        db.close();
    }
};

module.exports = RadioDB;