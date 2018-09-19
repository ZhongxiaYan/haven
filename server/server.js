const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config()

const db = require('./database');
const auth = require('./auth');

const port = process.env.PORT || 5555;

const app = express();
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

auth.setup(app);

app.post('/api/sign_up', (req, res) => {
    let userInfo = req.body;
    db.insertNewUser(userInfo).then(() => {
        res.json({success: true});
    }).catch(() => {
        res.json({success: false});
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

