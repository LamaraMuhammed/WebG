const profilePics = require('../../models/UserPics');

const x = 'unset';
const one = 'first';
const two = 'second';
const header = 'disconnect';


const sendToReceiver = (socketIO, msg) => {
    
    if (msg.receiverRouteType === x) { 
        if (msg.header === header) {
            send(msg.receiverID, 'firstQuery', {
                header: header,
                lat: "",
                lng: ""
            });
            
        } else {
            if (msg.img) {
                send(msg.receiverID, 'firstQueryImg', {imgUrl: msg.img, name: msg.sender});
            }
            send(msg.receiverID, 'firstQuery', {
                loc: msg.senderLoc,
                acc: msg.senderAcc,
                lat: msg.lat,
                lng: msg.lon
            });
            
        }
        
    } else if (msg.receiverRouteType === one) { 
        if (msg.header === header) {
            send(msg.receiverID, 'secondQuery', {
                header: header,
                lat: "",
                lng: ""
            });
            
        } else {
            if (msg.img) {
                send(msg.receiverID, 'secondQueryImg', {imgUrl: msg.img, name: msg.sender});
            }
            send(msg.receiverID, 'secondQuery', {
                loc: msg.senderLoc,
                acc: msg.senderAcc,
                lat: msg.lat,
                lng: msg.lon
            });
            
        }

    } else if (msg.receiverRouteType === two) {
        if (msg.header === header) {
            send(msg.receiverID, 'thirdQuery', {
                header: header,
                lat: "",
                lng: ""
            });
            
        } else {
            if (msg.img) { 
                send(msg.receiverID, 'thirdQueryImg', {imgUrl: msg.img, name: msg.sender});
            }
            send(msg.receiverID, 'thirdQuery', {
                loc: msg.senderLoc,
                acc: msg.senderAcc,
                lat: msg.lat,
                lng: msg.lon
            });
            
        }

    }

    function send(id, event, msg) { 
        socketIO.sockets.to(id).emit(event, msg);
    }

}

module.exports.sendToReceiver = sendToReceiver;
