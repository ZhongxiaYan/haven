const routes = require('express').Router();

const Property = require('./models/property');

routes.get('/property_list', (req, res) => {
    Property.find().exec().then(properties => {
        res.json(properties.slice(0, 3));
    });
});

module.exports = { routes };
