const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');

const propertySchema = mongoose.Schema({
    numBedrooms: Int32,
    numBathrooms: Int32,
    size: Number,
    addressFirstLine: String,
    addressSecondLine: String,
    city: String,
    state: String,
    zipCode: String,
    contactNumber: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
