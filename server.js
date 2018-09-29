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
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
auth.setup(app);
app.use(express.static(path.join(__dirname, 'client/dist')));

app.use('/', routes);

const port = process.env.PORT || 5555;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
