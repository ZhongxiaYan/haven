const MongoClient = require('mongodb').MongoClient;

let users = null;
MongoClient.connect('mongodb://localhost:27017/db', { useNewUrlParser: true }, (err, db) => {
    if (err) {
        throw err;
    }
    const databaseName = 'yc';
    let database = db.db(databaseName);
    console.log(`Created database ${databaseName}`);
    users = database.collection('users');
});

function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        let query = { email: email };
        users.findOne(query, (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
}

function tryInsertUserByEmail(email, passwordHash) {
    return new Promise((resolve, reject) => {
        let query = { email: email };
        let insert = {
            id: email,
            email: email,
            passwordHash: passwordHash
        };
        users.updateOne(query, { $setOnInsert: insert }, { upsert: true }, (err, ret) => {
            if (err) {
                reject(err);
            } else {
                resolve(ret.result.upserted);
            }
        });
    });
}

function queryUserAccessToken(accessToken) {
    return new Promise((resolve, reject) => {
        let query = { accessToken: accessToken };
        users.findOne(query, (err, userInfo) => {
            if (err) {
                reject(err);
            } else {
                console.log(`Found user with info ${JSON.stringify(userInfo, null, 2)}`)
                resolve(userInfo);
            }
        });
    });
}


module.exports = { findUserByEmail, tryInsertUserByEmail, queryUserAccessToken };