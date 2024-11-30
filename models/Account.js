
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    id: {
        type: String,
        required: true
    },
    first_Name: {
        type: String,
        required: true
    },
    last_Name: {
        type: String,
        required: true
    },
    phone_no: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
    },
    gender: {
        type: String,
    },
    state: {
        type: String,
    },
    town: {
        type: String,
    },
    device: {
        type: String,
    },
    status_id: {
        type: String,
    },
    time: String
    
});

module.exports = mongoose.model('UserAccount', userSchema);
