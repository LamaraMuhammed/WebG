
const joinedUsers = require('../../models/joinedUsers');

const x = 'unset';
const y = 'set';
const one = 'first';
const two = 'second';
const three = 'third';

const processReceiverConfirmation = async (socketIO, msg, res) => {
    
    //  Checking the sender which route is blocked so that to follow another route
    if (msg) {
        const verifySenderRoute = await joinedUsers.findOne({phone_no: msg.senderNo}),
        senderId = verifySenderRoute.id;
        
        //  Checking the receiver route which one is blocked to follow another
        const verifyReceiverRoute = await joinedUsers.findOne({phone_no: msg.receiverNo}),
        receiverId = verifyReceiverRoute.id;
    
        if (msg.senderNo !== verifyReceiverRoute.connectedUserRouteOne && msg.senderNo !== verifyReceiverRoute.connectedUserRouteTwo
            && msg.senderNo !== verifyReceiverRoute.connectedUserRouteThree) {
                if (res) {
                            
                    if (msg.senderRouteType === x) {
                        
                        if (verifySenderRoute.routeOne !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: senderId},
                                {routeOne: y, connectedUserRouteOne: msg.receiverNo},
                                {new: true}
                            );
            
                            send(receiverId, 'receiver', {
                                mode: msg.mode,
                                receiver: msg.receiver,
                                receiverNo: msg.receiverNo,
                                senderID: senderId,
                                senderRouteType: msg.senderRouteType
                            }); 
            
                            send(senderId, 'stopQuery', {
                                route: one,
                                value: true
                            });
            
                        } else if (verifySenderRoute.routeTwo !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: senderId},
                                {routeTwo: y, connectedUserRouteTwo: msg.receiverNo},
                                {new: true}
                            );
            
                            send(receiverId, 'receiver', {
                                mode: msg.mode,
                                receiver: msg.receiver,
                                receiverNo: msg.receiverNo,
                                senderID: senderId,
                                senderRouteType: one
                            }); 
            
                            send(senderId, 'stopQuery', {
                                route: two,
                                value: true
                            });
            
                        } else if (verifySenderRoute.routeThree !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: senderId},
                                {routeThree: y, connectedUserRouteThree: msg.receiverNo},
                                {new: true}
                            );
            
                            send(receiverId, 'receiver', {
                                mode: msg.mode,
                                receiver: msg.receiver,
                                receiverNo: msg.receiverNo,
                                senderID: senderId,
                                senderRouteType: two
                            }); 
            
                            send(senderId, 'stopQuery', {
                                route: three,
                                value: true
                            });
            
                        } else {
            
                            send(receiverId, 'warning', 'Timeout');
            
                        }
            
                    } else if (msg.senderRouteType === one) {
            
                        if (verifySenderRoute.routeOne !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: senderId},
                                {routeOne: y, connectedUserRouteOne: msg.receiverNo},
                                {new: true}
                            );
            
                            send(receiverId, 'receiver', {
                                mode: msg.mode,
                                receiver: msg.receiver,
                                receiverNo: msg.receiverNo,
                                senderID: senderId,
                                senderRouteType: x
                            }); 
            
                            send(senderId, 'stopQuery', {
                                route: one,
                                value: true
                            });
            
                        } else if (verifySenderRoute.routeTwo !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: senderId},
                                {routeTwo: y, connectedUserRouteTwo: msg.receiverNo},
                                {new: true}
                            );
            
                            send(receiverId, 'receiver', {
                                mode: msg.mode,
                                receiver: msg.receiver,
                                receiverNo: msg.receiverNo,
                                senderID: senderId,
                                senderRouteType: msg.senderRouteType
                            }); 
            
                            send(senderId, 'stopQuery', {
                                route: two,
                                value: true
                            });
            
                        } else if (verifySenderRoute.routeThree !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: senderId},
                                {routeThree: y, connectedUserRouteThree: msg.receiverNo},
                                {new: true}
                            );
            
                            send(receiverId, 'receiver', {
                                mode: msg.mode,
                                receiver: msg.receiver,
                                receiverNo: msg.receiverNo,
                                senderID: senderId,
                                senderRouteType: two
                            }); 
            
                            send(senderId, 'stopQuery', {
                                route: three,
                                value: true
                            });
            
                        } else {
            
                            send(receiverId, 'warning', 'Timeout');
            
                        }
            
                    } else if (msg.senderRouteType === two) {
            
                        if (verifySenderRoute.routeOne !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: senderId},
                                {routeOne: y, connectedUserRouteOne: msg.receiverNo},
                                {new: true}
                            );
            
                            send(receiverId, 'receiver', {
                                mode: msg.mode,
                                receiver: msg.receiver,
                                receiverNo: msg.receiverNo,
                                senderID: senderId,
                                senderRouteType: x
                            }); 
            
                            send(senderId, 'stopQuery', {
                                route: one,
                                value: true
                            });
            
                        } else if (verifySenderRoute.routeTwo !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: senderId},
                                {routeTwo: y, connectedUserRouteTwo: msg.receiverNo},
                                {new: true}
                            );
            
                            send(receiverId, 'receiver', {
                                mode: msg.mode,
                                receiver: msg.receiver,
                                receiverNo: msg.receiverNo,
                                senderID: senderId,
                                senderRouteType: one
                            }); 
            
                            send(senderId, 'stopQuery', {
                                route: two,
                                value: true
                            });
            
                        } else if (verifySenderRoute.routeThree !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: senderId},
                                {routeThree: y, connectedUserRouteThree: msg.receiverNo},
                                {new: true}
                            );
            
                            send(receiverId, 'receiver', {
                                mode: msg.mode,
                                receiver: msg.receiver,
                                receiverNo: msg.receiverNo,
                                senderID: senderId,
                                senderRouteType: msg.senderRouteType
                            }); 
            
                            send(senderId, 'stopQuery', {
                                route: three,
                                value: true
                            });
            
                        } else {
            
                            send(receiverId, 'warning', 'Timeout');
            
                        }
            
                    }
            
                    //  Checking the receiver route that, which one is blocked to follow another
                    if (msg.receiverRouteType === x) {
            
                        if (verifyReceiverRoute.routeOne !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: receiverId},
                                {routeOne: y, connectedUserRouteOne: msg.senderNo},
                                {new: true}
                            );
            
                            send(senderId, 'sender', {
                                mode: msg.mode,
                                sender: msg.sender,
                                senderNo: msg.senderNo,
                                receiverID: receiverId,
                                receiverRouteType: msg.receiverRouteType
                            });
            
                            send(receiverId, 'stopQuery', {
                                route: one,
                                value: true
                            });
            
                        } else if (verifyReceiverRoute.routeTwo !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: receiverId},
                                {routeTwo: y, connectedUserRouteTwo: msg.senderNo},
                                {new: true}
                            );
            
                            send(senderId, 'sender', {
                                mode: msg.mode,
                                sender: msg.sender,
                                senderNo: msg.senderNo,
                                receiverID: receiverId,
                                receiverRouteType: one
                            });
            
                            send(receiverId, 'stopQuery', {
                                route: two,
                                value: true
                            });
            
                        } else if (verifyReceiverRoute.routeThree !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: receiverId},
                                {routeOne: y, connectedUserRouteOne: msg.senderNo},
                                {new: true}
                            );
            
                            send(senderId, 'sender', {
                                mode: msg.mode,
                                sender: msg.sender,
                                senderNo: msg.senderNo,
                                receiverID: receiverId,
                                receiverRouteType: two
                            });
            
                            send(receiverId, 'stopQuery', {
                                route: three,
                                value: true
                            });
            
                        }
            
                    } else if (msg.receiverRouteType === one) {
            
                        if (verifyReceiverRoute.routeOne !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: receiverId},
                                {routeOne: y, connectedUserRouteOne: msg.senderNo},
                                {new: true}
                            );
            
                            send(senderId, 'sender', {
                                mode: msg.mode,
                                sender: msg.sender,
                                senderNo: msg.senderNo,
                                receiverID: receiverId,
                                receiverRouteType: x
                            });
            
                            send(receiverId, 'stopQuery', {
                                route: one,
                                value: true
                            });
            
                        } else if (verifyReceiverRoute.routeTwo !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: receiverId},
                                {routeTwo: y, connectedUserRouteTwo: msg.senderNo},
                                {new: true}
                            );
            
                            send(senderId, 'sender', {
                                mode: msg.mode,
                                sender: msg.sender,
                                senderNo: msg.senderNo,
                                receiverID: receiverId,
                                receiverRouteType: msg.receiverRouteType
                            });
            
                            send(receiverId, 'stopQuery', {
                                route: two,
                                value: true
                            });
            
                        } else if (verifyReceiverRoute.routeThree !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: receiverId},
                                {routeThree: y, connectedUserRouteThree: msg.senderNo},
                                {new: true}
                            );
            
                            send(senderId, 'sender', {
                                mode: msg.mode,
                                sender: msg.sender,
                                senderNo: msg.senderNo,
                                receiverID: receiverId,
                                receiverRouteType: two
                            });
            
                            send(receiverId, 'stopQuery', {
                                route: three,
                                value: true
                            });
            
                        }
            
                    } else if (msg.receiverRouteType === two) {
            
                        if (verifyReceiverRoute.routeOne !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: receiverId},
                                {routeOne: y, connectedUserRouteOne: msg.senderNo},
                                {new: true}
                            );
            
                            send(senderId, 'sender', {
                                mode: msg.mode,
                                sender: msg.sender,
                                senderNo: msg.senderNo,
                                receiverID: receiverId,
                                receiverRouteType: x
                            });
            
                            send(receiverId, 'stopQuery', {
                                route: one,
                                value: true
                            });
            
                        } else if (verifyReceiverRoute.routeTwo !== y) {
            
                            await joinedUsers.findOneAndUpdate(
                                {id: receiverId},
                                {routeTwo: y, connectedUserRouteTwo: msg.senderNo},
                                {new: true}
                            );
            
                            send(senderId, 'sender', {
                                mode: msg.mode,
                                sender: msg.sender,
                                senderNo: msg.senderNo,
                                receiverID: receiverId,
                                receiverRouteType: one
                            });
            
                            send(receiverId, 'stopQuery', {
                                route: two,
                                value: true
                            });
            
                        } else if (verifyReceiverRoute.routeThree !== y) {
                            
                            await joinedUsers.findOneAndUpdate(
                                {id: receiverId},
                                {routeThree: y, connectedUserRouteThree: msg.senderNo},
                                {new: true}
                            );
            
                            send(senderId, 'sender', {
                                mode: msg.mode,
                                sender: msg.sender,
                                senderNo: msg.senderNo,
                                receiverID: receiverId,
                                receiverRouteType: two
                            });
            
                            send(receiverId, 'stopQuery', {
                                route: three,
                                value: true
                            });
            
                        }
            
                    } 
            
                    send(senderId, 'requester', {
                        request: false,
                        remainder: msg.receiverNo
                    });
            
                    send(receiverId, 'requested', {
                        request: false,
                        remainder: msg.senderNo
                    });
                    
                } else {
            
                    send(senderId, 'requester', {
                        request: false,
                        remainder: msg.receiverNo
                    });
            
                    send(receiverId, 'requested', {
                        request: false,
                        remainder: msg.senderNo
                    });
            
                    send(senderId, 'warning', { decline: msg.receiverNo });
            
                }
            
                function send(id, event, msg) { 
                    socketIO.sockets.to(id).emit(event, msg);
                }
    
            } 
            
    }

}


module.exports.__processReceiverConfirmation = processReceiverConfirmation;
