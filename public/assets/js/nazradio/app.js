requirejs(["jquery", "marionette", "nazradio/model", "nazradio/router", "nazradio/view/PlayerView", "nazradio/controller", "socketio"],
	function ($, Marionette, model, router, PlayerView, controller, socketio) {

		function collapse() {
			if ($("#menu").hasClass("collapse")) {
				$("#menu").removeClass("collapse");
				$("#menu").addClass("in");
			} else {
				$("#menu").addClass("collapse");
				$("#menu").removeClass("in");
			}
		}

		window.notif = function (text, stay) {
			$("#notif").text(text);
			clearTimeout(window.timeoutFct);
            if (!stay) {
                window.timeoutFct = setTimeout(function () {
                    $("#notif").text("");
                }, 2000);
            }
		};

		window.socket = io.connect('ws://' + wsUrl + ':' + wsPort);
		window.socket.on('disconnect', function () {
			window.notif(message_socket_error, true);
		});
        
        window.socket.on("error", function(error) {
            console.log(error.error);
            window.notif(message_global_error, true);
        });

		window.application = new Marionette.Application();
		window.application.addRegions({
			controlList: "#control-list"
		});

		window.playerView = new PlayerView();
		window.playerView.model = new model.PlayerInfo({
			artist: "",
			title: "",
			album: "",
			ellapsed_time: "00:00",
			total_time: "00:00",
			pct: "00",
			play: false,
			pos: 0
		});
		window.playerView.render();

		window.controllerPlayer = new controller.ControllerPlayer(function (data) {
			window.playerView.displayInfo(data);
			window.playlistView.displayInfo(data);
		});
		window.controllerPlaylist = new controller.ControllerPlaylist(function (data) {
			window.playlistView.displayInfo(data);
		});
		window.controllerBrowser = new controller.ControllerBrowser(function (data) {
			window.browseView.displayInfo(data);
		});
		window.controllerSettings = new controller.SettingsController(function (data) {
			window.settingsView.displayInfo(data);
		});
        window.controllerRadio = new controller.RadioController(function (data) {
			window.radioView.displayInfo(data);
		});


		window.router = new router.Router();
		Backbone.history.start();

		$("#menu_button").click(function () {
			collapse();
		});

		$("#menu a").click(function () {
			collapse();
		});

		window.controllerPlayer.sendStatus();
	});