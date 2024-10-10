const router = require('express').Router();

router.use('/', require('./swagger.js'));

router.get('/', (req, res) => {
    res.send('Home Page');
});

router.use('/deck', require('./deck.js'));

module.exports = router;