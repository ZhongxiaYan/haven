const routes = require('express').Router();
const path = require('path');

const auth = require('./auth');
const preview = require('./preview');
const owner = require('./owner');
const renter = require('./renter');

routes.use('/auth', auth.routes);
routes.use('/preview', preview.routes);
routes.use('/owner', auth.checkLogin, owner.routes);
routes.use('/renter', auth.checkLogin, renter.routes);

routes.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

module.exports = routes;
