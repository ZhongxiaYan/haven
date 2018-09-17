const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');

const port = process.env.PORT || 5555;

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

const app = express();
app.use(express.static(path.join(__dirname, '../client/dist')));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

