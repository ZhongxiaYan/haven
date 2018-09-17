const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

let db = require('./database');

const port = process.env.PORT || 5555;

const app = express();
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get(['/', '/new-tenant'], (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.post('/sign_up', (req, res) => {
    let userInfo = req.body;
    db.insertNewUser(userInfo).then(() => {
        res.json({success: true});
    }).catch(() => {
        res.json({success: false});
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

