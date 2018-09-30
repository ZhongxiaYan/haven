const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
  agent: Boolean,
  agentInfo: {
    requestInfo: [String],
    requestDetails: String
  },
  status: String,
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
