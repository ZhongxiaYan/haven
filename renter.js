const routes = require('express').Router();

const Property = require('./models/property');
const Request = require('./models/request');
const Application = require('./models/application');

routes.get('/property/:propertyId', (req, res) => {
  Property.findById(req.params.propertyId).exec().then(property => {
    res.json(property);
  });
});

routes.post('/request_property', (req, res) => {
  console.log('Adding request', req.body, 'for user', req.user.email);
  let request = new Request(Object.assign({ requester: req.user.id }, req.body));
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

routes.post('/apply_property', (req, res) => {
  console.log('Applying', req.body, 'for user', req.user.email);
  let application = new Application(Object.assign({ applicant: req.user._id, status: 'pending' }, req.body)); // TODO move status into an enum
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

routes.get('/request_list', (req, res) => {
  console.log('Queried request list', req.user);
  Request.aggregate([
    { $match: { requester: req.user._id } },
    {
      $lookup: {
        from: 'properties',
        localField: 'property',
        foreignField: '_id',
        as: 'property'
      } // TODO project the fields into something smaller
    }
  ]).exec().then(requests => {
    res.json(requests);
  });
});

routes.get('/application_list', (req, res) => {
  console.log('Queried application list', req.user);
  Application.aggregate([
    { $match: { applicant: req.user._id } },
    {
      $lookup: {
        from: 'properties',
        localField: 'property',
        foreignField: '_id',
        as: 'property'
      } // TODO project the fields into something smaller
    }
  ]).exec().then(applications => {
    res.json(applications);
  });
});

module.exports = { routes };
