const joinedUsers = require('../../models/joinedUsers');

async function processChatMessages(socketIO, phoneNumber, msg) {
    let sender = await joinedUsers.findOne({phone_no: phoneNumber});
    if (sender) {
        var myIndexRouteInReceiverIndexRoute;
        // let receiver
        if (msg.route === 'first') {
            if (sender.connectedUserRouteOne !== 'unset') {
                let receiver = await joinedUsers.findOne({phone_no: sender.connectedUserRouteOne});

                if (phoneNumber === receiver.connectedUserRouteOne) {
                    myIndexRouteInReceiverIndexRoute = 'first';
                } else if (phoneNumber === receiver.connectedUserRouteTwo) {
                    myIndexRouteInReceiverIndexRoute = 'second';
                } else if (phoneNumber === receiver.connectedUserRouteThree) {
                    myIndexRouteInReceiverIndexRoute = 'third';
                }
                
                send(receiver.id, 'incomingMsg', {route: myIndexRouteInReceiverIndexRoute, name: sender.username, reply: msg.msg});
            }
            
        } else if (msg.route === 'second') {
            if (sender.connectedUserRouteTwo !== 'unset') {
                let receiver = await joinedUsers.findOne({phone_no: sender.connectedUserRouteTwo});
            
                if (phoneNumber === receiver.connectedUserRouteOne) {
                    myIndexRouteInReceiverIndexRoute = 'first';
                } else if (phoneNumber === receiver.connectedUserRouteTwo) {
                    myIndexRouteInReceiverIndexRoute = 'second';
                } else if (phoneNumber === receiver.connectedUserRouteThree) {
                    myIndexRouteInReceiverIndexRoute = 'third';
                }

                send(receiver.id, 'incomingMsg', {route: myIndexRouteInReceiverIndexRoute, name: sender.username, reply: msg.msg});
            }
            
        } else if (msg.route === 'third') {
            if (sender.connectedUserRouteThree !== 'unset') {
                let receiver = await joinedUsers.findOne({phone_no: sender.connectedUserRouteThree});

                if (phoneNumber === receiver.connectedUserRouteOne) {
                    myIndexRouteInReceiverIndexRoute = 'first';
                } else if (phoneNumber === receiver.connectedUserRouteTwo) {
                    myIndexRouteInReceiverIndexRoute = 'second';
                } else if (phoneNumber === receiver.connectedUserRouteThree) {
                    myIndexRouteInReceiverIndexRoute = 'third';
                }

                send(receiver.id, 'incomingMsg', {route: myIndexRouteInReceiverIndexRoute, name: sender.username, reply: msg.msg});
            }
            
        } else {
            if (msg.route === 'All') {
                let receiver1 = await joinedUsers.findOne({phone_no: sender.connectedUserRouteOne});
                let receiver2 = await joinedUsers.findOne({phone_no: sender.connectedUserRouteTwo});
                let receiver3 = await joinedUsers.findOne({phone_no: sender.connectedUserRouteThree});
                if (receiver1 && receiver2 && receiver3) {
                    send([receiver1.id, receiver2.id, receiver3.id], 'incomingMsg', {name: sender.username, reply: msg.msg});
                    
                } else if (!receiver1 && receiver2 && receiver3) {
                    send([receiver2.id, receiver3.id], 'incomingMsg', {name: sender.username, reply: msg.msg});

                } else if (!receiver2 && receiver1 && receiver3 ) {
                    send([receiver1.id, receiver3.id], 'incomingMsg', {name: sender.username, reply: msg.msg}); 

                } else if (!receiver3 && receiver1 && receiver2) {
                    send([receiver1.id, receiver2.id], 'incomingMsg', {name: sender.username, reply: msg.msg});

                }
                
            }

        }

    }

    function send(id, event, msg) { 
        socketIO.sockets.to(id).emit(event, msg);
    }
    
}


module.exports.processChatMessages = processChatMessages;
    