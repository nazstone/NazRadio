var fs = require('fs');
var mm = require('musicmetadata');
var request = require('request');
var querystring = require('querystring');

var CoverArt = function (recordFileName) {
    this.recordFileName = recordFileName;
};

CoverArt.prototype = {
    getCoverByFile: function (pathFile, callback) {
        var cover = this;
        var parser = new mm(fs.createReadStream(pathFile));
        parser.on('metadata', function (result) {
            if (result.picture && result.picture.length > 0) {
                cover.extractMetadataCover(result, callback);
            } else {
                getCoverByMeta(result.artist, result.title, callback);
            }
        });
    },
    
    getCoverByMeta: function (artist, album, callback) {
        var cover = this;
        cover.musicBrainzSearch(artist, album, function (id) {
            cover.coverArtArchiveDownload(id, callback);
        });
    },

    extractMetadataCover: function (result, callback) {
        var imageFileName = this.recordFileName;
        fs.writeFile(imageFileName, result.picture[0].data, function (err) {
            callback(err, imageFileName);
        });
    },

    coverArtArchiveDownload: function (id, callback) {
        var cover = this;
        var imageFileName = cover.recordFileName;
        var request = require('request');
        request("http://coverartarchive.org/release/" + id, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var ext = JSON.parse(body).images[0].image;
                ext = ext.substring(ext.lastIndexOf("."), ext.length);
                var r = request(JSON.parse(body).images[0].image).pipe(fs.createWriteStream(imageFileName));
                r.on('finish', function () {
                    callback(null, imageFileName);
                });
                r.on('error', function (error) {
                    callback(error, null);
                });
            } else {
                callback(new Error("coverartarchive error - not found " + response.statusCode), null);
            }
        });
    },

    musicBrainzSearch: function (artist, album, callback) {
        var album = querystring.escape(album);
        artist = querystring.escape(artist);
        var query = "artist:" + artist + "+release:" + album;
        request('http://musicbrainz.org/ws/2/release/?query=' + query + '+AND+status:official+primarytype:album+AND+NOT+(secondarytype:live+OR+secondarytype:compilation+OR+secondarytype:audiobook+OR+secondarytype:interview+OR+secondarytype:remix+OR+secondarytype:soundtrack+OR+secondarytype:spokenword)&fmt=json', function (error, response, body) {
            var id = null;
            if (!error && response.statusCode == 200) {
                var responseJson = JSON.parse(body);
                var responsesArray = responseJson.releases;
                var min = Math.min(responsesArray.length, 2);
                if (responsesArray.length > 0) {
                    id = responseJson.releases[0].id;
                }
            }
            callback(id);
        });
    }
};

module.exports = CoverArt;