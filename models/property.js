const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');

const propertySchema = mongoose.Schema({
    title: String,
    addressFirstLine: String,
    addressSecondLine: String,
    city: String,
    state: String,
    zipCode: String,
    numBedrooms: Int32,
    numBathrooms: Int32,
    area: Number,
    rent: Number,
    deposit: Number,
    leaseLength: Number,
    description: String,
    openHouse: Date,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
