const mongoose = require('mongoose');

function setup() {
    mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true });
    mongoose.Promise = global.Promise;
    mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
    console.log('Connected to database', process.env.MONGO_DB_URL);

    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
}

module.exports = { setup };
