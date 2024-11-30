
const mongoose = require('mongoose');
const activitySchma = mongoose.Schema;

const activity = new activitySchma({
    sender: String,
    time: String,
    receiver: String,
    activity: String,
});