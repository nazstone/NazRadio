(function () {

	var mpd = require('mpd');
	var Class = require('clah');
	var _ = require("underscore");
	var LineParser = require('./line_parser.js');
	var ObjectListParser = require('./object_list_parser.js');
    
    var cmd = mpd.cmd;

	var NazMpd = Class.extend({
        /**
         * connexion
         */
		connect: function (host, port, callback) {
			this.client = mpd.connect({
				port: port,
				host: host,
			});
			this.refresh = callback;
			this.client.on('system-player', this.refresh);
			this.client.on('system-playlist', this.refresh);
		},
		/**
		 * retourne la liste des artistes
		 * pour utiliser le resultat dans le callback
		 * for (obj in resp) {
		 * 		console.log(resp[obj].artist);
		 * }
		 */
		listAllArtists: function (callback) {
			this.client.sendCommand(cmd("list artist", []),
				function (err, msg) {
					if (err) {
						throw err;
					}

					artists = new LineParser().parse(msg);

					if (!Array.isArray(artists)) {
						var respTmp = artists;
						artists = new Array();
						artists[0] = respTmp;
					}

					artists.sort(function (a, b) {
						if (a.artist < b.artist) return -1;
						if (a.artist > b.artist) return 1;
						return 0;
					});

					if (callback) {
						callback(artists);
					}
				});
		},

		/**
		 * retourne la liste des albums d'un artiste
		 * pour utiliser le resultat dans le callback
		 * for (obj in resp) {
		 * 		console.log(resp[obj].album);
		 * }
		 */
		listAllAlbumsFrom: function (artistName, callback) {
			this.client.sendCommand(cmd("list album artist \"" + artistName + "\"", []),
				function (err, msg) {
					if (err) {
						throw err;
					}

					var albums = new LineParser().parse(msg);

					if (!Array.isArray(albums)) {
						var respTmp = albums;
						albums = new Array();
						albums[0] = respTmp;
					}

					if (callback) {
						callback(albums);
					}
				});
		},

		/**
		 * retourne la liste des titres d'un album d'un artiste
		 * pour utiliser le resultat dans le callback
		 * for (obj in resp) {
		 * 		console.log(resp[obj].title);
		 * }
		 */
		listAllTitlesFromAlbumAndArtist: function (artistName, albumName, callback) {
			this.client.sendCommand(cmd("list title artist \"" + artistName + "\" album \"" + albumName + "\"", []),
				function (err, msg) {
					if (err) {
						throw err;
					}

					var titles = new LineParser().parse(msg);

					if (!Array.isArray(titles)) {
						var respTmp = titles;
						titles = new Array();
						titles[0] = respTmp;
					}

					if (callback) {
						callback(titles);
					}
				});
		},

		/**
		 * retourne la liste des fichiers en fonction des artistes, albums et titre
		 * pour utiliser le resultat dans le callback
		 * for (obj in resp) {
		 * 		console.log(resp[obj].title);
		 * }
		 */
		findAllTitlesFromAlbumAndArtist: function (artistName, albumName, title, callback) {
			var cmdStr = "find artist \"" + artistName + "\"";
			if (albumName) {
				cmdStr += " album \"" + albumName + "\"";
			}
			if (title) {
				cmdStr += " title \"" + title + "\"";
			}
			this.client.sendCommand(cmd(cmdStr, []),
				function (err, msg) {
					if (err) {
						throw err;
					}

					var files = new ObjectListParser().parse(msg);

					if (!Array.isArray(files)) {
						var respTmp = files;
						files = new Array();
						files[0] = respTmp;
					}

					if (callback) {
						callback(files);
					}
				});
		},

		/**
		 * add file to playlist
		 */
		addToPlaylist: function (file, callback) {
			var array = new Array();
			for (var i = 0; i < file.length; i++) {
				array[i] = cmd("add \"" + file[i].file + "\"", []);
			}
			this.client.sendCommands(array,
				function (err, msg) {
					if (err) {
						throw err;
					}
					if (callback) {
						callback();
					}
				});
		},

		/**
		 * clear the playlist
		 */
		clearPlaylist: function (callback) {
			this.client.sendCommand(cmd("clear", []),
				function (err, msg) {
					if (err) {
						throw err;
					}
					if (callback) {
						callback();
					}
				});
		},

		/**
		 * get playlist file
		 */
		playlist: function (callback) {
			this.client.sendCommand(cmd("playlistinfo", []),
				function (err, msg) {
					if (err) {
						throw err;
					}

					var playlistFile = new ObjectListParser().parse(msg);

					if (!Array.isArray(playlistFile)) {
						var respTmp = playlistFile;
						playlistFile = new Array();
						playlistFile[0] = respTmp;
					}

					if (callback) {
						callback(playlistFile);
					}
				});
		},

		/**
		 * remove from playlist a file
		 */
		removeFromPlaylist: function (pos, callback) {
			//console.log("tada delete pos " + pos);
			this.client.sendCommand(cmd("delete " + pos, []),
				function (err, msg) {
					if (err) {
						throw err;
					}

					if (callback) {
						callback();
					}
				});
		},

		/**
		 * remove from playlist a file
		 */
		playFromPlaylistPosition: function (pos, callback) {
			this.client.sendCommand(cmd("play " + pos, []),
				function (err, msg) {
					if (err) {
						throw err;
					}

					if (callback) {
						callback();
					}
				});
		},

		/**
		 * statut
		 */
		status: function (callback) {
			this.client.sendCommand(cmd("status", []),
				function (err, msg) {
					if (err) {
						throw err;
					}
					if (callback) {
						callback(new ObjectListParser().parse(msg));
					}
				});
		},

		/**
		 * play next the playlist
		 */
		next: function (callback) {
			this.client.sendCommand(cmd("next", []),
				function (err, msg) {
					if (err) {
						throw err;
					}
					if (callback) {
						callback();
					}
				});
		},

		/**
		 * play prev the playlist
		 */
		prev: function (callback) {
			this.client.sendCommand(cmd("previous", []),
				function (err, msg) {
					if (err) {
						throw err;
					}
					if (callback) {
						callback();
					}
				});
		},

		/**
		 * play the playlist
		 */
		play: function (callback) {
			this.client.sendCommand(cmd("play", []),
				function (err, msg) {
					if (err) {
						throw err;
					}
					if (callback) {
						callback();
					}
				});
		},

		/**
		 * pause the playlist
		 */
		pause: function (callback) {
			this.client.sendCommand(cmd("pause", []),
				function (err, msg) {
					if (err) {
						throw err;
					}
					if (callback) {
						callback();
					}
				});
		},

		/**
		 * pause the playlist
		 */
		stop: function (callback) {
			this.client.sendCommand(cmd("stop", []),
				function (err, msg) {
					if (err) {
						throw err;
					}
					if (callback) {
						callback();
					}
				});
		},
		refresh : function() {
		},
		update : function(callback) {
			this.client.sendCommand(cmd("update", []),
				function (err, msg) {
					if (err) {
						throw err;
					}
					if (callback) {
						callback();
					}
				});
		}
	});
	module.exports = NazMpd;
})();