const mongoose = require('mongoose');
const schema = mongoose.Schema;


const joineduserSchema = new schema({
    id: {
        type: String
    },
    username: {
        type: String
    },
    phone_no: {
        type: String
    },
    inTime: {
        type: String
    },
    outTime: {
        type: String
    },
    routeOne: {
        type: String,
    }, 
    connectedUserRouteOne: {
        type: String,
    },
    routeTwo: {
        type: String,
    }, 
    connectedUserRouteTwo: {
        type: String,
    },
    routeThree: {
        type: String,
    }, 
    connectedUserRouteThree: {
        type: String,
    },
    myPreference: [{ type: Array}],
    online: { type: Boolean }
});

module.exports = mongoose.model('joinedUsers', joineduserSchema);
