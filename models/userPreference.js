
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userPreference = new schema({
    phone_no: {
        type: String
    },
    closeWatch_1: [{ type: String }],
    closeWatch_2: [{ type: String }],
    closeWatch_3: [{ type: String }],
    closeWatch_4: [{ type: String }],
});

module.exports = mongoose.model('userPreference', userPreference);
