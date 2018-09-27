const routes = require('express').Router();

const Property = require('./models/property');

function maskAttributes(property) {
  let { address, numBedrooms, numBathrooms, rent, openHouse } = property;
  let { neighborhood, locality, administrativeAreaLevel1, postalCode } = address;
  let location = { neighborhood, locality, administrativeAreaLevel1, postalCode };
  return { location, numBedrooms, numBathrooms, rent, openHouse };
}

routes.get('/property_list', (req, res) => {
  Property.find().exec().then(properties => {
    res.json(properties.slice(0, 3).map(maskAttributes));
  });
});

module.exports = { routes };
