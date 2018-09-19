const passport = require('passport');
const UserPwStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');

const db = require('./database');


const saltRounds = 10;

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://127.0.0.1:5555/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    // User.findOrCreate(..., function (err, user) {
    //         if (err) { return done(err); }
    //         done(null, user);
    //     });
    // }
}));

// passport.use(new UserPwStrategy(
//     (username, password, callback) => {

//     }
// ));

// passport.serializeUser((res, callback) => {
//     callback(null, user.id);
// });

// passport.deserializeUser((id, callback) => {
//     db.findUserById(id).then(user => {
//         callback(null, user);
//     });
// });

function setup(app) {
    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', passport.authenticate('facebook'));
}

module.exports = { setup };