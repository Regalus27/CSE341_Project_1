const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

let database;
const initDb = (callback) => {
  if (database) {
    console.log('Db is already initialized.');
    return callback(null, database);
  }

  MongoClient.connect(process.env.DB_CONNECT_URL)
    .then((client) => {
      database = client;
      callback(null, database);
    })
    .catch((error) => {
      callback(error);
    });
};

const getDatabase = () => {
  if (!database) {
    throw Error('Database is not initialized.');
  }
  return database;
};

module.exports = {
  initDb,
  getDatabase
};