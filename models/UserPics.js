const mongoose = require('mongoose');
const schema = mongoose.Schema;

const profilePic = new schema ({
    phone_no: String,
    imgName: String,
    data: Buffer,
    contentType: String,
    time: String
});

module.exports = mongoose.model('profilePic', profilePic);
