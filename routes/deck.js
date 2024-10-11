const router = require('express').Router();
const validation = require('../middleware/validate.js');
const deckController = require('../controllers/deck.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

/**
 * GET ALL
 * Returns ids of existing decks
 */
router.get('/', deckController.getAll);

/**
 * GET (ID)
 * Returns cards from target deck
 */
router.get('/:id', deckController.getDecklist);

/**
 * POST
 * Add card to target deck
 */
router.post('/:id', isAuthenticated, validation.cardFormat, deckController.addCard);

/**
 * POST 
 * Add new deck
 */
router.post('/', isAuthenticated, deckController.addDeck);

/**
 * PUT
 * Modify card in existing deck
 */
router.put('/:deckId/:cardId', isAuthenticated, validation.cardFormat, deckController.modifyCard);

/**
 * DELETE
 * Delete card from deck
 */
router.delete('/:deckId/:cardId', isAuthenticated, deckController.removeCard);

/**
 * DELETE
 * Delete deck
 * Cutting to save time, because I would need to also delete all cards that belonged to said deck from the database.
 */
// router.delete('/:deckId', isAuthenticated, deckController.removeDeck);

module.exports = router;