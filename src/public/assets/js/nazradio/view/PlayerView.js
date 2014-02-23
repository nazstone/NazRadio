define(["jquery", "marionette", "tpl!nazradio/view/playerView.tpl", "nazradio/model", "underscore", "nazradio/util"],
	   function ($, Marionette, playerTmp, model, _, util) {
	var timerRefresh = 0;
	
    return Marionette.CompositeView.extend({
        initialize : function() {
            var self = this;
            this.coverArtWidth = $("#coverart").width();
            this.controlPlayerWidth = $("#control-player").width();
            this.hideCover();
            $("#img_cover").error(function() {
                self.hideCover();
            });
            $("#img_cover").load(function() {
                self.showCover();
            });
        },
        hideCover : function() {
            $("#coverart").width("0px");
            $("#control-player").width("100%");
        },
        showCover : function() {
            $("#coverart").width(this.coverArtWidth);
            $("#control-player").width(this.controlPlayerWidth);
        },
		el: $('#control-player'),
		template: playerTmp,
		events: {
			"click #control-backward": "prevClick",
			"click #control-forward": "nextClick",
			"click #control-stop": "stopClick",
			"click #control-play": "playClick",
		},
		prevClick: function () {
			window.controllerPlayer.sendPrev();
		},
		stopClick: function () {
			window.controllerPlayer.sendStop();
		},
		nextClick: function () {
			window.controllerPlayer.sendNext();
		},
		playClick: function () {
			if ($("#control-play span").hasClass("glyphicon-play")) {
				$("#control-play span").removeClass("glyphicon-play");
				$("#control-play span").addClass("glyphicon-pause");
				window.controllerPlayer.sendPlay();
			} else {
				$("#control-play span").removeClass("glyphicon-pause");
				$("#control-play span").addClass("glyphicon-play");
				window.controllerPlayer.sendPause();
			}
		},
		displayInfo : function(data) {
			//stop timer
			clearInterval(timerRefresh);

			var play = (data.status.state == "play");
			var songId = (data.playlist > data.status.song)? data.status.song : 0;
            
			this.model = new model.PlayerInfo({
				artist: data.playlist[songId].artist,
				title: (data.playlist[songId].name != null && data.playlist[songId].name.length > 0) ? data.playlist[songId].name : data.playlist[songId].title,
				pos: data.playlist[songId].pos,
				album: data.playlist[songId].album,
				ellapsed_time: util.UtilTime.timeToStr(data.status.elapsed),
				ellapsed_time_int : data.status.elapsed,
				total_time: util.UtilTime.timeToStr(data.playlist[songId].time),
				total_time_int : parseInt(data.playlist[songId].time),
				pct: data.status.elapsed * 100 / data.playlist[songId].time,
				play : play
			});

			this.render();

			if (play) {
				var modelTmp = this.model;
				var playlistViewtmp = this;
				//refresh info method
				timerRefresh = setInterval(function() {
					if (parseInt(modelTmp.get("pct")) >= 100) {
						window.controllerPlayer.sendStatus();
					}
					var ellapsed = parseInt(modelTmp.get("ellapsed_time_int")) + 1;
					modelTmp.set({ellapsed_time_int : ellapsed});
					modelTmp.set({ellapsed_time: util.UtilTime.timeToStr(ellapsed)});
					modelTmp.set({pct: ellapsed * 100 / modelTmp.get("total_time_int")});
					playlistViewtmp.render();
				}, 1000);
            }
		},
        cover : function(release) {
            $("#img_cover").attr("src", "coverArt/" + release);
        }
	});
});