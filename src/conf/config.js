var config = {}

config.web = {};
config.mpd = {};

config.web.title = 'NazRadio.local';
config.web.port = 8081;//process.env.WEB_PORT

config.mpd.host = '192.168.1.81';
config.mpd.port = 6600;
config.mpd.music_directory = "/home/nazstone/Music";

config.mpd.cover = {};

config.mpd.cover.enabled = true;
config.mpd.cover.dir = "./covert";

module.exports = config;