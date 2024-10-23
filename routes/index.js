const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger.js'));

// Logged In Check
router.get('/', (req, res) => {
    // If user isn't undefined, display that the user is Logged In
    // Else, display Logged Out
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}`: 'Logged Out');
});
  
// GitHub Login
router.get('/github/callback', passport.authenticate('github', {
    // Failed Login Redirect
    failureRedirect: '/api-docs', session: false
}),
// Successful Login
(req, res) => {
    req.session.user = req.user;
    res.redirect('/');
}
);

// GitHub Login + Logout Routes
router.get('/login', passport.authenticate('github'), (req, res) => {});
router.get('/logout', (req, res, next) => {
    req.session = null;
    req.logout((err) => {
        if (err) {
            return next(err);
        }
    });
    res.redirect('/');
});

// Other Routes
//router.use('/users', require('./users.js'));
//router.use('/decks', require('./decks.js'));
router.use('/cards', require('./cards.js'));
router.use('/actions', require('./actions.js'));

module.exports = router;