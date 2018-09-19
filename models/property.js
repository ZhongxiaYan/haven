const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const User = require('./user');

const propertySchema = mongoose.Schema({
    bedrooms: Int32,
    bathrooms: Int32,
    size: Number,
    address_first_line: String,
    address_second_line: String,
    city: String,
    state: String,
    zip_code: String,
    contact_number: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
