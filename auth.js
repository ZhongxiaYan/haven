const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');
const path = require('path');

const db = require('./database');


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    db.queryUserAccessToken(accessToken).then(user => {
        done(null, user);
    }); // TODO catch
}));

const localConfig = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
};

passport.use('local-signup', new LocalStrategy(localConfig, (req, email, password, done) => {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds).then(hash => {
        db.tryInsertUserByEmail(email, hash).then(success => {
            console.log('Signup', email, 'success', !!success);
            done(null, success && { id: email });
        });
    });
}));

passport.use('local-login', new LocalStrategy(localConfig, (req, email, password, done) => {
    db.findUserByEmail(email).then(user => {
        if (!user) {
            console.log('Could not find email', email, 'upon login');
            done(null, false);
        } else {
            bcrypt.compare(password, user.passwordHash).then(success => {
                console.log('Password matched?', success);
                user.id = user.email;
                done(null, success && user);
            });
        }
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.findUserById(id).then(user => {
        done(null, user);
    });
});

function setup(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    let redirectTargets = {
        successRedirect: '/',
        failureRedirect: '/'
    };

    app.post('/auth/sign_up', passport.authenticate('local-signup', redirectTargets));

    app.post('/auth/login', passport.authenticate('local-login', redirectTargets));

    app.post('/auth/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', redirectTargets));
}

function checkLogin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}

module.exports = { setup, checkLogin };