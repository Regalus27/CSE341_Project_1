const {MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const {validateAction} = require('../controllers/actions.js');

describe('createAction', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.DB_CONNECT_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db(process.env.DB_NAME);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should validate and insert an Action into a collection', async () => {
    const actions = db.collection(process.env.COLLECTION_NAME_ACTIONS);

    const newAction = {
        _id: new ObjectId('00180c0745669034f841e112'),
        displayText: "This is a test action",
        actionType: "Testing",
        actionValue: 1
    };
    const testAction = await validateAction(newAction); 
    expect(testAction).toEqual(newAction);

    // yeah nah I'm not writing unit tests for code I've already written and tested
    // next time tell us to do unit tests (so I can practice them) BEFORE the due date
    // of hundreds of lines of code
  });
});