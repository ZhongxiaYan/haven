const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  title: String,
  review: String,
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
