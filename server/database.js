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

function insertNewUser(userInfo) {
    return new Promise((resolve, reject) => {
        let query = {email: userInfo.email};
        users.updateOne(query, {$setOnInsert: userInfo}, {upsert: true}, (err, ret) => {
            if (err) {
                throw err;
            } else if (!ret.result.upserted) {
                console.log(`Found existing email ${query.email}`);
                reject();
            } else {
                console.log(`Registered new user with info ${JSON.stringify(userInfo, null, 2)}`)
                resolve();
            }
        });
    });

}


module.exports = {insertNewUser};