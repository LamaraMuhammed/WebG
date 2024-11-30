
const userModel = require('../../models/Account');
const joinedUsers = require('../../models/joinedUsers');

var x = 'unset';
var one = 'first';
var two = 'second';
const __processMessage = async (socketIO, socket, phoneNumber, message, id) => {
    var isThRequestedNumberRegistered, sender, receiver;
    try{
        isThRequestedNumberRegistered = await userModel.findOne({phone_no: message.value});
    } catch(err) {
        socket.emit('warning', "Something went wrong try again");
    }
    
    if (isThRequestedNumberRegistered) {
        try{
            sender = await joinedUsers.findOne({phone_no: phoneNumber});
            receiver = await joinedUsers.findOne({phone_no: message.value});
            
        } catch(err) {
            socket.emit('warning', "Something went wrong try again");
        }

        if (receiver.online) {
                if (message.value !== sender.phone_no) {
                    if (sender.routeOne === x) {
                        if (receiver.routeOne === x) {
                            if (sender.phone_no != receiver.connectedUserRouteOne &&
                                sender.phone_no != receiver.connectedUserRouteTwo &&
                                sender.phone_no != receiver.connectedUserRouteThree) {

                                    send(receiver.id, 'request', {
                                        mode: message.mode,
                                        sender: sender.username,
                                        senderNo: sender.phone_no,
                                        senderRouteType: x,
                                        receiver: receiver.username,
                                        receiverNo: receiver.phone_no,
                                        receiverRouteType: x
                                    });
                        
                                }
    
                        } else if (receiver.routeTwo === x) {
                            if (sender.phone_no != receiver.connectedUserRouteOne &&
                                sender.phone_no != receiver.connectedUserRouteTwo &&
                                sender.phone_no != receiver.connectedUserRouteThree) {
    
                                    send(receiver.id, 'request', {
                                        mode: message.mode,
                                        sender: sender.username,
                                        senderNo: sender.phone_no,
                                        senderRouteType: x,
                                        receiver: receiver.username,
                                        receiverNo: receiver.phone_no,
                                        receiverRouteType: one
                                    });
                    
                            } else {
                                socket.emit('warning', `You're connected`);
                            }
    
                        } else if (receiver.routeThree === x) {
                            if (sender.username != receiver.connectedUserRouteOne &&
                                sender.username != receiver.connectedUserRouteTwo &&
                                sender.username != receiver.connectedUserRouteThree) {
    
                                    send(receiver.id, 'request', {
                                        mode: message.mode,
                                        sender: sender.username,
                                        senderNo: sender.phone_no,
                                        senderRouteType: x,
                                        receiver: receiver.username,
                                        receiverNo: receiver.phone_no,
                                        receiverRouteType: two
                                    });

                            } else {
                                socket.emit('warning', `You're connected`);
                            }
    
                        } else {
                            socket.emit('warning', `${ message.value } is busy right now!...`);
                        }

                        send(sender.id, 'requester', {
                            request: true,
                            remainder: message.value
                        });

                        send(receiver.id, 'requested', {
                            request: true,
                            remainder: sender.phone_no
                        });
    
                    } else if (sender.routeTwo === x && sender.connectedUserRouteTwo === x) {
                        if (receiver.routeOne === x && receiver.connectedUserRouteOne === x) {
                            if (sender.phone_no != receiver.connectedUserRouteOne &&
                                sender.phone_no != receiver.connectedUserRouteTwo &&
                                sender.phone_no != receiver.connectedUserRouteThree) {

                                    send(receiver.id, 'request', {
                                        mode: message.mode,
                                        sender: sender.username,
                                        senderNo: sender.phone_no,
                                        senderRouteType: one,
                                        receiver: receiver.username,
                                        receiverNo: receiver.phone_no,
                                        receiverRouteType: x
                                    });
                                }
                        } else if (receiver.routeTwo === x) {
                            if (sender.phone_no != receiver.connectedUserRouteOne &&
                                sender.phone_no != receiver.connectedUserRouteTwo &&
                                sender.phone_no != receiver.connectedUserRouteThree) {
    
                                    send(receiver.id, 'request', {
                                        mode: message.mode,
                                        sender: sender.username,
                                        senderNo: sender.phone_no,
                                        senderRouteType: one,
                                        receiver: receiver.username,
                                        receiverNo: receiver.phone_no,
                                        receiverRouteType: one
                                    });
                    
                            } else {
                                socket.emit('warning', `You're connected`);
                            }
    
                        } else if (receiver.routeThree === x) {
                            if (sender.phone_no != receiver.connectedUserRouteOne &&
                                sender.phone_no != receiver.connectedUserRouteTwo &&
                                sender.phone_no != receiver.connectedUserRouteThree) {
    
                                    send(receiver.id, 'request', {
                                        mode: message.mode,
                                        sender: sender.username,
                                        senderNo: sender.phone_no,
                                        senderRouteType: one,
                                        receiver: receiver.username,
                                        receiverNo: receiver.phone_no,
                                        receiverRouteType: two
                                    });

                            } else {
                                socket.emit('warning', `You're connected`);
                            }
    
                        } else {
                            socket.emit('warning', `${ message.value } is busy right now!...`);
                        }
                        
                        send(sender.id, 'requester', {
                            request: true,
                            remainder: message.value
                        });

                        send(receiver.id, 'requested', {
                            request: true,
                            remainder: sender.phone_no
                        });
    
                    } else if (sender.routeThree === x && sender.connectedUserRouteThree === x) {
                        if (receiver.routeOne === x && receiver.connectedUserRouteOne === x) {
                            if (sender.phone_no != receiver.connectedUserRouteOne &&
                                sender.phone_no != receiver.connectedUserRouteTwo &&
                                sender.phone_no != receiver.connectedUserRouteThree) {

                                    send(receiver.id, 'request', {
                                        mode: message.mode,
                                        sender: sender.username,
                                        senderNo: sender.phone_no,
                                        senderRouteType: two,
                                        receiver: receiver.username,
                                        receiverNo: receiver.phone_no,
                                        receiverRouteType: x
                                    });
                        
                                }
    
                        } else if (receiver.routeTwo === x) {
                            if (sender.phone_no != receiver.connectedUserRouteOne &&
                                sender.phone_no != receiver.connectedUserRouteTwo &&
                                sender.phone_no != receiver.connectedUserRouteThree) {
    
                                    send(receiver.id, 'request', {
                                        mode: message.mode,
                                        sender: sender.username,
                                        senderNo: sender.phone_no,
                                        senderRouteType: two,
                                        receiver: receiver.username,
                                        receiverNo: receiver.phone_no,
                                        receiverRouteType: one
                                    });
                    
                            } else {
                                socket.emit('warning', `You're connected`);
                            }
    
                        } else if (receiver.routeThree === x) {
                            if (sender.phone_no != receiver.connectedUserRouteOne &&
                                sender.phone_no != receiver.connectedUserRouteTwo &&
                                sender.phone_no != receiver.connectedUserRouteThree) {
    
                                    send(receiver.id, 'request', {
                                        mode: message.mode,
                                        sender: sender.username,
                                        senderNo: sender.phone_no,
                                        senderRouteType: two,
                                        receiver: receiver.username,
                                        receiverNo: receiver.phone_no,
                                        receiverRouteType: two
                                    });
                    
                            } else {
                                socket.emit('warning', `You're connected`);
                            }
    
                        } else {
                            socket.emit('warning', `${ message.value } is busy right now!...`);
                        }
                        
                        send(sender.id, 'requester', {
                            request: true,
                            remainder: message.value
                        });

                        send(receiver.id, 'requested', {
                            request: true,
                            remainder: sender.phone_no
                        });
    
                    }

                } else {
                    socket.emit('warning', "This is your phone number, try someone's else.");
                }

            } else {
                socket.emit('warning', `The phone number is offline`);
            }
            
    } else {
        socket.emit('warning', `The phone number is not registered!`);
    }

    function send(id, event, msg) { 
        socketIO.sockets.to(id).emit(event, msg);
        event === "request" ? socket.emit("requester", { wait: message.value }) : false;
    }
    
}

module.exports.__processMessage = __processMessage;
