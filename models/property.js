const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');

const propertySchema = mongoose.Schema({
    title: String,
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
    location: {
        lat: Number,
        lng: Number
    },
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
