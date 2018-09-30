const routes = require('express').Router();

const Property = require('./models/property');

function maskAttributes(property) {
  let { _id, address, numBedrooms, numBathrooms, rent, openHouse, video, photos } = property;
  let { neighborhood, locality, administrativeAreaLevel1, postalCode } = address;
  let formattedAddress = `${neighborhood}, ${locality}, ${administrativeAreaLevel1} ${postalCode}`;
  return { _id, formattedAddress, numBedrooms, numBathrooms, rent, openHouse, video, photos };
}

routes.get('/property_list', (req, res) => {
  console.log('Queried property list with param', req.query);
  let { neighborhood, numBedrooms, numBathrooms, maxRent } = req.query;
  let findQuery = {};
  if (neighborhood) {
    console.log('found', neighborhood)
    findQuery['$or'] = [
      { 'address.neighborhood': { $regex: '^' + neighborhood + '$', '$options': 'i' } },
      { 'address.locality': { $regex: '^' + neighborhood + '$', '$options': 'i' } },
      { 'address.administrativeAreaLevel2': { $regex: '^' + neighborhood + '$', '$options': 'i' } },
      { 'address.administrativeAreaLevel1': { $regex: '^' + neighborhood + '$', '$options': 'i' } },
      { 'address.postalCode': { $regex: '^' + neighborhood + '$', '$options': 'i' } }
    ];
  }
  if (numBedrooms) {
    findQuery['numBedrooms'] = numBedrooms
  }
  if (numBathrooms) {
    findQuery['numBathrooms'] = numBathrooms
  }
  if (maxRent) {
    findQuery['rent'] = { $lte: maxRent };
  }
  Property.find(findQuery).exec().then(properties => {
    let mapLocation = null;
    let mapBounds = null;
    if (properties.length > 0) {
      let locs = properties.map(prop => prop.location);
      mapLocation = {
        lat: locs.map(loc => loc.lat).reduce((a, b) => a + b, 0) / locs.length,
        lng: locs.map(loc => loc.lng).reduce((a, b) => a + b, 0) / locs.length
      }
      mapBounds = {
        east: Math.max(...locs.map(loc => loc.lng)),
        north: Math.max(...locs.map(loc => loc.lat)),
        west: Math.min(...locs.map(loc => loc.lng)),
        south: Math.min(...locs.map(loc => loc.lat))
      }
    }
    if (!req.user) {
      properties = properties.map(maskAttributes);
    }
    res.json({ properties, mapLocation, mapBounds });
  });
});


module.exports = { routes };
