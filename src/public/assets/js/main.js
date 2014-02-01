requirejs.config({
	baseUrl : "assets/js",
	paths: {
		backbone: 'lib/backbone-min',
		underscore: 'lib/underscore-min',
		jquery: 'lib/jquery-1.10.2.min',
		marionette: 'lib/backbone.marionette.min',
		tpl: "lib/tpl",
		socketio: '/socket.io/socket.io',
		text : "lib/text",
		class : "lib/class",
		util : "nazradio/util"
	},
	shim: {
		jquery: {
			exports: '$'
		},
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		},
		marionette: {
			deps: ['jquery', 'underscore', 'backbone'],
			exports: 'Marionette'
		},
		socketio: {
		  exports: 'io'
		}
	}
});

requirejs(["nazradio/app"], function() {
	console.log("load");
});
