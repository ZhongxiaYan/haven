const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
  status: String,
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
