const util = require('./util');
const fetch = require('node-fetch');

function formatAddress(property) {
  let {addressFirstLine, addressSecondLine, city, state, zipCode} = property;
  let streetAddress = addressSecondLine ? `${addressFirstLine} ${addressSecondLine}` : addressFirstLine
  return `${streetAddress}, ${city}, ${state} ${zipCode}`
}

function lookUpAddress(address) {
  const googleGeocodeApiBase = 'https://maps.googleapis.com/maps/api/geocode/json';
  let params = {
    address: address.replace(/\s/g, '+'),
    key: process.env.GOOGLE_SERVER_API_KEY
  };
  let query = `${googleGeocodeApiBase}?${Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&')}`;
  return fetch(query).then(res => res.json());
}

function parseAddressResult(result) {
  let { address_components, formatted_address, geometry } = result;
  let address = {};
  address_components.forEach(({ long_name, short_name, types }) => {
    let camelType = types[0].split('_')
      .map((s, i) => (i === 0) ? s : util.capitalizeFirstLetter(s))
      .join('');
    address[camelType] = long_name;
  });
  let googleAttributes = {
    formattedAddress: formatted_address,
    location: geometry.location,
    address
  };
  return googleAttributes;
}

module.exports = { formatAddress, lookUpAddress, parseAddressResult };
