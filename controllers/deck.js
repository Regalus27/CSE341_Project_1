const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const dbName = 'W03_DB';
const cardCollectionName = 'CARDS';
const deckCollectionName = 'DECKS';

// If I end up rewriting this again, pull out the duplicate deck/card exist checks into a function

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
};

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
        // card format
        const card = {
            actions: req.body.actions,      // array of card effects
            valueShop: req.body.valueShop,  // value in shop
            quantity: req.body.quantity,    // # of cards in deck
            cardType: req.body.cardType,    // general category of card
            cost: req.body.cost,            // cost to play the card
            border: req.body.border,        // cosmetic
            deckId: req.body.deckId         // deck this card belongs to
        };
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
const modifyCard = async(req, res) => {
    const deckId = req.params.deckId; // Needs to match req.body.deckId
    const cardId = req.params.cardId;
    // Validate deck and card ids
    if (!ObjectId.isValid(deckId) || !ObjectId.isValid(cardId)) {
        res.status(400).json('Deck or Card ID is invalid.');
        // Ideally this should be split into a response for each request
    }
    // Confirm deck and card exist
    // Deck Check
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
    // Card Check
    const cardCount = mongodb
        .getDatabase()
        .db(dbName)
        .collection(cardCollectionName)
        .find({"_id": new ObjectId(cardId)})
        .count();
    if (cardCount == 0) {
        // No decks found
        res.status(404).json('No cards found with id: ' + cardId);
    }
    // card format
    const card = {
        actions: req.body.actions,      // array of card effects
        valueShop: req.body.valueShop,  // value in shop
        quantity: req.body.quantity,    // # of cards in deck
        cardType: req.body.cardType,    // general category of card
        cost: req.body.cost,            // cost to play the card
        border: req.body.border,        // cosmetic
        deckId: req.body.deckId         // deck this card belongs to
    };
    // request to update card
    const response = await mongodb
        .getDatabase()
        .db(dbName)
        .collection(cardCollectionName)
        .replaceOne({ _id: new ObjectId(cardId) }, card);
    if (response.modifiedCount > 0) {
        res.status(204).send(); // 204: Success, no response needed
    }
    else {
        res.status(500).json(response.error || 'Unexpected error occurred while updating the card.');
        // 500: Server Error
    }
};

/**
 * DELETE
 * Delete card from deck
 */
const removeCard = async(req, res) => {
    const deckId = req.params.deckId; // Needs to match req.body.deckId
    const cardId = req.params.cardId;
    // Validate deck and card ids
    if (!ObjectId.isValid(deckId) || !ObjectId.isValid(cardId)) {
        res.status(400).json('Deck or Card ID is invalid.');
        // Ideally this should be split into a response for each request
    }
    // Confirm deck and card exist
    // Deck Check
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
    // Card Check
    const cardCount = mongodb
        .getDatabase()
        .db(dbName)
        .collection(cardCollectionName)
        .find({"_id": new ObjectId(cardId)})
        .count();
    if (cardCount == 0) {
        // No decks found
        res.status(404).json('No cards found with id: ' + cardId);
    }
    // Delete card
    const response = await mongodb
        .getDatabase()
        .db(dbName)
        .collection(deckCollectionName)
        .deleteOne({ _id: new ObjectId(cardId) });
    if (response.deletedCount > 0) {
        res.status(204).send();
    }
    res.status(500).json(response.error || 'Unexpected error occurrsed while removing the card.');
};

module.exports = {
    getAll,
    getDecklist,
    addCard,
    addDeck,
    modifyCard,
    removeCard
};