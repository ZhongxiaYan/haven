const session = require('express-session');
const FileStore = require('session-file-store')(session);
const uuid = require('uuid/v4');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const bcrypt = require('bcrypt');
const routes = require('express').Router();

const User = require('./models/user');

if (process.env.FACEBOOK_APP_ID) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_LOGIN_CALLBACK_URL
  }, (accessToken, refreshToken, profile, done) => {
    let query = { 'facebook.id': profile.id };
    let newUser = {
      name: profile.displayName,
      facebook: {
        id: profile.id,
        token: accessToken,
        name: profile.displayName
      }
    };
    let options = { new: true, upsert: true, rawResult: true };
    User.findOneAndUpdate(query, { $setOnInsert: newUser }, options, (err, result) => {
      if (err) {
        throw err;
      } else {
        let user = result.value;
        if (user) {
          if (result.lastErrorObject.upserted) { // sign up
            console.log('Signup', profile.displayName, 'success');
          } else { // log in
            console.log('Email', profile.displayName, 'already exists, logging in');
          }
          done(null, user);
        } else {
          console.error('Facebook login for', profile.displayName, 'failed');
          done(null, false);
        }
      }
    });
  }));
}

if (process.env.GOOGLE_OAUTH_CLIENT_ID) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_LOGIN_CALLBACK_URL
  }, (token, tokenSecret, profile, done) => {
    let query = { 'google.id': profile.id };
    let newUser = {
      name: profile.displayName,
      google: {
        id: profile.id,
        token: token,
        name: profile.displayName,
      }
    };
    let options = { new: true, upsert: true, rawResult: true };
    User.findOneAndUpdate(query, { $setOnInsert: newUser }, options, (err, result) => {
      if (err) {
        throw err;
      } else {
        let user = result.value;
        if (user) {
          if (result.lastErrorObject.upserted) { // sign up
            console.log('Signup', profile.displayName, 'success');
          } else { // log in
            console.log('Email', profile.displayName, 'already exists, logging in');
          }
          done(null, user);
        } else {
          console.error('Google login for', profile.displayName, 'failed');
          done(null, false);
        }
      }
    });
  }));
}

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
  let { name, email, phoneNumber, dateOfBirth } = req.user || {};
  res.json({ name, email, phoneNumber, dateOfBirth, found: !!req.user });
});

routes.post('/update_basic_info', (req, res) => {
  let user = req.user;
  if (!user) {
    return res.redirect('/');
  }
  let { name, email, phoneNumber, dateOfBirth } = req.body;
  Object.assign(user, { name, email, phoneNumber, dateOfBirth });
  user.save((err, updatedUser) => {
    if (err) {
      console.log('Fail');
      res.json({ success: false });
    } else {
      console.log('Success');
      res.json({ success: true });
    }
  });
});

function authenticateLocal(req, res, next, strategy) {
  passport.authenticate(strategy, (err, user, info) => {
    if (err) {
      next(err);
    } else if (!user) { // Did not find user
      res.json({ success: false });
    } else {
      req.logIn(user, (err) => {
        if (err) {
          next(err);
        } else {
          res.json({ success: true });
        }
      });
    }
  })(req, res, next);
}

// Override default way of handling login / sign up success and failure
routes.post('/sign_up', (req, res, next) => authenticateLocal(req, res, next, 'local-signup'));

routes.post('/login', (req, res, next) => authenticateLocal(req, res, next, 'local-login'));

const redirectTargets = {
  successRedirect: '/',
  failureRedirect: '/'
};

routes.get('/facebook', passport.authenticate('facebook'));

routes.get('/facebook/callback', passport.authenticate('facebook', redirectTargets));

routes.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

routes.get('/google/callback', passport.authenticate('google', redirectTargets));

routes.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

function setup(app) {
  app.use(session({ // TODO set cookie secure to be true once we have prod env
    genid: req => uuid(),
    store: new FileStore(),
    secret: process.env.FILES_STORE_SESSION_SECRET,
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
