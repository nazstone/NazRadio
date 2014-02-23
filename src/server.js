var config = require('./conf/config.js');
var express = require('express');
var exphbs = require('express3-handlebars');
var i18n = require('i18n');
var app = express();
var server = require('http').createServer(app);
var os = require("os");
var Controller = require("./controller.js");
var NazMpd = require('./lib/nazMpd.js');
var fs = require('fs');

/** web **/
server.listen(config.web.port);

/** locale **/
i18n.configure({
    locales: ['en', 'fr'],
    cookie: 'locale',
    directory: __dirname + "/conf/locales"
});

if (config.mpd.cover.enabled) {
    fs.exists(config.mpd.cover.dir, function(exists) {
        if (!exists) {
            fs.mkdir(config.mpd.cover.dir, function() {
                console.log("covert config create");
            });
        }
    });
}

app.use("/assets", express.static(__dirname + '/public/assets'));
app.use(i18n.init);
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/coverArt/:release', function (req, res) {
    var release = req.params.release;
    
    console.log("requete");
    
    var callbackError = function() {
        res.writeHead(404);
        res.send();
    };

    if (release != null && release.length > 0) {
        var path = config.mpd.cover.dir + "/" + release;
        console.log(path);
        fs.exists(path, function (exists) {
            if (exists) {
                var stat = fs.statSync(path);
                if (stat.size > 0) {
                    res.writeHead(200);
                    fs.createReadStream(path).pipe(res);
                } else {
                    callbackError();
                }
            } else {
                callbackError();
            }
        });
    } else {
        callbackError();
    }
});

app.get('/*', function (req, res) {
    res.render(__dirname + '/template/index.handlebars', {
        wsUrl: os.hostname(),
        wsPort: config.web.port,
        title: config.web.title
    });
});

/** websocket **/
var io = require('socket.io').listen(server);
var socket = null;
io.set('log level', 1);

var controller = new Controller(config, io);

io.sockets.on('connection', function (socketmp) {
    socket = socketmp;

    controller.setSocket(socket);

    socket.on('playerControl', function (data) {
        controller.playerControlSwitch(data);
    });
    socket.on('playlistControl', function (data) {
        controller.playlistControlSwitch(data);
    });
    socket.on('browserControl', function (control) {
        controller.browserControlSwitch(control);
    });
    socket.on('settingsControl', function (control) {
        controller.settingsControlSwitch(control);
    });
    socket.on('radioControl', function (control) {
        controller.radioControlSwitch(control);
    });
});
