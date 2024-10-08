const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const dbName = 'W03_DB';
const cardCollectionName = 'CARDS';
const deckCollectionName = 'DECKS';

/**
 * GET ALL
 * Returns ids of existing decks
 */
const getAll = async(req, res) => {
    const result = mongodb
        .getDatabase()
        .db(dbName)
        .collection(deckCollectionName)
        .find();
    result.toArray().then((decks) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(decks);
    });
};

/**
 * GET (ID)
 * Returns cards from target deck
 */
const getDecklist = async(req, res) => {
    const deckId = req.params.id;
    if (!ObjectId.isValid(deckId)){
        res.status(400).json('Must use a valid deck id to find a decklist.');
    }
    // Check if exists in deck database
    const deckCount = mongodb
        .getDatabase()
        .db(dbName)
        .collection(deckCollectionName)
        .find({"_id": new ObjectId(deckId)})
        .count();
    if (deckCount == 0) {
        // No decks found
        res.status(404).json('No decks found with id: ' + deckId);
    }
    // Deck exists, get card list
    const result = mongodb
        .getDatabase()
        .db(dbName)
        .collection(cardCollectionName)
        .find({"deckId": deckId});

    result.toArray().then((result) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    });
}

/**
 * POST
 * Add card to target deck
 * If deck doesn't exist, create new deck?
 *      I think that would be optimal, but also I am already behind schedule, so I'll skip that
 */
const addCard = async(req, res) => {
    // params: deck id
    const deckId = req.params.id;
    // check deck exists
    const deckCount = mongodb
        .getDatabase()
        .db(dbName)
        .collection(deckCollectionName)
        .find({"_id": new ObjectId(deckId)})
        .count();
    if (deckCount == 0) {
        // No decks found
        res.status(404).json('No decks found with id: ' + deckId);
    }
    else {
        console.log(req.body);
        // card format
        const card = {
            actions: req.body.actions, // array of card effects
            valueShop: req.body.valueShop, // value in shop
            quantity: req.body.quantity, // # of cards in deck
            cardType: req.body.cardType, // general category of card
            cost: req.body.cost, // cost to play the card
            border: req.body.border, // cosmetic
            deckId: req.body.deckId // deck this card belongs to
        }
        const response = await mongodb
            .getDatabase()
            .db(dbName)
            .collection(cardCollectionName)
            .insertOne(card);
        if (response.acknowledged) {
            res.status(204).send();
        }
        res.status(500).json(response.error || 'Unexpected error occurred while adding card.');
    }
};

/**
 * POST
 * Add new deck
 */
const addDeck = async(req, res) => {
    const deck = {
        name: req.body.name
    };
    const response = await mongodb
        .getDatabase()
        .db(dbName)
        .collection(deckCollectionName)
        .insertOne(deck);
    if (response.acknowledged) {
        res.status(204).send();
    }
    res.status(500).json(response.error || 'Unexpected error occurred while adding deck.');
};

/**
 * PUT
 * Modify card in existing deck
 */


/**
 * DELETE
 * Delete card from deck
 */



module.exports = {
    getAll,
    getDecklist,
    addCard,
    addDeck,
    modifyCard,

};