// npm install mongodb
const { MongoClient } = require('mongodb');

async function dbConnection(dbUrl, param_json, dbName) {
    // function that connect to database and disconnect
    // param_json is json data type expecting session id(required) as its key
    // and takes new question(optional) as another key

    const { sessionID, newQuestion } = param_json;
    const uri = dbUrl;
    const client = new MongoClient(uri);
    console.log(sessionID, newQuestion);

    try {
        await client.connect();

        // uncomment this if need createSession for testing other functions
        // await createSession(client, dbName, {
        //     _id: sessionID,
        //     "questions": []
        // });
        if (newQuestion) {
            await updateSessionById(client, dbName, sessionID, {
                "questions": newQuestion
            });
        }
        const allQuestions = await findOneSession(client, dbName, sessionID);
        return allQuestions;
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}

async function createSession(client, dbName, newSession) {
    // creating a new session only to test the read and update data in database
    // this function is not needed, and can be deleted
    const result = await client.db(dbName).collection("session")
        .insertOne(newSession);
    console.log(`new session created with id ${result.insertId}`);
}

async function findOneSession(client, dbName, sessionID) {
    // find a session with given id
    const result = await client.db(dbName).collection("session").findOne({
        _id: sessionID
    });

    return result.questions;
}

async function updateSessionById(client, dbName, sessionID, newQuestion) {
    // update a session with given id
    // by pushing newQuestion in the question property(array)
    console.log(`In update, session ID ${sessionID}, ${newQuestion.senderId}`);
    const result = await client.db(dbName).collection("session")
        .updateOne({_id: sessionID}, {$push: newQuestion});
    console.log(`updated the sessions ${result}`);
}



module.exports = dbConnection;