const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const databaseName = process.env.DB_NAME;

// Check if specified collection holds an item w/ a matching id
async function fooExists(fooId, collectionName) {
    const count = await mongodb
        .getDatabase()
        .db(databaseName)
        .collection(collectionName)
        .find({"_id": new ObjectId(fooId)})
        .count();

    if (count == 0) {
        return false;
    }
    else {
        return true;
    }
}

function isString(foo) {
    return (typeof foo == 'string' || foo instanceof String);
}

function isValidId(id) {
    if (ObjectId.isValid(id)) {
        return true;
    }
    return false;
}

module.exports = {
    fooExists,
    isString,
    isValidId
}