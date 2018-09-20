const routes = require('express').Router();

const Property = require('./models/property');

routes.post('/new_property', (req, res) => {
    console.log('Adding property', req.body, 'for user', req.user.email);
    let property = new Property(Object.assign({}, req.body, { owner: req.user.id }));
    property.save((err, updatedProperty) => {
        if (err) {
            console.log('Fail');
            res.json({ success: false });
        } else {
            console.log('Success');
            res.json({ success: true });
        }
    });
});

routes.get('/property_list', (req, res) => {
    Property.find({ owner: req.user.id }).exec().then(properties => {
        res.json(properties);
    });
})

module.exports = { routes };
