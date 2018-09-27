const routes = require('express').Router();

const location = require('./location');
const Property = require('./models/property');

routes.post('/new_property', (req, res) => {
  let propertyJson = req.body;
  console.log('Adding property', propertyJson, 'for user', req.user.email);
  let formattedAddr = location.formatAddress(propertyJson.address);
  location.lookUpAddress(formattedAddr).then(resJson => {
    let { status, results } = resJson;
    if (status !== 'OK' || results.length !== 1) {
      console.error(`Failed to look up address ${formattedAddr}`, status, results);
      return res.json({ success: false });
    }
    let googleAttributes = location.parseAddressResult(results[0]);
    let propertyValues = Object.assign({
      owner: req.user.id
    }, propertyJson, googleAttributes);
    let property = new Property(propertyValues);
    property.save((err, updatedProperty) => {
      if (err) {
        console.error('Fail', err, propertyValues);
        res.json({ success: false });
      } else {
        console.log('Success');
        res.json({ success: true });
      }
    });
  })
});

routes.get('/property_list', (req, res) => {
  Property.find({ owner: req.user.id }).exec().then(properties => {
    res.json(properties);
  });
})

module.exports = { routes };
