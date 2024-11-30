
const moment = require('moment');
const joinedUsers = require('../../models/joinedUsers');

const x = 'unset';
const connectedUser = async (phoneNumber, userName, socket, socketIO) => {
    var existingUser;
    try{
        existingUser = await joinedUsers.findOne({phone_no: phoneNumber});
    } catch(err) {
        send(socket.id, 'warning', "Something went wrong");
    }
    
    if (existingUser) {
        try{
            await joinedUsers.findOneAndUpdate({phone_no: phoneNumber},
                {
                    id: socket.id,
                    username: userName,
                    phone_no: phoneNumber,
                    inTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    outTime: '',
                    routeOne: x,
                    connectedUserRouteOne: x,
                    routeTwo: x,
                    connectedUserRouteTwo: x,
                    routeThree: x,
                    connectedUserRouteThree: x,
                    online: true
                });

        } catch (err) {
            send(socket.id, 'warning', 'Connection failed try again');
        }
            
            if (existingUser.myPreference.length !== 0) {
                existingUser.myPreference.forEach((e, index) => {
                    e !== null && e.length === 4 ? [e.push('sent'),
                    send(socket.id, 'notifie', { notifie: e, index: index }),
                ] : 
                e !== null ? send(socket.id, 'notifie', { notifie: e, index: index }) : '';

                });
                await existingUser.save();
            }

    } else {
        try {
            let newUser = new joinedUsers({
                id: socket.id,
                username: userName,
                phone_no: phoneNumber,
                inTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
                outTime: '',
                routeOne: x,
                connectedUserRouteOne: x,
                routeTwo: x,
                connectedUserRouteTwo: x,
                routeThree: x, 
                connectedUserRouteThree: x,
                online: true
            });
            
            await newUser.save();

        } catch (err) {
            send(socket.id, 'warning', "Something went wrong try to refresh your browser");
        }

    }

    function send(id, event, msg) {  
        socketIO.sockets.to(id).emit(event, msg);
    }

}

module.exports.processConnectedUser = connectedUser;
