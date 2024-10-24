const router = require('express').Router();
const decksController = require('../controllers/decks.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/', decksController.getDecks);
router.get('/:deckId', decksController.getDeck);
router.post('/', decksController.createDeck);
router.put('/:deckId', decksController.modifyDeck);
router.delete('/:deckId', decksController.removeDeck);

module.exports = router;