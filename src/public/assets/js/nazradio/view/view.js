define(["jquery", "marionette", "nazradio/model", "nazradio/util"],
    function ($, Marionette, model, util) {

        PlaylistRow = Marionette.ItemView.extend({
            tagname: "div",
            className: "playlist-row list-group-item",
            template: "#playlist-row-template",
            triggers: {
                "click #control-trash": "item:trash",
                "click #control-play": "item:play"
            }
        });

        PlaylistView = Marionette.CompositeView.extend({
            itemView: PlaylistRow,

            itemViewContainer: "#playlist-container",

            itemViewEventPrefix: "playlistEvent",

            template: "#playlist-template",

            displayInfo: function (data) {
                var morceaux = new model.Morceaux;
                if (data.playlist != null && data.playlist.length > 0 && typeof (data.playlist[0]) == "object") {
                    var length = data.playlist.length;
                    for (var i = 0; i < length; i++) {
                        var morceau = new model.Morceau({
                            name: (data.playlist[i].name != null && data.playlist[i].name.length > 0) ? data.playlist[i].name : data.playlist[i].title,
                            pos: parseInt(data.playlist[i].pos),
                            artist: data.playlist[i].artist,
                            album: data.playlist[i].album,
                            time: util.UtilTime.timeToStr(data.playlist[i].time),
                            play: (data.status.song == i)
                        });
                        morceaux.add(morceau);
                    }
                }

                this.collection = morceaux;
                this.render();
            },

            events: {
                "click #control-trash": "emptyPlaylist"
            },
            clickOnRowDelete: function (args) {
                window.controllerPlaylist.sendRemoveFromPlaylist(args.model.get("pos"));
            },
            clickOnRowPlay: function (args) {
                window.controllerPlaylist.sendPlayFromPlaylist(args.model.get("pos"));
            },
            emptyPlaylist: function () {
                window.controllerPlaylist.sendClearPlaylist();
            },
            initialize: function () {
                this.on("playlistEvent:item:trash", this.clickOnRowDelete);
                this.on("playlistEvent:item:play", this.clickOnRowPlay);
            }
        });

        BrowseRow = Marionette.ItemView.extend({
            tagname: "div",
            className: "list-group-item browse-row",
            template: "#browse-row-template",
            triggers: {
                "click #item": "click:item",
                "click #control-play": "click:item:play",
                "click #control-add": "click:item:add"
            }
        });

        BrowseView = Marionette.CompositeView.extend({
            itemView: BrowseRow,
            itemViewContainer: "#browse-container",
            itemViewEventPrefix: "browserItem",
            template: "#browse-template",
            triggers: {
                "click #reloadRoot": "browse:reloadRoot",
                "click #reloadArtist": "browse:reloadArtist"
            },
            reloadRoot: function () {
                window.controllerBrowser.sendListArtist();
            },
            reloadArtist: function () {
                window.controllerBrowser.sendListArtistAlbum(this.model.get("artist"));
            },
            displayInfo: function (data) {
                var morceaux = new model.Morceaux();
                var length = data.browser.length;
                for (var i = 0; i < length; i++) {
                    var nameTmp = data.browser[i].artist;

                    if (data.artist != null && data.artist.length > 0 && data.album != null && data.album.length > 0) {
                        nameTmp = data.browser[i].title;
                        this.model.set({
                            artist: data.artist,
                            album: data.album
                        });
                    } else if (data.artist != null && data.artist.length > 0) {
                        nameTmp = data.browser[i].album;
                        this.model.set({
                            artist: data.artist,
                            album: ""
                        });
                    } else {
                        this.model.set({
                            artist: "",
                            album: ""
                        });
                    }

                    var morceau = new model.Morceau({
                        name: nameTmp,
                    });
                    morceaux.add(morceau);
                }

                this.collection = morceaux;
                this.render();
            },
            clickOnRow: function (args) {
                if (this.model.get("album") == null || this.model.get("album").length <= 0) {
                    if (this.model.get("artist") != null && this.model.get("artist").length > 0) {
                        window.controllerBrowser.sendListArtistAlbumMorceaux(this.model.get("artist"), args.model.get("name"));
                    } else {
                        window.controllerBrowser.sendListArtistAlbum(args.model.get("name"));
                    }
                } else {
                    //window.controllerPlaylist.sendPlay(this.model.get("artist"), this.model.get("album"), args.model.get("name"));
                }
            },
            extractInfo: function (args) {
                var artist = "",
                    album = "",
                    title = "";
                if (this.model.get("artist") != null && this.model.get("artist").length > 0) {
                    artist = this.model.get("artist");
                    if (this.model.get("album") != null && this.model.get("album").length > 0) {
                        album = this.model.get("album");
                        title = args.model.get("name");
                    } else {
                        album = args.model.get("name");
                    }
                } else {
                    artist = args.model.get("name");
                }
                return {
                    artist: artist,
                    album: album,
                    title: title
                };
            },
            clickOnRowAdd: function (args) {
                var data = this.extractInfo(args);
                window.controllerPlaylist.sendAdd(data.artist, data.album, data.title);
                window.notif(message_file_add_playlist, false);
            },
            clickOnRowPlay: function (args) {
                var data = this.extractInfo(args);
                window.controllerPlaylist.sendPlay(data.artist, data.album, data.title);
                window.notif(message_file_add_playlist, false);
            },
            initialize: function () {
                this.model = new model.BrowserItem({
                    artist: "",
                    album: "",
                });
                this.on("browserItem:click:item", this.clickOnRow);
                this.on("browserItem:click:item:add", this.clickOnRowAdd);
                this.on("browserItem:click:item:play", this.clickOnRowPlay);
                this.on("browse:reloadRoot", this.reloadRoot);
                this.on("browse:reloadArtist", this.reloadArtist);
            }
        });

        var SettingsView = Marionette.CompositeView.extend({
            itemViewContainer: "#settings-container",
            template: "#settings-template",
            events: {
                "click #update": "update",
                "click #shutdown": "shutdown"
            },
            shutdown: function () {
                window.controllerSettings.sendShutdown();
            },
            update: function () {
                window.controllerSettings.sendUpdate();
            },
            displayInfo: function (data) {
                if (data.settings == "update") {
                    window.notif(message_update_progress, false);
                } else {
                    window.notif(message_stop, true);
                }
            }
        });

        RadioRow = Marionette.ItemView.extend({
            tagname: "div",
            className: "list-group-item browse-row",
            template: "#radio-row-template",
            triggers: {
                "click #control-play": "click:item:play",
                "click #control-remove": "click:item:remove"
            }
        });
        var RadioView = Marionette.CompositeView.extend({
            itemViewContainer: "#radio-container",
            template: "#radio-template",
            itemViewEventPrefix: "radioItem",
            itemView: RadioRow,
            displayInfo: function (data) {
                var radios = new model.Radios;
                if (data.radios != null && data.radios.length > 0 && typeof (data.radios[0]) == "object") {
                    var length = data.radios.length;
                    for (var i = 0; i < length; i++) {
                        var radio = new model.Radio({
                            url: data.radios[i].url,
                            id: data.radios[i].id,
                            title: data.radios[i].title
                        });
                        radios.add(radio);
                    }
                }

                this.collection = radios;
                this.render();
            },
            initialize: function () {
                this.on("radioItem:click:item:play", this.clickOnRowPlay);
                this.on("radioItem:click:item:remove", this.clickOnRowRemove);
            },
            onDomRefresh: function(){
                $("#radio-add #title").focusin(function () {
                    $("#radio-add #title").css('background-color', '');
                });
                $("#radio-add #url").focusin(function () {
                    $("#radio-add #url").css('background-color', '');
                });
            },
            clickOnRowPlay: function (args) {
                window.controllerRadio.sendPlayRadio(args.model.get("id"));
                console.log("play " + args.model.get("id"));
            },
            clickOnRowRemove: function (args) {
                window.controllerRadio.sendRemoveRadio(args.model.get("id"));
                console.log("remove " + args.model.get("id"));
            },
            clickOnInsertRadio: function () {
                var jqueryTitle = "#radio-add #title";
                var jqueryUrl = "#radio-add #url";
                var cssColor = 'background-color';
                if ($(jqueryTitle).val() != "" && $(jqueryUrl).val() != "") {
                    $(jqueryTitle).css(cssColor, '');
                    $(jqueryUrl).css(cssColor, '');
                    window.controllerRadio.sendInsertRadio($(jqueryTitle).val(), $(jqueryUrl).val());
                } else {
                    window.notif(messageEmptyField, false);
                    $(jqueryTitle).css(cssColor, '#f00');
                    $(jqueryUrl).css(cssColor, '#f00');
                }
            },
            clickOnShowHideInsertRadio: function () {
                if ($("#radio-add").is(":visible")) {
                    $("#radio-add").hide();
                } else {
                    $("#radio-add").show();
                }
            },
            events: {
                "click #control-add": "clickOnInsertRadio",
                "click #control-plus": "clickOnShowHideInsertRadio"
            },
        });
        return {
            BrowseView: BrowseView,
            PlaylistView: PlaylistView,
            SettingsView: SettingsView,
            RadioView: RadioView
        };
    });