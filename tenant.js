const routes = require('express').Router();

const Property = require('./models/property');

routes.get('/property_list', (req, res) => {
    console.log('Queried property list');
    Property.find().exec().then(properties => {
        res.json(properties);
    });
});

routes.get('/property/:propertyId', (req, res) => {
    Property.findById(req.params.propertyId).exec().then(property => {
        res.json(property);
    });
});

module.exports = { routes };
