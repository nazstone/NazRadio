var NazMpd = require('./lib/nazMpd.js');
var sudo = require('sudo');
var fs = require('fs');
var RadioDB = require('./lib/radioDB.js');
var crypto = require('crypto');
var config = require('./conf/config.js');
var CoverArt = require('./lib/cover.js');

var Controller = function (config, io) {
    this.config = config;
    this.io = io;
    this.nazMpd = null;

    var self = this;
    try {
        /** mpd **/
        this.nazMpd = new NazMpd();
        this.radioDB = new RadioDB();

        self.nazMpd.connect(self.config.mpd.host, self.config.mpd.port, function () {
            self.statusPlayListPlayerStatus();
        });
        self.nazMpd.addCallbackOnPlayer(function() {
            if (self.config.mpd.cover.enabled) {
                self.nazMpd.status(function (status) {
                    self.nazMpd.playlist(function (playlist) {
                        self.coverArtAlbum(status, playlist);
                    });
                });
            }
        });
    } catch (error) {
        self.sendErrorMessageOnSocketOn(error);
    }
};

Controller.prototype = {

    /**
     * function call to have the playlist and the status send by socket to everyone
     */
    statusPlayListPlayerStatus: function () {
        var self = this;
        self.nazMpd.status(function (status) {
            self.nazMpd.playlist(function (playlist) {
                self.io.sockets.emit("playerStatus", {
                    status: status,
                    playlist: playlist
                });
            });
        });
    },
    setSocket: function (socket) {
        this.socket = socket;
    },

    /**
     * function call after a error on socket error
     */
    sendErrorMessageOnSocketOn: function (error) {
        console.error("error : ", error);
        console.log("error : " + error.stack);
        this.io.sockets.emit("error", {
            error: error
        });
    },


    settingsControlSwitch: function (control) {
        try {
            switch (control.action) {
            case "shutdown":
                sudo(["halt"], {});
                break;
            case "update":
                var self = this;
                self.nazMpd.update(function () {
                    self.socket.emit("settingsStatus", {
                        settings: "update"
                    });
                });
                break;
            default:
                break;
            }
        } catch (error) {
            this.sendErrorMessageOnSocketOn(error);
        }
    },

    browserControlSwitch: function (control) {
        var self = this;
        try {
            switch (control.action) {
            case "listArtist":
                self.nazMpd.listAllArtists(function (data) {
                    self.socket.emit("browserStatus", {
                        browser: data
                    });
                });
                break;
            case "listArtistAlbum":
                self.nazMpd.listAllAlbumsFrom(control.artist, function (data) {
                    self.socket.emit("browserStatus", {
                        browser: data,
                        artist: control.artist
                    });
                });
                break;
            case "listArtistAlbumMorceaux":
                self.nazMpd.listAllTitlesFromAlbumAndArtist(control.artist, control.album, function (data) {
                    self.socket.emit("browserStatus", {
                        browser: data,
                        artist: control.artist,
                        album: control.album
                    });
                });
                break;
            default:
                break;
            }
        } catch (error) {
            self.sendErrorMessageOnSocketOn(error);
        }
    },

    playlistControlSwitch: function (data) {
        var self = this;
        try {
            switch (data.action) {
            case "status":
                self.statusPlayListPlayerStatus();
                break;

            case "play":
                self.nazMpd.clearPlaylist(function () {
                    self.nazMpd.findAllTitlesFromAlbumAndArtist(data.artist, data.album, data.title, function (file) {
                        self.nazMpd.addToPlaylist(file, function () {
                            self.nazMpd.play();
                        });
                    });
                });
                break;

            case "add":
                self.nazMpd.findAllTitlesFromAlbumAndArtist(data.artist, data.album, data.title, function (file) {
                    self.nazMpd.addToPlaylist(file);
                });
                break;

            case "clear":
                self.nazMpd.clearPlaylist();
                break;

            case "remove":
                self.nazMpd.removeFromPlaylist(data.position);
                break;
            case "playPos":
                self.nazMpd.playFromPlaylistPosition(data.position);
                break;
            default:
                break;
            }
        } catch (error) {
            self.sendErrorMessageOnSocketOn(error);
        }
    },

    playerControlSwitch: function (data) {
        try {
            switch (data.action) {
            case "play":
                this.nazMpd.play();
                break;
            case "pause":
                this.nazMpd.pause();
                break;
            case "next":
                this.nazMpd.next();
                break;
            case "prev":
                this.nazMpd.prev();
                break;
            case "stop":
                this.nazMpd.stop();
                break;
            case "status":
                this.nazMpd.refresh();
                break;
            }
        } catch (error) {
            this.sendErrorMessageOnSocketOn(error);
        }
    },

    getRadios: function (callback) {
        this.radioDB.getAll(function (err, data) {
            if (err) {
                this.sendErrorMessageOnSocketOn(err);
                callback(null);
            } else {
                callback({
                    "radios": data
                });
            }
        });
    },

    getRadioById: function (id, callback) {
        this.radioDB.getRadioById(id, function (err, data) {
            if (err) {
                this.sendErrorMessageOnSocketOn(err);
            } else {
                callback(data);
            }
        });
    },

    insertRadio: function (title, url, callback) {
        if (title != null && title != "" > 0 && url != null && url != "") {
            var md5sum = crypto.createHash('md5');
            var id = md5sum.update(title + " " + url).digest('hex');
            this.radioDB.insertRadio(id, title, url, function (err, data) {
                if (err) {
                    this.sendErrorMessageOnSocketOn(err);
                } else {
                    callback();
                }
            });
        }
    },

    removeRadio: function (id, callback) {
        this.radioDB.removeRadio(id, function (err, data) {
            if (err) {
                this.sendErrorMessageOnSocketOn(err);
            } else {
                callback();
            }
        });
    },

    radioControlSwitch: function (control) {
        var self = this;
        if (control.action == 'getAll') {
            self.getRadios(function (data) {
                self.socket.emit("radioStatus", data);
            });
        } else if (control.action == 'play') {
            self.getRadioById(control.id, function (data) {
                self.nazMpd.clearPlaylist(function () {
                    var tmp = [{
                        file: data.url
                        }];
                    self.nazMpd.addToPlaylist(tmp, function () {
                        self.nazMpd.play(function () {});
                    });
                });
            });
        } else if (control.action == 'remove') {
            self.removeRadio(control.id, function () {
                self.radioControlSwitch({
                    action: "getAll"
                });
            });
        } else if (control.action == 'insert') {
            self.insertRadio(control.title, control.url, function () {
                self.radioControlSwitch({
                    action: "getAll"
                });
            });
        }
    },

    coverArtAlbum: function (status, playlist) {
        var self = this;
        //get info like album, artist, file
        var songId = (playlist > status.song) ? status.song : 0;
        var artist = playlist[songId].artist;
        var album = playlist[songId].album;
        var file = playlist[songId].file;
        //create mdr5 sum to find or create coverart file on disk
        var md5sum = crypto.createHash('md5');
        var id = md5sum.update("(" + artist + ")-(" + album + ")").digest('hex');

        var cover = new CoverArt(self.config.mpd.cover.dir + "/" + id);

        var callbackFile = function (err, fileName) {
            if (err) {
                console.log("err " + err);
                fs.writeFile(cover.recordFileName, '', function (err) {
                    if (err) {
                        throw err;
                    }
                    self.socket.emit('playerCover', {release : id});
                });
            } else {
                self.socket.emit('playerCover', {release : id});
            }
        };

        fs.exists(self.config.mpd.cover.dir + "/" + id, function (exists) {
            if (!exists) {
                console.log("file doesnt exist");
                self.nazMpd.config(function (err, config) {
                    if (!err) {
                        var pathFile = config.music_directory + "/" + file;
                        cover.getCoverByFile(pathFile, callbackFile);
                    } else {
                        cover.getCoverByMeta(artist, album, callbackFile);
                    }
                });
            } else {
                console.log("file exist");
                callbackFile(null, cover.recordFileName);
            }
        });
    }
};
module.exports = Controller;