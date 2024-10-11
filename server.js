const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const GitHubStrategy = require('passport-github2').Strategy;
const mongodb = require('./data/database.js');
const passport = require('passport');
const session = require('cookie-session');

const app = express();

const port = process.env.PORT || 5959;

// Read JSON
app.use(bodyParser.json());

// User Sessions
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Compatability
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Controll-Allow-Methods', 'GET, PATCH, POST, PUT, DELETE, OPTIONS');
    next();
});

// CORS
app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }));
app.use(cors({ origin: '*' }));

// Routes
app.use('/', require('./routes/index.js'));

// GitHub Passport
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
(accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}
));

// Serialization
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Error Handling (catch all)
process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

mongodb.initDb((e) => {
    if (e) {
      // error logging
      console.log(e);
    } else {
      app.listen(port, () => {
        console.log(`Listening on port ${port}`);
      });
    }
});