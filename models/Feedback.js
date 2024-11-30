
const mongoose = require('mongoose');
const { _id } = require('../.env/keys');
const schema = mongoose.Schema;
const DATE = new Date().toLocaleDateString();

const userFeedBack = new schema({
    createdAt: {
        type: String,
        default: DATE
    },
    id: {
        type: Number,
        default: _id
    },
    comments: { 
        type: Object
    },
    viewed: {
        type: Boolean,
        default: false
    }
});

userFeedBack.pre('save', (next) => {
    if (!this.createdAt) {
        this.createdAt = DATE;
    } 
    next();
});

module.exports = mongoose.model('userFeedBack', userFeedBack);