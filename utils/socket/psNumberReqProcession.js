
const joinedUsers = require('../../models/joinedUsers');
const userPreference = require('../../models/userPreference');
const userTrip = require('../../models/userTrip');
const { sanitizeMe } = require('../../public/js/regexInputValues');
const { db, eEmitter } = require('../../models/Ps_Number');

const __processPSMessage = async (socketIO, socket, phoneNumber, message, id) => {
    if (message.value) {
        const realPsNo = sanitizeMe(message.value); // Checking the psNo before passing 

        if (realPsNo.status !== "invalid") {
            const myPsNo = new db();   // Checking the Existing psNo in db

            myPsNo.checksExistingPsNo(message.value);
            eEmitter.once("Access-Infor", async (msg) => {
                if (msg.status === true && msg.phone_no) {
                    if (msg.phone_no !== phoneNumber) {
                        var isPermit;
                        try {
                            isPermit = await userPreference.findOne({ phone_no: msg.phone_no });
                        } catch (err) {
                            socket.emit('warning', 'Something went wrong');
                        }
                        if (isPermit) {
                            if (isPermit.closeWatch_1[1] === phoneNumber || isPermit.closeWatch_2[1] === phoneNumber ||
                                isPermit.closeWatch_3[1] === phoneNumber || isPermit.closeWatch_4[1] === phoneNumber) {
                                var remoteUser, isThere;
                                try {
                                    remoteUser = await joinedUsers.findOne({ phone_no: msg.phone_no });
                                    isThere = await userTrip.findOne({ phone_no: msg.phone_no });
                                } catch(err) {
                                    socket.emit('warning', 'Something went wrong');
                                }
                                if (remoteUser.connectedUserRouteOne !== phoneNumber &&
                                    remoteUser.connectedUserRouteTwo !== phoneNumber &&
                                    remoteUser.connectedUserRouteThree !== phoneNumber
                                ) {
                                    if (isThere) {
                                        if (isThere.endTime) {
                                            const data = {
                                                date: isThere.eventDate,
                                                initTime: isThere.initTime,
                                                endTime: isThere.endTime,
                                                phone_no: isThere.phone_no,
                                                data: isThere.data
                                            }
                                            send(id, 'tripRec', data);
    
                                        } else {
                                            const data = {
                                                date: isThere.eventDate,
                                                initTime: isThere.initTime,
                                                endTime: isThere.endTime,
                                                phoneNo: isThere.phone_no,
                                                data: isThere.data
                                            }
                                            remoteUser.online ? send(remoteUser.id, 'psReq', id) : send(id, 'tripRec', data);
                                        }
                                        
                                    } else {
                                        remoteUser.online ? send(remoteUser.id, 'psReq', id) : socket.emit('warning', 'Result not found');
                                    }

                                } else {
                                    socket.emit('warning', "You're connected in ShareLoc");
                                }

                            } else {
                                socket.emit('warning', "Close watch not authorized by the person you're looking up");
                            }

                        } else {
                            socket.emit('warning', 'Result not found');
                        }
                        
                    } else {
                        socket.emit('warning', 'This is your PS Number');
                    }

                } else {
                    socket.emit('warning', 'Invalid PS Number');
                }

            }); 
            
        } else {
            socket.emit('warning', 'Invalid PS Number');
        }
    } else {
        socket.emit('warning', 'Something went wrong');
    }

    function send(id, event, msg) { 
        socketIO.sockets.to(id).emit(event, msg);
    }
    
}

module.exports.__processPSMessage = __processPSMessage;
