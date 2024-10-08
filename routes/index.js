const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Home Page');
});

router.use('/deck', require('./deck.js'));

module.exports = router;