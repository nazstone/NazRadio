define(["class", "jquery"], function (Class, $) {
	var ControllerPlayer = Class.extend({
		init : function(callback, callbackCover) {
            var self = this;
			window.socket.on("playerStatus", callback);
            window.socket.on("playerCover", function(data) {
                if (self.release == null || self.release != data.release) {
                    self.release = data.release;
                    window.playerView.cover(data.release);
                }
            });
		},
		sendPlay : function() {
			this.sendAction("play");
		},
		sendStatus : function() {
			this.sendAction("status");
		},
		sendPause : function() {
			this.sendAction("pause");
		},
		sendStop : function() {
			this.sendAction("stop");
		},
		sendNext : function() {
			this.sendAction("next");
		},
		sendPrev : function() {
			this.sendAction("prev");
		},
		sendAction : function(action) {
			window.socket.emit('playerControl', {action: action});
		}
	});

	var ControllerPlaylist = Class.extend({
		init : function(callback) {
		},
		sendStatus : function() {
			window.socket.emit('playlistControl', {action: "status"});
		},
		sendPlay : function(artist, album, title) {
			window.socket.emit('playlistControl', {action: "play", artist : artist, album : album, title : title});
		},
		sendAdd : function(artist, album, title) {
			window.socket.emit('playlistControl', {action: "add", artist : artist, album : album, title : title});
		},
		sendClearPlaylist : function() {
			window.socket.emit('playlistControl', {action: "clear"});
		},
		sendRemoveFromPlaylist : function(position) {
			window.socket.emit('playlistControl', {action: "remove", position : position});
		},
		sendPlayFromPlaylist : function(position) {
			window.socket.emit('playlistControl', {action: "playPos", position : position});
		}
	});
	
	var ControllerBrowser = Class.extend({
		init : function(callback) {
			window.socket.on("browserStatus", callback);
		},
		sendAction : function(action) {
			window.socket.emit('browserControl', {action: action});
		},
		sendListArtist : function() {
			this.sendAction("listArtist");
		},
		sendListArtistAlbum : function(artist) {
			window.socket.emit('browserControl', {action: "listArtistAlbum", artist : artist});
		},
		sendListArtistAlbumMorceaux : function(artist, album) {
			window.socket.emit('browserControl', {action: "listArtistAlbumMorceaux", artist : artist, album : album});
		},
	});
	
	var SettingsController = Class.extend({
		init : function(callback) {
			window.socket.on("settingsStatus", callback);
		},
		sendAction : function(action) {
			window.socket.emit('settingsControl', {action: action});
		},
		sendUpdate : function() {
			this.sendAction("update");
		},
		sendShutdown : function(artist) {
			this.sendAction("shutdown");
		}
	});
    
    var RadioController = Class.extend({
		init : function(callback) {
			window.socket.on("radioStatus", callback);
		},
		sendAction : function(action) {
			window.socket.emit('radioControl', {action: action});
		},
        sendGetAll : function() {
            this.sendAction("getAll");
        },
        sendPlayRadio : function(id) {
            window.socket.emit('radioControl', {action: "play", id : id});
        },
        sendInsertRadio : function(title, url) {
            window.socket.emit('radioControl', {action: "insert", title : title, url : url});
        },
        sendRemoveRadio : function(id) {
            window.socket.emit('radioControl', {action: "remove", id : id});
        }
    });

	return {
		ControllerPlayer: ControllerPlayer,
		ControllerPlaylist : ControllerPlaylist,
		ControllerBrowser : ControllerBrowser,
		SettingsController : SettingsController,
        RadioController : RadioController
	};
});