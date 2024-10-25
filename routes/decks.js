const router = require('express').Router();
const decksController = require('../controllers/decks.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/', decksController.getDecks);
router.get('/:deckId', decksController.getDeck);
router.post('/', isAuthenticated, decksController.createDeck);
router.put('/:deckId', isAuthenticated, decksController.modifyDeck);
router.delete('/:deckId', isAuthenticated, decksController.removeDeck);

module.exports = router;