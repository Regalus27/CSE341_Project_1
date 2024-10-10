const router = require('express').Router();
const validation = require('../middleware/validate.js');
const deckController = require('../controllers/deck.js');

// routes
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
router.post('/:id', validation.cardFormat, deckController.addCard);

/**
 * POST 
 * Add new deck
 */
router.post('/', deckController.addDeck);

/**
 * PUT
 * Modify card in existing deck
 */
router.put('/:deckId/:cardId', validation.cardFormat, deckController.modifyCard);

/**
 * DELETE
 * Delete card from deck
 */
router.delete('/:deckId/:cardId', deckController.removeCard);

/**
 * DELETE
 * Delete deck
 * Cutting to save time, because I would need to also delete all cards with the same id
 */


module.exports = router;