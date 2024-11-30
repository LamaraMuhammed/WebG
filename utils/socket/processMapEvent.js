const joinedUsers = require('../../models/joinedUsers');

async function processMapEvent(socketIO, phoneNumber, event, msg) {
    var sender, receiver;
    try{
        sender = await joinedUsers.findOne({phone_no: phoneNumber});
    } catch (err) {
        return;
    }
    if (sender) {
        if (msg.route === 'first') {
            if (sender.connectedUserRouteOne !== 'unset') {
                try{
                    receiver = await joinedUsers.findOne({phone_no: sender.connectedUserRouteOne});
                } catch(err) {
                    return false;
                }
                if (receiver) send(receiver.id, event, msg);
            }
    
        } else if (msg.route === 'second') {
            if (sender.connectedUserRouteTwo !== 'unset') {
                try{
                    receiver = await joinedUsers.findOne({phone_no: sender.connectedUserRouteTwo});
                } catch(err) {
                    return false;
                }
                if (receiver) send(receiver.id, event, msg);
            }
            
        } else if (msg.route === 'third') {
            if (sender.connectedUserRouteThree !== 'unset') {
                try{
                    receiver = await joinedUsers.findOne({phone_no: sender.connectedUserRouteThree});
                } catch(err) {
                    return false;
                }
                if (receiver) send(receiver.id, event, msg);
            }
            
        } else {
            if (msg.route === 'All') {
                var receiver1, receiver2, receiver3;
                try{
                    receiver1 = await joinedUsers.findOne({phone_no: sender.connectedUserRouteOne});
                    receiver2 = await joinedUsers.findOne({phone_no: sender.connectedUserRouteTwo});
                    receiver3 = await joinedUsers.findOne({phone_no: sender.connectedUserRouteThree});

                } catch (err) {
                    return;
                }
                if (receiver1 && receiver2 && receiver3) {
                    send([receiver1.id, receiver2.id, receiver3.id], event, msg);
                    
                } else if (!receiver1 && receiver2 && receiver3) {
                    send([receiver2.id, receiver3.id], event, msg);

                } else if (!receiver2 && receiver1 && receiver3 ) {
                    send([receiver1.id, receiver3.id], event, msg);

                } else if (!receiver3 && receiver1 && receiver2) {
                    send([receiver1.id, receiver2.id], event, msg);

                }
                
            }

        }

    }

    function send(id, event, msg) { 
        socketIO.sockets.to(id).emit(event, msg);
    }
    
}

module.exports.processMapEvent = processMapEvent;
    