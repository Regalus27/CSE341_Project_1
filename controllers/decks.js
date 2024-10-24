const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const dbName = process.env.DB_NAME;
const deckCollection = process.env.COLLECTION_NAME_DECKS;

// Imported functions
const { fooExists, isString, isValidId } = require('../utility/utility.js');

function formatDeck(deckName, cardList) {
    const cards = [];
    cardList.forEach((card) => {
        cards.push({
            cardId: card.cardId,
            quantity: card.quantity
        });
    });
    return {
        name: deckName,
        cards: cards
    };
}

function validateDeck(deck) {
    /**
     * Deck Format:
     * <auto> deckId, pre-validated isValidId()
     * name (string)
     * cards []
     *      foreach validateId, quantity
     */

    if (!isString(deck.name)) {
        return false;
    }

    // Card Validation
    if (deck.cards.length > 500) {
        return false;
    }

    // It took me way too long to realize that return was just interrupting the forEach loop
    var validationResult = true;
    deck.cards.forEach((card) => {
        if (!isValidId(card.cardId)) {
            validationResult = false;
        }

        if (!Number.isInteger(card.quantity)) {
            validationResult = false;
        }
        else {
            // No zero or negative quantities
            if (card.quantity <= 0) {
                validationResult = false;
            }
        }
    });
    if (!validationResult) {
        return false;
    }
    return true;
}

const getDecks = async(req, res) => {
    const result = mongodb
        .getDatabase()
        .db(dbName)
        .collection(deckCollection)
        .find();

    result.toArray().then((actions) => {
        res.setHeader('Constent-Type', 'application/json');
        res.status(200).json(actions);
    });
}

const getDeck = async(req, res) => {
    const deckId = req.params.deckId;
    if (!isValidId(deckId)) {
        res.status(400).json('Invalid id');
    }

    if (!(await fooExists(deckId, deckCollection))) {
        res.status(404).json('No decks found with id: ' + deckId);
    }
    else {
        const result = mongodb
            .getDatabase()
            .db(dbName)
            .collection(deckCollection)
            .find({'_id': new ObjectId(deckId)});

        result.toArray().then((result) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        });
    }
}

const createDeck = async(req, res) => {
    // Format deck for validator and trim excess info.
    const deck = formatDeck(
        req.body.name,
        req.body.cards
    );
    // Validate deck info
    if (!validateDeck(deck)) {
        // It would be nice if the validator gave more granular fail information.
        res.status(400).json('Cannot create new Deck: Invalid Object.');
    }
    else {
        // Create deck and send request
        const response = await mongodb
            .getDatabase()
            .db(dbName)
            .collection(deckCollection)
            .insertOne(deck);
        if (response.acknowledged) {
            res.status(204).send();
        }
        res.status(500).json(response.error || 'Unexpected error occurred while adding Deck.');
    }
}

const modifyDeck = async(req, res) => {
    const deckId = req.params.deckId;
    
    // Validate Id
    if (!isValidId(deckId)) {
        res.status(400).json('Invalid id');
    }

    // Verify Deck Exists
    if (!(await fooExists(deckId, deckCollection))) {
        res.status(404).json('No decks found with id: ' + deckId);
    }

    // Format deck for validator and trim excess info.
    const deck = formatDeck(
        req.body.name,
        req.body.cards
    );
    // Validate deck info
    if (!validateDeck(deck)) {
        // It would be nice if the validator gave more granular fail information.
        res.status(400).json('Cannot create new Deck: Invalid Object.');
    }
    else {
        // Modify Deck
        const response = await mongodb
            .getDatabase()
            .db(dbName)
            .collection(deckCollection)
            .replaceOne({ _id: new ObjectId(deckId) }, deck);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        }

        res.status(500).json(response.error || 'Unexpected error occurred while updating the Deck.');
    }
}

const removeDeck = async(req, res) => {
    // Validate deck id
    const deckId = req.params.deckId;
    if (!isValidId(deckId)) {
        res.status(400).json('Invalid id');
    }

    // Verify Deck Exists
    if (!(await fooExists(deckId, deckCollection))) {
        res.status(404).json('No decks found with id: ' + deckId);
    }

    // Remove Deck
    const response = await mongodb
        .getDatabase()
        .db(dbName)
        .collection(deckCollection)
        .deleteOne({ _id: new ObjectId(deckId) });

    if (response.deletedCount > 0) {
        res.status(204).send();
    }
    res.status(500).json(response.error || 'Unexpected error occurred while removing the Deck.');
}

module.exports = {
    createDeck,
    getDeck,
    getDecks,
    modifyDeck,
    removeDeck
}