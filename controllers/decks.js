const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const dbName = process.env.DB_NAME;
const cardCollection = process.env.COLLECTION_NAME_CARDS;
const deckCollection = process.env.CELLECTION_NAME_DECKS;

// Imported functions
const { fooExists, isString, isValidId } = require('../utility/utility.js');

function validateDeck(deck) {
    /**
     * Deck Format:
     * <auto> deckId, pre-validated isValidId()
     * name (string)
     * cards []
     *      foreach validateId
     */
}

module.exports = {}