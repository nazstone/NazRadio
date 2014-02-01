define(["jquery", "backbone"], function ($, Backbone) {

	PlayerInfo = Backbone.Model.extend({

	});
	
	BrowserItem = Backbone.Model.extend({
		defaults: {
			artist: "",
			album: ""
		}
	});

	Morceau = Backbone.Model.extend({
		//les valeurs par défaut d'un article
		defaults: {
			path: "",
			path2: "",
			name: "Morceau"
		}
	});
    
    Radio = Backbone.Model.extend({
		defaults: {
			id: "",
			title: "",
			url : "Morceau"
		}
	});

	Radios = Backbone.Collection.extend({
		model: Radio
	});
    
    Morceaux = Backbone.Collection.extend({
		model: Morceau
	});

	Album = Backbone.Model.extend({
		defaults: {
			artist: "",
			path: "",
			name: "Album",
			morceaux: null
		}
	});

	Artist = Backbone.Model.extend({

		defaults: {
			name: "Artiste sans nom",
			path: "",
			album: ""
		}
	});
	return {
		Artist : Artist,
		Album : Album,
		Morceau : Morceau,
		Morceaux : Morceaux,
		PlayerInfo : PlayerInfo,
		BrowserItem : BrowserItem,
        Radio : Radio,
        Radios : Radios
	}
});