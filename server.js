const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

require('./database').setup();
const auth = require('./auth');

const port = process.env.PORT || 5555;

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
auth.setup(app);
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

