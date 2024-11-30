
const joinedUsers = require('../../models/joinedUsers');

const x = 'unset';
const one = 'first';
const two = 'second';
const three = 'third';
const header = 'disconnect';

const disconnect = async (socketIO, socket) => {

    let _sender = await joinedUsers.findOneAndDelete({id: socket.id}); 
        
        if (_sender) {
            if (_sender.routeOne !== x && _sender.connectedUserRouteOne !== x) {
                
                let _receiver1 = await joinedUsers.findOne({phone_no: _sender.connectedUserRouteOne});

                if (_receiver1) {

                    if (_receiver1.connectedUserRouteOne === _sender.phone_no) {
        
                        disconnect([_sender.id, _receiver1.id], _sender.username, _sender.id, x,
                            _receiver1.username, _receiver1.id, x);
        
                        await joinedUsers.findOneAndUpdate({id: _receiver1.id},
                            {routeOne: x, connectedUserRouteOne: x},
                            {new: true});
        
                        send(_receiver1.id, 'stopQuery', {
                            route: one,
                            name: _sender.username,
                            value: false
                        });
                
                    } else if (_receiver1.connectedUserRouteTwo === _sender.phone_no) {
                            
                        disconnect([_sender.id, _receiver1.id], _sender.username, _sender.id, x,
                            _receiver1.username, _receiver1.id, one);
        
                        await joinedUsers.findOneAndUpdate({id: _receiver1.id},
                            {routeTwo: x, connectedUserRouteTwo: x},
                            {new: true});
        
                        send(_receiver1.id, 'stopQuery', {
                            route: two,
                            value: false
                        });
                
                    } else if (_receiver1.connectedUserRouteThree === _sender.phone_no) {
        
                        disconnect([_sender.id, _receiver1.id], _sender.username, _sender.id, x,
                            _receiver1.username, _receiver1.id, two);
         
                        await joinedUsers.findOneAndUpdate({id: _receiver1.id},
                            {routeThree: x, connectedUserRouteThree: x},
                            {new: true});
        
                        send(_receiver1.id, 'stopQuery', {
                            route: three,
                            value: false
                        });
            
                    } 

                }
                    
            } 
    
            if (_sender.routeTwo !== x && _sender.connectedUserRouteTwo !== x) {
    
                let _receiver2 = await joinedUsers.findOne({phone_no: _sender.connectedUserRouteTwo});

                if (_receiver2) {

                    if (_receiver2.connectedUserRouteOne === _sender.phone_no) {
                            
                        disconnect([_sender.id, _receiver2.id], _sender.username, _sender.id, one,
                            _receiver2.username, _receiver2.id, x);
        
                        await joinedUsers.findOneAndUpdate({id: _receiver2.id},
                            {routeOne: x, connectedUserRouteOne: x},
                            {new: true}); 
                            
                        send(_receiver2.id, 'stopQuery', {
                            route: one,
                            value: false
                        });
                                            
                    } else if (_receiver2.connectedUserRouteTwo === _sender.phone_no) {
                        disconnect([_sender.id, _receiver2.id], _sender.username, _sender.id, one,
                            _receiver2.username, _receiver2.id, one);
        
                        await joinedUsers.findOneAndUpdate({id: _receiver2.id},
                            {routeTwo: x, connectedUserRouteTwo: x},
                            {new: true});
        
                        send(_receiver2.id, 'stopQuery', {
                            route: two,
                            value: false
                        });
                
                    } else if (_receiver2.connectedUserRouteThree === _sender.phone_no) {
        
                        disconnect([_sender.id, _receiver2.id], _sender.username, _sender.id, one,
                            _receiver2.username, _receiver2.id, two);
                        
                        await joinedUsers.findOneAndUpdate({id: _receiver2.id},
                            {routeThree: x, connectedUserRouteThree: x},
                            {new: true});
        
                        send(_receiver2.id, 'stopQuery', {
                            route: three,
                            value: false
                        });
        
                    }

                }
    
                
            if (_sender.routeThree !== x && _sender.connectedUserRouteThree !== x) {
    
                let _receiver3 = await joinedUsers.findOne({phone_no: _sender.connectedUserRouteThree});

                if (_receiver3) {

                    if (_receiver3.connectedUserRouteOne === _sender.phone_no) {
        
                        disconnect([_sender.id, _receiver3.id], _sender.username, _sender.id, two,
                            _receiver3.username, _receiver3.id, x);
        
                        await joinedUsers.findOneAndUpdate({id: _receiver3.id},
                            {routeOne: x, connectedUserRouteOne: x},
                            {new: true});
        
                        send(_receiver3.id, 'stopQuery', {
                            route: one,
                            value: false
                        });
        
                    } else if (_receiver3.connectedUserRouteTwo === _sender.phone_no) {
        
                        disconnect([_sender.id, _receiver3.id], _sender.username, _sender.id, two,
                            _receiver3.username, _receiver3.id, one);
        
                        await joinedUsers.findOneAndUpdate({id: _receiver3.id},
                            {routeTwo: x, connectedUserRouteTwo: x},
                            {new: true});
        
                        send(_receiver3.id, 'stopQuery', {
                            route: two,
                            value: false
                        });
                        
                    } else if (_receiver3.connectedUserRouteThree === _sender.phone_no) {
        
                        disconnect([_sender.id, _receiver3.id], _sender.username, _sender.id, two,
                            _receiver3.username, _receiver3.id, two);
        
                        await joinedUsers.findOneAndUpdate({id: _receiver3.id},
                            {routeThree: x, connectedUserRouteThree: x},
                            {new: true});
        
                        send(_receiver3.id, 'stopQuery', {
                            route: three,
                            value: false
                        });
        
                    }

                }
    
            }
    
        }

        }

    function disconnect([_senderId, _receiverId], sender, senderId, senderRouteType,
        receiver, receiverId, receiverRouteType) {
                            
        send([_senderId, _receiverId], 'sender', {
            header: header,
            sender: sender,
            receiverID: receiverId,
            receiverRouteType: receiverRouteType
        });
    
        send([_senderId, _receiverId], 'receiver', {
            header: header,
            receiver: receiver,
            senderID: senderId,
            senderRouteType: senderRouteType
        });
        send(_receiverId, 'userDisconnect', {name: sender});
    
    }

    function send(id, event, msg) { 
        socketIO.sockets.to(id).emit(event, msg);
    }

}

module.exports.processDisconnectedUser = disconnect;
