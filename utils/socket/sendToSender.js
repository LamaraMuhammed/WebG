
const x = 'unset';
const one = 'first';
const two = 'second';
const header = 'disconnect';

const sendToSender = (socketIO, msg) => {

    if (msg.senderRouteType === x) {
        
        if (msg.header === header) {
            
            send(msg.senderID, 'firstQuery', {
                header: header,
                lat: "",
                lng: ""
            });
            
        } else {
            if (msg.img) {
                send(msg.senderID, 'firstQueryImg', {imgUrl: msg.img, name: msg.receiver});
            }
            send(msg.senderID, 'firstQuery', {
                loc: msg.receiverLoc,
                acc: msg.receiverAcc,
                lat: msg.lat,
                lng: msg.lon
            });
        }

    } else if (msg.senderRouteType === one) {
        if (msg.header === header) {
            send(msg.senderID, 'secondQuery', {
                header: header,
                lat: "",
                lng: ""
            });
            
        } else {
            if (msg.img) {
                send(msg.senderID, 'secondQueryImg', {imgUrl: msg.img, name: msg.receiver});
            }
            send(msg.senderID, 'secondQuery', {
                loc: msg.receiverLoc,
                acc: msg.receiverAcc,
                lat: msg.lat,
                lng: msg.lon
            });
        }

    } else if (msg.senderRouteType === two) {
        if (msg.header === header) {
            send(msg.senderID, 'thirdQuery', {
                header: header,
                lat: "",
                lng: ""
            });
            
        } else {
            if (msg.img) {
                send(msg.senderID, 'thirdQueryImg', {imgUrl: msg.img, name: msg.receiver});
            }
            send(msg.senderID, 'thirdQuery', {
                loc: msg.receiverLoc,
                acc: msg.receiverAcc,
                lat: msg.lat,
                lng: msg.lon
            });
        }

    }

    function send(id, event, msg) { 
        socketIO.sockets.to(id).emit(event, msg);
    }

}


module.exports.sendToSender = sendToSender;
