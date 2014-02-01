define(["class"], function () {
	var UtilTime = Class.extend({
		timeToStr: function (time) {
			if (!isNaN(time)) {
				var minutesTmp = parseInt(time) % 60;
				var timeTmp = parseInt(time / 60) + ":" + ((minutesTmp < 10) ? "0" : "") + minutesTmp;
				return timeTmp;
			}
			return "";
		}
	});
	return {
		UtilTime: new UtilTime()
	};
});