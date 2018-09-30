const routes = require('express').Router();

const database = require('./database');
const { ErrorStatus, RequestStatus, ApplicationStatus } = require('./enums');

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
  Request.find({ requester: req.user.id, property: req.body.property, status: RequestStatus.PENDING }, (err, doc) => {
    if (err) throw err;
    if (doc.length > 0) {
      res.json({ success: false, status: ErrorStatus.ALREADY_EXISTS });
    } else {
      let request = new Request(Object.assign({ requester: req.user.id, status: RequestStatus.PENDING }, req.body));
      request.save((err, updatedRequest) => {
        if (err) {
          console.log('Fail');
          res.json({ success: false, status: ErrorStatus.SAVE_FAILED });
        } else {
          console.log('Success');
          res.json({ success: true });
        }
      });
    }
  });
});

routes.post('/apply_property', (req, res) => {
  console.log('Applying', req.body, 'for user', req.user.email);
  Application.find({ applicant: req.user.id, property: req.body.property, status: ApplicationStatus.PENDING }, (err, doc) => {
    if (err) throw err;
    if (doc.length > 0) {
      res.json({ success: false, status: ErrorStatus.ALREADY_EXISTS });
    } else {
      let application = new Application(Object.assign({ applicant: req.user._id, status: ApplicationStatus.PENDING }, req.body));
      application.save((err, updatedApplication) => {
        if (err) {
          console.log('Fail');
          res.json({ success: false, status: ErrorStatus.SAVE_FAILED });
        } else {
          console.log('Success');
          res.json({ success: true });
        }
      });
    }
  });
});

routes.get('/request_list', (req, res) => {
  console.log('Queried request list', req.user, req.query);
  Request.find(Object.assign({ requester: req.user._id, status: RequestStatus.PENDING }, req.query)).populate('property').exec((err, requests) => {
    if (err) throw err;
    res.json(requests);
  });
});

routes.get('/application_list', (req, res) => {
  console.log('Queried application list', req.user, req.query);
  Application.find(Object.assign({ applicant: req.user._id, status: ApplicationStatus.PENDING }, req.query)).populate('property').exec((err, applications) => {
    if (err) throw err;
    res.json(applications);
  })
});

routes.post('/cancel_request', (req, res) => {
  console.log('Cancel request for', req.user);
  Request.findOneAndUpdate(
    { _id: req.body.requestId, status: RequestStatus.PENDING },
    { $set: { status: RequestStatus.CANCELLED } },
    { new: true },
    (err, doc) => {
      if (err) throw err;
      if (doc) {
        res.json({ success: true });
      } else {
        res.json({ success: false, status: ErrorStatus.DOES_NOT_EXIST });
      }
    }
  );
});

routes.post('/cancel_application', (req, res) => {
  console.log('Cancel application for', req.user);
  Application.findOneAndUpdate(
    { _id: req.body.applicationId, status: ApplicationStatus.PENDING },
    { $set: { status: ApplicationStatus.CANCELLED } },
    { new: true },
    (err, doc) => {
      if (err) throw err;
      if (doc) {
        res.json({ success: true });
      } else {
        res.json({ success: false, status: ErrorStatus.DOES_NOT_EXIST });
      }
    }
  );
});

module.exports = { routes };
