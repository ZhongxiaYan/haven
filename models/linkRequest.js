const mongoose = require('mongoose');

const linkRequestSchema = mongoose.Schema({
  url: String,
  address: {
    subpremise: String,
    streetNumber: String,
    route: String,
    neighborhood: String,
    locality: String,
    administrativeAreaLevel2: String,
    administrativeAreaLevel1: String,
    country: String,
    postalCode: String,
    postalCodeSuffix: String,
  },
  formattedAddress: String,
  openHouse: {
    start: Date,
    end: Date
  },
  requestInfo: [String],
  requestDetails: String,
  status: String,
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('LinkRequest', linkRequestSchema);
