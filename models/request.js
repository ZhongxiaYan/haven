const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
  url: String,
  requestInfo: [String],
  requestDetails: String,
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
