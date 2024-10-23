const router = require('express').Router();
const decksController = require('../controllers/decks.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

/**
 * REQUEST  PATH              PRIVACY         PURPOSE
 * GET      /                 Public          View list of user's decks.
 * GET      /:deckId          Public          View cards in deck.
 * POST     /                 User            Create a new deck.
 * POST     /:deckId          User            Add card to deck.
 * PUT      /:deckId/:cardId  User            Modify the number of a specific card in a deck. (Example: 4 copies of strike => 1 copy of strike)
 * DELETE   /:deckId/:cardId  User            Remove card from deck.
 */
/*
router.get('/', decksController.getDecks);
router.get('/:deckId', decksController.getDeck);
router.post('/', decksController.createDeck);
router.put('/:deckId', decksController.modifyDeck);
router.delete('/:deckId', decksController.deleteDeck);
*/
module.exports = router;