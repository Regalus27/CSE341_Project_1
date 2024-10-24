const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const dbName = process.env.DB_NAME;
const actionCollection = process.env.COLLECTION_NAME_ACTIONS;

const { fooExists, isString, isValidId } = require('../utility/utility.js');

function validateAction(action) {
    /**Action Format
     * <auto> actionId ObjectId - already validated via isValidId()
     * displayText string
     * actionType string
     * actionValue int
     * 
     * action{
     *      action.displayText      : string
     *      action.actionType       : string
     *      action.actionValue      : integer
     * }
     */

    // display text validation
    if (!isString(action.displayText)) {
        return false;
    }

    // action type validation
    // in the future, compare to enum or something, for now just check if string
    if (!isString(action.actionType)) {
        return false;
    }

    // action value (how much damage, how much block, value of action)
    if (!Number.isInteger(action.actionValue)) {
        return false;
    }

    return true;
}

// Get a list of all actions
const getActions = async(req, res) => {
    const result = mongodb
        .getDatabase()
        .db(dbName)
        .collection(actionCollection)
        .find();

    result.toArray().then((actions) => {
        res.setHeader('Constent-Type', 'application/json');
        res.status(200).json(actions);
    });
}

// Get details of a single action
const getAction = async(req, res) => {
    const actionId = req.params.actionId;
    // Validate ID
    if (!isValidId(actionId)) {
        res.status(400).json('Invalid actionId');
    }

    // Ensure Action Exists
    if (!(await fooExists(actionId, actionCollection))) {
        res.status(404).json('No actions found with id: ' + actionId);
    }
    else {
        // Action exists, feels like this double call could be avoided but
        //      need to keep moving.
        const result = mongodb
            .getDatabase()
            .db(dbName)
            .collection(actionCollection)
            .find({'_id': new ObjectId(actionId)});

        result.toArray().then((result) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        });
    }
}

const createAction = async(req, res) => {
    const action = {
        displayText: req.body.displayText,
        actionType: req.body.actionType,
        actionValue: req.body.actionValue
    };

    // Validation (Should probably be elsewhere but too bad)
    if (!validateAction(action)) {
        // Invalid action
        res.status(400).json('Cannot create new Action: Invalid Action Object.');
    }
    else {
        // Create Action
        const response = await mongodb
            .getDatabase()
            .db(dbName)
            .collection(actionCollection)
            .insertOne(action);
        if (response.acknowledged) {
            res.status(204).send();
        }
        res.status(500).json(response.error || 'Unexpected error occurred while adding Action.');
    }
}

const modifyAction = async(req, res) => {
    const actionId = req.params.actionId;
    
    // Validate Id
    if (!isValidId(actionId)) {
        res.status(400).json('Invalid actionId');
    }

    // Check Action Exists
    if (!(await fooExists(actionId, actionCollection))) {
        res.status(404).json('No actions found with id: ' + actionId);
    }

    // Validate Action
    const action = {
        displayText: req.body.displayText,
        actionType: req.body.actionType,
        actionValue: req.body.actionValue
    };
    if (!validateAction(action)) {
        // Invalid action
        res.status(400).json('Cannot create new Action: Invalid Action Object.');
    }
    else {
        // Modify Action
        const response = await mongodb
            .getDatabase()
            .db(dbName)
            .collection(actionCollection)
            .replaceOne({ _id: new ObjectId(actionId) }, action);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        }

        res.status(500).json(response.error || 'Unexpected error occurred while updating the Action.');
    }
}

const removeAction = async(req, res) => {
    // Validate action id
    const actionId = req.params.actionId;
    if (!isValidId(actionId)) {
        res.status(400).json('Invalid actionId');
    }

    // Check Action Exists
    if (!(await fooExists(actionId, actionCollection))) {
        res.status(404).json('No actions found with id: ' + actionId);
    }

    // Remove Action
    const response = await mongodb
        .getDatabase()
        .db(dbName)
        .collection(actionCollection)
        .deleteOne({ _id: new ObjectId(actionId) });

    if (response.deletedCount > 0) {
        res.status(204).send();
    }
    res.status(500).json(response.error || 'Unexpected error occurred while removing the Action.');
}

module.exports = {
    createAction,
    getAction,
    getActions,
    modifyAction,
    removeAction
}