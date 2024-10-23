const router = require('express').Router();
const cardsController = require('../controllers/cards.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

/**
 * REQUEST  PATH                PRIVACY         PURPOSE
 * GET      /                   Public          View list of all cards
 * GET      /:cardId            Public          View card details
 * POST     /                   User            Create new card
 * PUT      /:cardId            User            Modify card
 * DELETE   /:cardId            User            Remove card (Dangerous)
*/ 

router.get('/', cardsController.getCards);
router.get('/:cardId', cardsController.getCard);
router.post('/', cardsController.createCard);
router.put('/:cardId', cardsController.modifyCard);
router.delete('/:cardId', cardsController.removeCard);

module.exports = router;