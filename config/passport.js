/*
// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');

// load up the user model

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {
    
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
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

            // set all of the facebook information in our user model
            console.log(profile.id); // set the users facebook id                   
            console.log(token); // we will save the token that facebook provides to the user                    
            console.log(profile.name.givenName + ' ' + profile.name.familyName); // look at the passport user profile to see how names are returned
            console.log(profile.emails[0].value); // facebook can return multiple emails so we'll take the first

            return done(null, profile);

        });

    }));
};

*/