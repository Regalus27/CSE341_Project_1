const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const dbName = process.env.DB_NAME;
const userCollection = process.env.COLLECTION_NAME_USERS;

// Imported functions
const { fooExists, isString, isValidId } = require('../utility/utility.js');

function formatUser(userName, deckList) {
    const decks = [];
    deckList.forEach((deck) => {
        decks.push({
            deckId: deck.deckId
        });
    });
    return {
        name: userName,
        decks: decks
    };
}

function validateUser(user) {
    /**
     * User Format:
     * <auto> userId, pre-validated isValidId()
     * name (string)
     * decks []
     *      foreach validateId
     */

    if (!isString(user.name)) {
        return false;
    }

    // Deck Validation
    if (user.decks.length > 500) {
        return false;
    }

    // It took me way too long to realize that return was just interrupting the forEach loop
    var validationResult = true;
    user.decks.forEach((deck) => {
        if (!isValidId(deck.deckId)) {
            validationResult = false;
        }
    });
    if (!validationResult) {
        return false;
    }
    return true;
}

const getUsers = async(req, res) => {
    const result = mongodb
        .getDatabase()
        .db(dbName)
        .collection(userCollection)
        .find();

    result.toArray().then((actions) => {
        res.setHeader('Constent-Type', 'application/json');
        res.status(200).json(actions);
    });
}

const getUser = async(req, res) => {
    const userId = req.params.userId;
    if (!isValidId(userId)) {
        res.status(400).json('Invalid id');
    }

    if (!(await fooExists(userId, userCollection))) {
        res.status(404).json('No users found with id: ' + userId);
    }
    else {
        const result = mongodb
            .getDatabase()
            .db(dbName)
            .collection(userCollection)
            .find({'_id': new ObjectId(userId)});

        result.toArray().then((result) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        });
    }
}

const createUser = async(req, res) => {
    // Format user for validator and trim excess info.
    const user = formatUser(
        req.body.name,
        req.body.decks
    );
    // Validate user info
    if (!validateUser(user)) {
        // It would be nice if the validator gave more granular fail information.
        res.status(400).json('Cannot create new User: Invalid Object.');
    }
    else {
        // Create user and send request
        const response = await mongodb
            .getDatabase()
            .db(dbName)
            .collection(userCollection)
            .insertOne(user);
        if (response.acknowledged) {
            res.status(204).send();
        }
        res.status(500).json(response.error || 'Unexpected error occurred while adding User.');
    }
}

const modifyUser = async(req, res) => {
    const userId = req.params.userId;
    
    // Validate Id
    if (!isValidId(userId)) {
        res.status(400).json('Invalid id');
    }

    // Verify User Exists
    if (!(await fooExists(userId, userCollection))) {
        res.status(404).json('No users found with id: ' + userId);
    }

    // Format user for validator and trim excess info.
    const user = formatUser(
        req.body.name,
        req.body.decks
    );
    // Validate User info
    if (!validateUser(user)) {
        // It would be nice if the validator gave more granular fail information.
        res.status(400).json('Cannot create new User: Invalid Object.');
    }
    else {
        // Modify User
        const response = await mongodb
            .getDatabase()
            .db(dbName)
            .collection(userCollection)
            .replaceOne({ _id: new ObjectId(userId) }, user);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        }

        res.status(500).json(response.error || 'Unexpected error occurred while updating the User.');
    }
}

const removeUser = async(req, res) => {
    // Validate User id
    const userId = req.params.userId;
    if (!isValidId(userId)) {
        res.status(400).json('Invalid id');
    }

    // Verify User Exists
    if (!(await fooExists(userId, userCollection))) {
        res.status(404).json('No users found with id: ' + userId);
    }

    // Remove User
    const response = await mongodb
        .getDatabase()
        .db(dbName)
        .collection(userCollection)
        .deleteOne({ _id: new ObjectId(userId) });

    if (response.deletedCount > 0) {
        res.status(204).send();
    }
    res.status(500).json(response.error || 'Unexpected error occurred while removing the User.');
}

module.exports = {
    getUser,
    getUsers,
    createUser,
    modifyUser,
    removeUser
}