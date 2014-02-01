(function () {
	var AbstractParser = require('./abstract_parser.js'),
		_ = require('underscore');

	var LineParser = AbstractParser.extend({
		parse: function (s) {
			if (!s) {
				return s;
			}

			var that = this,
				lines = s.split('\n'),
				obj,
				json = [];

			_(lines).chain().compact().each(function (l, index) {
				var o = that.parseLine(l);

				obj = {};

				if (o.value != null && o.value.length > 0) {
					obj[o.key] = o.value;
					json.push(obj);
				}
			});

			return (json.length == 1 ? json[0] : json);
		}
	});

	module.exports = LineParser;

})();