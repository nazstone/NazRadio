define(["jquery", "backbone", "nazradio/model", "nazradio/view/view"],
	   function ($, Backbone, model, view, controller) {
	Router = Backbone.Router.extend({
		initialize : function() {
		},
		routes: {
			"browse": "browse",
			"": "defaultRoute",
			"settings": "settings",
            "radio" : "radio"
		},

		selectItem: function (selectedItem) {
			$("li.active").each(function (item, elt) {
				$(elt).removeClass("active");
			});
			selectedItem.addClass("active");
		},

		browse: function () {
			this.selectItem($("#select_browse").parent());

			/*  browse list  */
			if (_.isEmpty(window.browseView)) {
				window.browseView = new view.BrowseView();
				window.controllerBrowser.sendListArtist();
			}
			window.browseView.delegateEvents();
			window.application.controlList.show(window.browseView);
		},
		defaultRoute: function () {
			this.selectItem($("#select_playlist").parent());

			/*  Playlist  */
			if (_.isEmpty(window.playlistView)) {
				window.playlistView = new view.PlaylistView();
			}
			window.application.controlList.show(window.playlistView);
			window.playlistView.delegateEvents();
			//window.controllerPlaylist.sendStatus();
		},
		radio: function () {
			this.selectItem($("#select_radio").parent());

			/*  Radio  */
			if (_.isEmpty(window.radioView)) {
				window.radioView = new view.RadioView();
			}
			window.application.controlList.show(window.radioView);
			window.radioView.delegateEvents();
            window.controllerRadio.sendGetAll();
		},
		settings: function () {
			this.selectItem($("#select_settings").parent());

			/*  settings  */
			if (_.isEmpty(window.settingsView)) {
				window.settingsView = new view.SettingsView();
			}
			window.application.controlList.show(window.settingsView);
			window.settingsView.delegateEvents();
		}
	});
	return {
		Router : Router
	};
});