var NazMpd = require('./lib/nazMpd.js');
var sudo = require('sudo');
var fs = require('fs');

var Controller = function (config, io) {
    this.config = config;
    this.io = io;
    this.nazMpd = null;

    var self = this;
    try {
        /** mpd **/
        this.nazMpd = new NazMpd();
        self.nazMpd.connect(self.config.mpd.host, self.config.mpd.port, function () {
            self.statusPlayListPlayerStatus();
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
        refreshStatus = function (status) {
            self.socket.emit("playlistStatus", {
                playlist: status
            });
        };
        try {
            switch (data.action) {
            case "status":
                self.statusPlayListPlayerStatus();
                break;

            case "play":
                self.nazMpd.clearPlaylist(function () {
                    self.nazMpd.findAllTitlesFromAlbumAndArtist(data.artist, data.album, data.title, function (file) {
                        self.nazMpd.addToPlaylist(file, function () {
                            self.nazMpd.play(refreshStatus);
                        });
                    });
                });
                break;

            case "add":
                self.nazMpd.findAllTitlesFromAlbumAndArtist(data.artist, data.album, data.title, function (file) {
                    self.nazMpd.addToPlaylist(file, refreshStatus);
                });
                break;

            case "clear":
                self.nazMpd.clearPlaylist(refreshStatus);
                break;

            case "remove":
                self.nazMpd.removeFromPlaylist(data.position, function () {
                    self.statusPlayListPlayerStatus();
                });
                break;
            case "playPos":
                self.nazMpd.playFromPlaylistPosition(data.position, function () {
                    self.statusPlayListPlayerStatus();
                });
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

    getRadiosJson: function (callback) {
        var file = __dirname + '/conf/radios.json';

        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                data = null;
            }
            var radiosTmp = JSON.parse(data);
            callback(radiosTmp);
        });
    },

    radioControlSwitch: function (control) {
        var self = this;
        if (control.action == 'getAll') {
            self.getRadiosJson(function (data) {
                self.socket.emit("radioStatus", data);
            });
        } else if (control.action == 'play') {
            self.getRadiosJson(function (data) {
                var radiosLength = data.radios.length;
                var i = 0;
                while (control.id != data.radios[i].id && i < radiosLength) {
                    i++;
                }
                if (i < radiosLength) {
                    self.nazMpd.clearPlaylist(function () {
                        var tmp = [{
                            file: data.radios[i].url
                        }];
                        self.nazMpd.addToPlaylist(tmp, function () {
                            self.nazMpd.play(function () {});
                        });
                    });
                }
            });
        }
    }
};
module.exports = Controller;