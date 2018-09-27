const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

require('./database').setup();
const routes = require('./routes');
const auth = require('./auth');

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
auth.setup(app);
app.use(express.static(path.join(__dirname, 'client/dist')));

app.use('/', routes);

const port = process.env.PORT || 5555;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
