const routes = require('express').Router();
const path = require('path');

const auth = require('./auth');
const owner = require('./owner');
const tenant = require('./tenant');

routes.use('/auth', auth.routes);
routes.use('/owner', auth.checkLogin, owner.routes);
routes.use('/tenant', auth.checkLogin, tenant.routes);

routes.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
});

module.exports = routes;
