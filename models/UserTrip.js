const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Trip = new schema ({
    phone_no: String,
    eventDate: String,
    initTime: String,
    endTime: String,
    data: [Object]
});

module.exports = mongoose.model('Trip', Trip);