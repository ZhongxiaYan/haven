const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    email: String,
    local: {
        email: String,
        password: String
    },
    facebook: {
        id: String,
        token: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        user: String
    }
});

module.exports = mongoose.model('User', userSchema);
