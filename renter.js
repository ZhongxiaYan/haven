const routes = require('express').Router();

const Property = require('./models/property');
const Request = require('./models/request');
const Application = require('./models/application');

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

routes.post('/request_property', (req, res) => {
    console.log('Adding request', req.body, 'for user', req.user.email);
    let request = new Request(Object.assign({}, req.body, { requester: req.user.id }));
    request.save((err, updatedRequest) => {
        if (err) {
            console.log('Fail');
            res.json({ success: false });
        } else {
            console.log('Success');
            res.json({ success: true });
        }
    });
});

routes.get('/request_list', (req, res) => {
    console.log('Queried request list');
    Request.find({ requester: req.user.id }).exec().then(requests => {
        res.json(requests);
    });
});

routes.post('/submit_application', (req, res) => {
    console.log('Submitting application', req.body, 'for user', req.user.email);
    let application = new Application(Object.assign({}, req.body, { applicant: req.user.id }));
    application.save((err, updatedApplication) => {
        if (err) {
            console.log('Fail');
            res.json({ success: false });
        } else {
            console.log('Success');
            res.json({ success: true });
        }
    });
});

module.exports = { routes };
