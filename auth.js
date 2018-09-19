const session = require('express-session');
const FileStore = require('session-file-store')(session);
const uuid = require('uuid/v4');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');
const routes = require('express').Router();

const User = require('./models/user');

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {

}));

const localConfig = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
};

passport.use('local-signup', new LocalStrategy(localConfig, (req, email, password, done) => {
    console.log('Received new sign up by', email);
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds).then(hash => {
        let query = { 'local.email': email };
        let newUser = { email: email, local: { email: email, password: hash } };
        let options = { new: true, upsert: true, rawResult: true };
        User.findOneAndUpdate(query, { $setOnInsert: newUser }, options, (err, res) => {
            if (err) {
                throw err;
            } else {
                if (res.lastErrorObject.upserted) {
                    console.log('Signup', email, 'success');
                    done(null, res.value);
                } else {
                    console.log('Email', email, 'already exists');
                }
            }
        });
    });
}));

passport.use('local-login', new LocalStrategy(localConfig, (req, email, password, done) => {
    console.log('Received new login by', email);
    User.findOne({ 'local.email': email }).exec().then(user => {
        if (!user) {
            console.log('Could not find email', email, 'upon login');
            done(null, false);
        } else {
            bcrypt.compare(password, user.local.password).then(success => {
                console.log('Password matched?', success);
                done(null, success && user);
            });
        }
    })
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).exec().then(user => {
        done(null, user);
    });
});

routes.get('/get_user', (req, res) => {
    let { name, email } = req.user || {};
    res.json({ name, email });
});

let redirectTargets = {
    successRedirect: '/',
    failureRedirect: '/'
};

routes.post('/sign_up', passport.authenticate('local-signup', redirectTargets));

routes.post('/login', passport.authenticate('local-login', redirectTargets));

routes.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
routes.get('/facebook', passport.authenticate('facebook'));

routes.get('/facebook/callback', passport.authenticate('facebook', redirectTargets));

function setup(app) {
    app.use(session({ // TODO set cookie secure to be true once we have prod env
        genid: req => uuid(),
        store: new FileStore(),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }))

    app.use(passport.initialize());
    app.use(passport.session());
}

function checkLogin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}

module.exports = { setup, checkLogin, routes };
