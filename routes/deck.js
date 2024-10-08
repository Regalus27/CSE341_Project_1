const router = require('express').Router();

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
router.post('/:id', deckController.addCard);

/**
 * POST 
 * Add new deck
 */
router.post('/', deckController.addDeck);

/**
 * PUT
 * Modify card in existing deck
 */
router.put('/:deckId/:cardId', deckController.modifyCard);

/**
 * DELETE
 * Delete card from deck
 */


module.exports = router;