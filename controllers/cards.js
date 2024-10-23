const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const dbName = process.env.DB_NAME;
const actionCollection = process.env.COLLECTION_NAME_ACTIONS;
const cardCollection = process.env.COLLECTION_NAME_CARDS;

// Imported functions
const { fooExists, isString, isValidId } = require('../utility/utility.js');

function validateCard(card) {
    /**
     * Card Format:
     * <auto> cardId (ObjectId), validated via isValidId()
     * name (String), isString()
     * type (String)
     * energyCost (Int), Number.isInteger()
     * shopValue (Int)
     * color (String)
     * actions []
     *      forEach, isValidId, fooExists(actionId, actionCollection)
     */

    if (!isString(card.name)) {
        return false;
    }

    if (!isString(card.type)) {
        return false;
    }

    if (!Number.isInteger(card.energyCost)) {
        return false;
    }

    if (!Number.isInteger(card.shopValue)) {
        return false;
    }

    if (!isString(card.color)) {
        return false;
    }

    // Action Validation
    // array of actionIds
    //      check length of array, max length of 20 actions
    //      check that ids are valid
    //      check that actions exist
    if (card.actions.length > 20) {
        return false;
    }

    card.actions.forEach((actionId) => {                // THIS SHOULD BE ACTION DON'T CHANGE IT
        if (!isValidId(actionId)) {                     // THIS SHOULD BE ACTION DON'T CHANGE IT
            return false;
        }

        if (!fooExists(actionId, actionCollection)) {   // THIS SHOULD BE ACTION DON'T CHANGE IT
            return false;
        }
    });

    return true;
}

// Route Actions
// Check controllers/actions.js for comments, nearly identical
//      To the point that there could probably be a generic controller
const getCards = async(req, res) => {
    const result = mongodb
        .getDatabase()
        .db(dbName)
        .collection(cardCollection)
        .find();

    result.toArray().then((actions) => {
        res.setHeader('Constent-Type', 'application/json');
        res.status(200).json(actions);
    });
}

const getCard = async(req, res) => {
    const cardId = req.params.cardId;
    if (!isValidId(cardId)) {
        res.status(400).json('Invalid id');
    }

    if (!(await fooExists(cardId, cardCollection))) {
        res.status(404).json('No cards found with id: ' + cardId);
    }
    else {
        const result = mongodb
            .getDatabase()
            .db(dbName)
            .collection(cardCollection)
            .find({'_id': new ObjectId(cardId)});

        result.toArray().then((result) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        });
    }
}

const createCard = async(req, res) => {
    const card = {
        name: req.body.name,
        type: req.body.type,
        energyCost: req.body.energyCost,
        shopValue: req.body.shopValue,
        color: req.body.color,
        actions: req.body.actions
    };

    // Validation (Should probably be elsewhere but too bad)
    if (!validateCard(card)) {
        // Invalid action
        res.status(400).json('Cannot create new Card: Invalid Object.');
    }
    else {
        // Create Action
        const response = await mongodb
            .getDatabase()
            .db(dbName)
            .collection(cardCollection)
            .insertOne(card);
        if (response.acknowledged) {
            res.status(204).send();
        }
        res.status(500).json(response.error || 'Unexpected error occurred while adding Card.');
    }
}

const modifyCard = async(req, res) => {
    const cardId = req.params.cardId;
    
    // Validate Id
    if (!isValidId(cardId)) {
        res.status(400).json('Invalid id');
    }

    // Check Card Exists
    if (!(await fooExists(cardId, cardCollection))) {
        res.status(404).json('No cards found with id: ' + cardId);
    }

    // Validate Card
    const card = {
        name: req.body.name,
        type: req.body.type,
        energyCost: req.body.energyCost,
        shopValue: req.body.shopValue,
        color: req.body.color,
        actions: req.body.actions
    };
    if (!validateCard(card)) {
        // Invalid Card
        res.status(400).json('Cannot create new Card: Invalid Object.');
    }
    else {
        // Modify Card
        const response = await mongodb
            .getDatabase()
            .db(dbName)
            .collection(cardCollection)
            .replaceOne({ _id: new ObjectId(cardId) }, card);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        }

        res.status(500).json(response.error || 'Unexpected error occurred while updating the Card.');
    }
}

const removeCard = async(req, res) => {
    // Validate card id
    const cardId = req.params.cardId;
    if (!isValidId(cardId)) {
        res.status(400).json('Invalid id');
    }

    // Check Card Exists
    if (!(await fooExists(cardId, cardCollection))) {
        res.status(404).json('No actions found with id: ' + cardId);
    }

    // Remove Card
    const response = await mongodb
        .getDatabase()
        .db(dbName)
        .collection(cardCollection)
        .deleteOne({ _id: new ObjectId(cardId) });

    if (response.deletedCount > 0) {
        res.status(204).send();
    }
    res.status(500).json(response.error || 'Unexpected error occurred while removing the Card.');
}

module.exports = {
    getCards,
    getCard,
    createCard,
    modifyCard,
    removeCard
}