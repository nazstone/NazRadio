define(["class"],function(){var a=Class.extend({init:function(a){window.socket.on("playerStatus",a)},sendPlay:function(){this.sendAction("play")},sendStatus:function(){this.sendAction("status")},sendPause:function(){this.sendAction("pause")},sendStop:function(){this.sendAction("stop")},sendNext:function(){this.sendAction("next")},sendPrev:function(){this.sendAction("prev")},sendAction:function(a){window.socket.emit("playerControl",{action:a})}}),b=Class.extend({init:function(a){window.socket.on("playlistStatus",a)},sendStatus:function(){window.socket.emit("playlistControl",{action:"status"})},sendPlay:function(a,b,c){window.socket.emit("playlistControl",{action:"play",artist:a,album:b,title:c})},sendAdd:function(a,b,c){window.socket.emit("playlistControl",{action:"add",artist:a,album:b,title:c})},sendClearPlaylist:function(){window.socket.emit("playlistControl",{action:"clear"})},sendRemoveFromPlaylist:function(a){window.socket.emit("playlistControl",{action:"remove",position:a})},sendPlayFromPlaylist:function(a){window.socket.emit("playlistControl",{action:"playPos",position:a})}}),c=Class.extend({init:function(a){window.socket.on("browserStatus",a)},sendAction:function(a){window.socket.emit("browserControl",{action:a})},sendListArtist:function(){this.sendAction("listArtist")},sendListArtistAlbum:function(a){window.socket.emit("browserControl",{action:"listArtistAlbum",artist:a})},sendListArtistAlbumMorceaux:function(a,b){window.socket.emit("browserControl",{action:"listArtistAlbumMorceaux",artist:a,album:b})}}),d=Class.extend({init:function(a){window.socket.on("settingsStatus",a)},sendAction:function(a){window.socket.emit("settingsControl",{action:a})},sendUpdate:function(){this.sendAction("update")},sendShutdown:function(){this.sendAction("shutdown")}}),e=Class.extend({init:function(a){window.socket.on("radioStatus",a)},sendAction:function(a){window.socket.emit("radioControl",{action:a})},sendGetAll:function(){this.sendAction("getAll")},sendPlayRadio:function(a){window.socket.emit("radioControl",{action:"play",id:a})},sendInsertRadio:function(a,b){window.socket.emit("radioControl",{action:"insert",title:a,url:b})},sendRemoveRadio:function(a){window.socket.emit("radioControl",{action:"remove",id:a})}});return{ControllerPlayer:a,ControllerPlaylist:b,ControllerBrowser:c,SettingsController:d,RadioController:e}});