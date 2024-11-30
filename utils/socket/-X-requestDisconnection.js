
// const userModel = require('../../models/Users');
// const joinedUsers = require('../../models/joinedUsers');

// //  requestDisconnetion
// await socket.on('requestDisconnetion', async (message) => {

//     let _sender = await joinedUsers.findOne({username: connectedUserName});
    
//     if (message.route === one) {
        
//         if (_sender.routeOne && _sender.connectedUserRouteOne !== x) {

//             let _receiver = await joinedUsers.findOne({username: _sender.connectedUserRouteOne});

//             if (_receiver.connectedUserRouteOne === connectedUserName) {

//                 disconnect([_sender.id, _receiver.id], _sender.username, _sender.id, x,
//                     _receiver.username, _receiver.id, x);

//             } else if (_receiver.connectedUserRouteTwo === connectedUserName) {
                
//                 send(_receiver.id, 'sender', {
//                     header: header,
//                     sender: _sender.username,
//                     receiverID: _receiver.id,
//                     receiverRouteType: one,
//                     receiver: _receiver.username,
//                     senderID: _sender.id,
//                     senderRouteType: x
//                 });

//             } else if (_receiver.connectedUserRouteThree === connectedUserName) {

//                 disconnect([_sender.id, _receiver.id], _sender.username, _sender.id, x,
//                     _receiver.username, _receiver.id, two);
                
//             }
//         }
    
//     } else if (message.route === two) {
        
//         if (_sender.routeTwo && _sender.connectedUserRouteTwo !== x) {
            
//             let _receiver = await joinedUsers.findOne({username: _sender.connectedUserRouteTwo});

//             if (_receiver.connectedUserRouteOne === connectedUserName) {

//                 send(_sender.id, 'receiver', {
//                     header: header,
//                     sender: _sender.username,
//                     receiverID: _receiver.id,
//                     receiverRouteType: x
//                 });
            
//             } else if (_receiver.connectedUserRouteTwo === connectedUserName) {
                
//                 disconnect([_sender.id, _receiver.id], _sender.username, _sender.id, one,
//                     _receiver.username, _receiver.id, one);
                
//             } else if (_receiver.connectedUserRouteThree === connectedUserName) {

//                 disconnect([_sender.id, _receiver.id], _sender.username, _sender.id, one,
//                     _receiver.username, _receiver.id, two);
                
//             }
//         } 

//     } else if (message.route === three) {

//         if (_sender.routeThree && _sender.connectedUserRouteThree !== x) {

//             let _receiver = await joinedUsers.findOne({username: _sender.connectedUserRouteThree});

//             if (_receiver.connectedUserRouteOne === connectedUserName) {

//                 disconnect([_sender.id, _receiver.id], _sender.username, _sender.id, two,
//                     _receiver.username, _receiver.id, x);

//             } else if (_receiver.connectedUserRouteTwo === connectedUserName) {

//                 disconnect([_sender.id, _receiver.id], _sender.username, _sender.id, two,
//                     _receiver.username, _receiver.id, one);
                
//             } else if (_receiver.connectedUserRouteThree === connectedUserName) {

//                 disconnect([_sender.id, _receiver.id], _sender.username, _sender.id, two,
//                     _receiver.username, _receiver.id, two);
                
//             }
//         }

//     }

// });
