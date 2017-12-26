// router/routes.js
var FacebookStrategy = require('passport-facebook').Strategy;
var SpotifyStrategy = require('passport-spotify').Strategy;
var passport = require('passport');
var express = require('express');
var router = express.Router();
var configAuth = require('../config/auth');
var face = require("../utils/facebook");
var spotify = require('../utils/spotify');

var accessToken="";
var accessTokenSpotify="";


    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        done(null, id);
            
    });

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {
            accessToken = token;
            // set all of the facebook information in our user model
            console.log(profile.id); // set the users facebook id                   
            console.log(token); // we will save the token that facebook provides to the user                    
            console.log("profile"); // look at the passport user profile to see how names are returned
            console.log(profile); // facebook can return multiple emails so we'll take the first

            return done(null, profile);

        });

    }));



    // route for login form
    // route for processing the login form
    // route for signup form
    // route for processing the signup form

    // route for showing the profile page
    router.get('/profile', isLoggedIn, function(req, res) {
        console.log('Logado com sucesso');
        console.log(req);
        face.getPosts(req, res, accessToken);
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'user_likes,user_about_me,user_posts' }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/login/profile',
            failureRedirect : '/'
        }));

    // route for logging out
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};


// =====================================
// SPOTIFY ROUTES =====================
// =====================================

passport.use(new SpotifyStrategy({
    clientID        : configAuth.spotifyAuth.clientID,
    clientSecret    : configAuth.spotifyAuth.clientSecret,
    callbackURL     : 'http://localhost:3000/login/auth/spotify/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    
    process.nextTick(function() {
        accessTokenSpotify = accessToken;
        userId = profile.id;
        // set all of the facebook information in our user model
        console.log(profile.id); // set the users facebook id                   
        console.log(accessToken); // we will save the token that facebook provides to the user                    
        console.log("profile"); // look at the passport user profile to see how names are returned
        console.log(profile); // facebook can return multiple emails so we'll take the first

        return done(null, profile);

    });


  }
));

router.get('/auth/spotify',
  passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-recently-played', 'user-top-read', 'playlist-read-private'] }),
  function(req, res){
    // The request will be redirected to spotify for authentication, so this 
    // function will not be called. 
  });

 
router.get('/auth/spotify/callback',
  passport.authenticate('spotify',{
    successRedirect : '/login/profileSpotify',
    failureRedirect : '/'
}));

router.get('/profileSpotify', isLoggedIn, function(req, res) {
    console.log('Logado com sucesso no spotify');
    console.log(req.session.nameFB);

    spotify.lastMusics(res,res,accessTokenSpotify, req.session.nameFB);
    //spotify.playlist2017(res,res,accessTokenSpotify, userId, req.session.nameFB);
});

module.exports = router;
