var SpotifyWebApi = require('spotify-web-api-node');
var configAuth = require('../config/auth');
var db = require('./db.js')
// credentials are optional
var spotifyApi = new SpotifyWebApi({
	clientID        : configAuth.spotifyAuth.clientID,
	clientSecret    : configAuth.spotifyAuth.clientSecret,
  	redirectUri : 'https://personality-to-music.herokuapp.com/login/auth/spotify/callback'
});



function lastMusics (req,res, accessToken, idFB) {
	spotifyApi.setAccessToken(accessToken);
	//spotifyApi.getMyRecentlyPlayedTracks({limit: 50})
	spotifyApi.getMyTopTracks({limit: 50})
	  .then(function(data) {
	    //console.log('Artist information', data.body);
	    var Users = db.Mongoose.model('usercollection', db.UserSchema, 'usersData');
	    console.log('idFB');
	    console.log(idFB);
		var query = { _id: idFB}
	    Users.findOneAndUpdate(query, { _id: idFB, musics: data.body }, {upsert:true}, function(err, doc){
		    if (err) return res.send(500, { error: err });
		    return res.redirect('/obrigado');
		});

	  }, function(err) {
	    console.error(err);
	});
}

function playlist2017(req, res, accessToken, userId, idFB){
	spotifyApi.setAccessToken(accessToken);
	spotifyApi.getUserPlaylists().then(function(data) {
    	//console.log('Found playlists are', data.body);
    	data.body.items.forEach( function(element, index) {
    		// statements
    		if(element.name == "Your Top Songs 2017"){
    			playlist = element;
    			console.log(element.id);
    			savePlaylist(req, res, userId, element.id, accessToken, idFB);

    		}
    		//console.log(element.name);
    	});
    	//req.send(playlist);
  	}, function(err) {
    	console.log('Something went wrong!', err);
  	});

}

function savePlaylist (req, res, userId, playlistId, accessToken, idFB) {
	//spotifyApi.setAccessToken(accessToken);
	spotifyApi.getPlaylist('spotify', playlistId)
	.then(function(data) {
    	//console.log('Some information about this playlist', data.body);
    	//req.send(data.body);
    	var Users = db.Mongoose.model('usercollection', db.UserSchema, 'usersData');
		var query = { _id: idFB}
	    Users.findOneAndUpdate(query, { _id: idFB, musics2017: data.body }, {upsert:true}, function(err, doc){
		    if (err) return res.send(500, { error: err });
		    lastMusics(res,res,accessToken, idFB);
		});
  	}, function(err) {
    	console.log('Something went wrong!', err);
  	});
}

module.exports ={lastMusics, playlist2017};