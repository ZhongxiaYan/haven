const routes = require('express').Router();
const path = require('path');

const auth = require('./auth');
const owner = require('./owner');
const renter = require('./renter');

routes.use('/auth', auth.routes);
routes.use('/owner', auth.checkLogin, owner.routes);
routes.use('/renter', auth.checkLogin, renter.routes);

routes.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
});

module.exports = routes;
