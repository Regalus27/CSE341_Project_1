const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const dbName = process.env.DB_NAME;
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
    if (card.actions.length > 500) {
        return false;
    }

    var validationResult = true;
    card.actions.forEach((action) => { 
        if (!isValidId(action.actionId)) { 
            validationResult = false;
        }

        if (!Number.isInteger(action.quantity)) {
            validationResult = false;
        }
        else {
            // No zero or negative quantities
            if (action.quantity <= 0) {
                validationResult = false;
            }
        }
    });
    if (!validationResult) {
        return false;
    }
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
    const actions = [];
    req.body.actions.forEach((action) => {
        actions.push({
            actionId: action.actionId,
            quantity: action.quantity
        });
    });
    const card = { // Figure out how to move this to a seperate thing that can be pulled in
        name: req.body.name,
        type: req.body.type,
        energyCost: req.body.energyCost,
        shopValue: req.body.shopValue,
        color: req.body.color,
        actions: actions
    };

    // Validation (Should probably be elsewhere but too bad)
    if (!validateCard(card)) {
        // Invalid card
        res.status(400).json('Cannot create new Card: Invalid Object.');
    }
    else {
        // Create card
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
    const actions = [];
    req.body.actions.forEach((action) => {
        actions.push({
            actionId: action.actionId,
            quantity: action.quantity
        });
    });
    const card = { // Figure out how to move this to a seperate thing that can be pulled in
        name: req.body.name,
        type: req.body.type,
        energyCost: req.body.energyCost,
        shopValue: req.body.shopValue,
        color: req.body.color,
        actions: actions
    };
    if (!validateCard(card)) {
        // Invalid Card
        res.status(400).json('Cannot update Card: Invalid Object.');
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