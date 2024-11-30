export const socket = io('ws://localhost:3000');
// export const socket = io('http://192.168.43.93:3000'); 
import { close_shareLoc_popup } from "./request.js";

// Boolean Variables
var focusOnOne = false;

const _date = new Date().toDateString();
const time = new Date().toLocaleTimeString();

// for first frnd 
var firstFrndImgFrame = document.querySelector(".firstFrnd");
var palName1 = document.getElementById("palName1");
var Loc1 = document.getElementById("Loc1");
var distance1 = document.getElementById("dist1");
var Network1 = document.getElementById("Network1");

// for second frnd
var secondFrndImgFrame = document.querySelector(".secondFrnd"); 
var palName2 = document.getElementById("palName2");
var Loc2 = document.getElementById("Loc2");
var distance2 = document.getElementById("dist2");
var Network2 = document.getElementById("Network2");

// For third frnd
var thirdFrndImgFrame = document.querySelector(".thirdFrnd");
var palName3 = document.getElementById("palName3");
var Loc3 = document.getElementById("Loc3");
var distance3 = document.getElementById("dist3");
var Network3 = document.getElementById("Network3");

var senderFirstRoute;
var senderSecondRoute;
var senderThirdRoute;

var receiverFirstRoute;
var receiverSecondRoute;
var receiverThirdRoute;

var firstFrndName, secondFrndName, thirdFrndName;

const x = 'unset';
const gotWrong = "Something went wrong";

socket.on('logging_Okay', (msg) => {
  checkSignedUser(msg);
  mapUserPosPreferece();
});

socket.on('hasRecord', (msg) => {
  globalV.OTS = [];
  if (msg.data) {
    Trip.localKeep(msg);
    Trip.noRecord(false);
    msg.data.forEach(dt => {
      globalV.OTS.push(dt.coords);
    })
    Trip.bbox.push(globalV.OTS[0], globalV.OTS[globalV.OTS.length - 1]);
    globalV.OTS = [];
    
  } else {
    Trip.noRecord(true);
  }
});

// Guest No: 1
socket.on('firstQueryImg', (msg) => {
  if (msg.imgUrl) {
     newGuest('first', msg.imgUrl, msg.name);
     firstFrndName = msg.name;
  }
  
});

var firstGuest;
socket.on('firstQuery', async (msg) => {
  if (msg.lat && msg.lng && !map.options.isIndicators) {
    firstGuest ? clusterMarker.removeLayer(firstGuest) : '';
    try{
      firstGuest = await new L.marker(L.latLng(msg.lat, msg.lng), globalV.defaultFrndToInteract === 'first' ?
      fitBounds._activeUserIcon : fitBounds._guestIcon); //.bindPopup(receiverSidePopUp(image1.src, firstFrndName));
      fitBounds.fitOne(msg.lat, msg.lng);
      clusterMarker.addLayer(firstGuest).addTo(map); 
      
    } catch(err) {
      return false;
    }
    
  }

  fitBounds.setLocOne(Loc1, distance1, Network1, msg);
  firstGuest && map.options.isIndicators && globalV.defaultFrndToInteract === 'first' ?
  clusterMarker.removeLayer(firstGuest) : '';
  // When Disconnection
  msg.header ? guestDisconnected('first') : '';
  
});

// Guest No: 2
socket.on('secondQueryImg', (msg) => {
  if (msg.imgUrl) {
      newGuest('second', msg.imgUrl, msg.name);
      secondFrndName = msg.name;
    }
    
  });
  
var secondGuest;
socket.on('secondQuery', async (msg) => {
  if (msg.lat && msg.lng && !map.options.isIndicators) {
    secondGuest ? clusterMarker.removeLayer(secondGuest) : '';
    try{
      secondGuest = await new L.marker(L.latLng(msg.lat, msg.lng), globalV.defaultFrndToInteract === 'second' ?
      fitBounds._activeUserIcon : fitBounds._guestIcon); //.bindPopup(receiverSidePopUp(image2.src, secondFrndName));
      fitBounds.fitTwo(msg.lat, msg.lng);
      clusterMarker.addLayer(secondGuest).addTo(map);
      
    } catch (err) {
      return false;
    }
    
  }

 fitBounds.setLocTwo(Loc2, distance2, Network2, msg);
  secondGuest && map.options.isIndicators && globalV.defaultFrndToInteract === 'second' ? 
  clusterMarker.removeLayer(secondGuest) : '';
  // When Disconnection
  msg.header ? guestDisconnected('second') : '';

});

// Guest No: 3
socket.on('thirdQueryImg', (msg) => {
  if (msg.imgUrl) {
    newGuest('third', msg.imgUrl, msg.name);
    thirdFrndName = msg.name;
  }
  
});

var thirdGuest;
socket.on('thirdQuery', async (msg) => {
  if (msg.lat && msg.lng && !map.options.isIndicators) {
    thirdGuest !== undefined ? clusterMarker.removeLayer(thirdGuest) : '';
    try{
      thirdGuest = await new L.marker(L.latLng(msg.lat, msg.lng), globalV.defaultFrndToInteract === 'third' ?
      fitBounds._activeUserIcon : fitBounds._guestIcon); //.bindPopup(receiverSidePopUp(image3.src, thirdFrndName));
      fitBounds.fitThree(msg.lat, msg.lng);
      clusterMarker.addLayer(thirdGuest).addTo(map); 
      
    } catch (err) {
      return false;
    }
    
  }
  
  fitBounds.setLocThree(Loc3, distance3, Network3, msg);
  thirdGuest && map.options.isIndicators && globalV.defaultFrndToInteract === 'third' ?
  clusterMarker.removeLayer(thirdGuest) : '';
  // When Disconnection
  msg.header ? guestDisconnected('third') : '';

});

const fitBounds = {
  _guestIcon: {
    icon: guestIcon, autoPan: true, autoPanSpeed: 3,
    autoPanOnFocus: true, autoPanPadding: [200, 400]
  },

  _activeUserIcon: {
    icon: activeUserIcon, autoPan: true, autoPanSpeed: 3,
    autoPanOnFocus: true, autoPanPadding: [200, 400]
  },

  options: {
    animate: true, duration: 2,
    easeLinearity: 0.5,
    padding: [ 25, 25 ],
    maxZoom: map.getZoom()
  },

  fitOne: function(x, y) {
    switch (Book.get(Book._ON)) {
      case 'false':
        globalV.defaultFrndToInteract === 'first' ? 
        map.fitBounds([L.latLng(x, y), L.latLng(x, y)], this.options) : '';
        break;
    
      default:
        globalV.defaultFrndToInteract === 'first' ? globalV.remoteCoords = L.latLng(x, y) : '';
        break;
    }
  },

  setLocOne: function(loc, dist, net, msg) {
    this.localCoords = globalV.localCoords ? globalV.localCoords : null;
    if (msg.loc && msg.acc) {
      loc.innerHTML = msg.loc;
      dist.innerHTML = measures._units(measures.findDistance(this.localCoords, [msg.lat, msg.lng]))
      msg.acc < 10 ? net.innerHTML = `<span style="color: #02fa02;">Good</span` :
      msg.acc > 10 && msg.acc < 15 ? net.innerHTML = `<span style="color: #fae902;">Poor</span` :
      net.innerHTML = `<span style="color: #e30707;">Bad</span`;
    }
  },

  fitTwo: function(x, y) {
    switch (Book.get(Book._ON)) {
      case 'false':
        globalV.defaultFrndToInteract === 'second' ? 
        map.fitBounds([L.latLng(x, y), L.latLng(x, y)], this.options) : '';
        break;
    
      default:
        globalV.defaultFrndToInteract === 'second' ? globalV.remoteCoords = L.latLng(x, y) : '';
        break;
    }
  },

  setLocTwo: function(loc, dist, net, msg) {
    this.localCoords = globalV.localCoords ? globalV.localCoords : null;
    if (msg.loc && msg.acc) {
      loc.innerHTML = msg.loc;
      dist.innerHTML = measures._units(measures.findDistance(this.localCoords, [msg.lat, msg.lng]))
      msg.acc < 10 ? net.innerHTML = `<span style="color: #02fa02;">Good</span` :
      msg.acc > 10 && msg.acc < 15 ? net.innerHTML = `<span style="color: #fae902;">Poor</span` :
      net.innerHTML = `<span style="color: #e30707;">Bad</span`;
    }
  },

  fitThree: function(x, y) {
    switch (Book.get(Book._ON)) {
      case 'false':
        globalV.defaultFrndToInteract === 'third' ? 
        map.fitBounds([L.latLng(x, y), L.latLng(x, y)], this.options) : '';
        break;
    
      default:
        globalV.defaultFrndToInteract === 'third' ? globalV.remoteCoords = L.latLng(x, y) : '';
        break;
    }
  },

  setLocThree: function(loc, dist, net, msg) {
    this.localCoords = globalV.localCoords ? globalV.localCoords : null;
    if (msg.loc && msg.acc) {
      loc.innerHTML = msg.loc;
      dist.innerHTML = measures._units(measures.findDistance(this.localCoords, [msg.lat, msg.lng]))
      msg.acc < 10 ? net.innerHTML = `<span style="color: #02fa02;">Good</span` :
      msg.acc > 10 && msg.acc < 15 ? net.innerHTML = `<span style="color: #fae902;">Poor</span` :
      net.innerHTML = `<span style="color: #e30707;">Bad</span`;
    }
  },

  absoluteFit: function(x, y, z, fitAfter) {
    fitAfter ? map.fitBounds([L.latLng(x), L.latLng(y)], z) : map.fitBounds([L.latLng(x, y), L.latLng(x, y)], z);
  }
}
  
//  Sender Side
//  Sending Data To Receiver

const senderlocstore = ['saye', 'misau', 'sade', 'rimi', 'feggi', 'fada', 'azare', 'yarwa', 'guru', 'kano', 'makka', 'madina'];
var R_road = 10.3086;
var sendToReciever = (route, id, r)=>{
  let loc = senderlocstore[(Math.floor(Math.random() * senderlocstore.length))];
  let senderAcc = Math.floor(Math.random() * 18);
  let lat = Math.random()*(11-10)+10;
  // let lon = Math.random()*(-9+11)+9;
  socket.emit('send-to-receiver', {
    receiverRouteType: route,
    receiverID: id,
    senderLoc: loc,
    senderAcc: senderAcc,
    // senderNetwork: Network,
    lat:  r || `10.303${lat.toString().slice(12)}`,
    lon: 9.832508

    });
}

var sendSenderProfileImage = (route, id, sender, imgUrl) => {
  socket.emit('send-to-receiver', {
    receiverRouteType: route,
    receiverID: id,
    sender: sender,
    img: imgUrl
    });
}

var alternative = (header, route, id, sender) => {

  socket.emit('send-to-receiver', {
    header: header,
    receiverRouteType: route,
    receiverID: id,
    sender: sender

  });

}

//  =================================== Sender ====================================
socket.on('sender', (msg) => {
  if (msg.receiverRouteType === x) {
    if (!msg.header) {
      sendSenderProfileImage(msg.receiverRouteType, msg.receiverID, msg.sender, msg.senderNo);
      msg.mode === 'Share' ? senderFirstRoute = setInterval(() => {
        R_road += 0.00010;
        sendToReciever(msg.receiverRouteType, msg.receiverID, R_road);
      }, 1000) : '';
      
    } else {

      clearInterval(senderFirstRoute);
      alternative(msg.header, msg.receiverRouteType, msg.receiverID, msg.sender);

    }

  } else if (msg.receiverRouteType === 'first') {

    if (!msg.header) {
      sendSenderProfileImage('first', msg.receiverID, msg.sender, msg.senderNo);
      msg.mode === 'Share' ? senderSecondRoute = setInterval(() => {
        sendToReciever('first', msg.receiverID);
      }, 1000) : '';
      
    } else {
      
      clearInterval(senderSecondRoute);
      alternative(msg.header, 'first', msg.receiverID, msg.sender);

    }

  } else if (msg.receiverRouteType === 'second') {

    if (!msg.header) {
      sendSenderProfileImage('second', msg.receiverID, msg.sender, msg.senderNo);
      msg.mode === 'Share' ? senderThirdRoute = setInterval(() => {
        R_road++;
        sendToReciever('second', msg.receiverID, msg.sender)
      }, 1000) : '';
      
      
    } else {
      clearInterval(senderThirdRoute)
      alternative(msg.header, 'second', msg.receiverID, msg.sender);

    }

  }

});

//  Receiver Side
//  Sending Receiver Data To Sender
const receiverlocstore = ['uhud', 'yamen', 'marocco', 'senegal', 'khaulah', 'aini madi', 'Badr', 'kandak', 'Baharain'];

var S_road = 10.3084;
var sendToSender = (route, id, r)=>{
  let loc = receiverlocstore[(Math.floor(Math.random() * receiverlocstore.length))];
  let acc = Math.floor(Math.random() * 16);
  let lat = Math.random()*(11-10)+10;
  // let lon = Math.random()*(-9+11)+9;
  socket.emit('send-to-sender', {
    senderRouteType: route,
    senderID: id,
    receiverLoc: loc, 
    receiverAcc: acc,
    // receiverNetwork: Network,
    lat: r || `10.302${lat.toString().slice(12)}`,
    lon: 9.832708

  });
}

var sendReceiverProfileImage = (route, receiver, id, imgUrl) => {
  socket.emit('send-to-sender', {
    senderRouteType: route,
    receiver: receiver,
    senderID: id,
    img: imgUrl
    });
}

var alternative = (header, route, id, receiver) => {

  socket.emit('send-to-sender', {
    header: header,
    senderRouteType: route,
    senderID: id,
    receiver: receiver

  });

}

//  ================================= Receiver ===================================
socket.on('receiver', (msg) => {
  
  if (msg.senderRouteType === x) {

    if (!msg.header) {
      sendReceiverProfileImage(msg.senderRouteType, msg.receiver, msg.senderID, msg.receiverNo);
      msg.mode === 'Share' ? receiverFirstRoute = setInterval(() => {
        S_road -= 0.00010;
        sendToSender(msg.senderRouteType, msg.senderID, S_road);
      }, 1000) : '';
      
    } else {

      clearInterval(receiverFirstRoute);
      alternative(msg.header, msg.senderRouteType, msg.senderID, msg.receiver);

      }

  } else if (msg.senderRouteType === 'first') {

    if (!msg.header) {
      sendReceiverProfileImage('first', msg.receiver, msg.senderID, msg.receiverNo);
      msg.mode === 'Share' ? receiverSecondRoute = setInterval(() => {
        sendToSender('first', msg.senderID);
      }, 1000) : '';

    } else {
      
      clearInterval(receiverSecondRoute);
      alternative(msg.header, 'first', msg.senderID, msg.receiver);

      }

  } else if (msg.senderRouteType === 'second') {

    if (!msg.header) {
      sendReceiverProfileImage('second', msg.receiver, msg.senderID, msg.receiverNo);
      msg.mode === 'Share' ? receiverThirdRoute = setInterval(() => {
        S_road++;
        sendToSender('second', msg.senderID, msg.receiver);
      }, 1000) : '';

    } else {
      
      clearInterval(receiverThirdRoute);
      alternative(msg.header, 'second', msg.senderID, msg.receiver);

      }

  }

});

// ================================ RecordMe ===============================
socket.on('tripRec', (data) => {
  globalV.temp = [];
  if (data.initTime || data.endTime || data.eventDate) {
    Trip.remoteKeep(data);
    data.data.forEach(dt => globalV.temp.push(dt.coords));
    Trip._bbox.push(globalV.temp[0], globalV.temp[globalV.temp.length - 1]);
    globalV.temp = [];
    globalV.layeredPsNo.push(globalV.ps);
    setTimeout(Trip.startCloseWatch(), 1000);
  }
  close_shareLoc_popup(true);
  
});

socket.on('psReq', (id) => {
  globalV.isPsReq = true, globalV.toId = id;
  console.log('PS REQ ID: ', id)
});

// ================================ closeWatch ===============================
socket.on('closeWatch', (coords) => {
  Remote.psGuest(coords);
  close_shareLoc_popup(true);
});

const Remote = {
  psGuestIcon: '',
  options: {
    animate: true, duration: 2,
    easeLinearity: 0.7,
    maxZoom: map.getZoom()
  },

  psGuest: function(coords) {
    this.psGuestIcon ? clusterMarker.removeLayer(this.psGuestIcon) : '';
    this.psGuestIcon = L.marker(L.latLng(coords), { icon: remotePsBorderIcon });
    
    map.options.toFly ? this._flyTo(coords) : '';

    Book.get(Book._ON) === 'false' && !map.options.toFly ? 
    map.options.onRemoteFitBounds ?
      map.fitBounds(
        [ L.latLng(coords), L.latLng(coords) ], this.options ) : ""
      : globalV.remoteCoords = L.latLng(coords);

    clusterMarker.addLayer(this.psGuestIcon).addTo(map);
      
  },

  _flyTo: function(coords) {
    map.flyTo(L.latLng(coords), 17, { duration: 2, animate: true, easeLinearity: 0.5 });
    setTimeout(() => {
      map.options.toFly = false;
      map.setZoom(17);
    }, 2500);
  },

}

// ====================== When frnd send indication stuff ========================
function receiverSidePopUp(senderImg, senderName) {
  let popContent = `
    <div class="popup-container">
      <div id="inner-popup-container">
        <div class="receiverSidePopUp">
          <img src="${senderImg}" alt="WebG" class="receiverSideSenderImg">
          <h6 class="receiverSideSenderName">${senderName}
          <i>${time}</i>
          </h6>
        </div>
        <span id="popup-footer"></span>
      </div>
    </div>
    `;
    return L.popup({ keepInView: true, closeButton: false, offset: L.point(-1, 1) })
    .setContent(popContent);

}

var RCVIcon1, RCVIcon2, RCVIcon3, RCVIcon4;
socket.on('mapIndicators', async (msg) => {
  if (msg.isCustom !== false && msg.icon === 'custom') {
    if (msg.route === 'first') {
      await categorizeIcon(msg, true);

    } else if (msg.route === 'second') {
      await categorizeIcon(msg, true);

    } else if (msg.route === 'third') {
      await categorizeIcon(msg, true);
      
      // thirdFrndMsgIcon.style.display = "block"
      // show_frndMsgIcon("third");
    }

  } else {
    if (msg.route === 'first') {
      await categorizeIcon(msg);

    } else if (msg.route === 'second') {
      await categorizeIcon(msg);

    } else if (msg.route === 'third') {
      await categorizeIcon(msg);
        
    }

  }

  Book.get(Book.guestIconAuto) ? (map.panTo(msg.coords, {duration: 2, animate: true}), Move.pausedAutoMove()) : ''; //globalV.ondragFitBounds = true;
  Book.get(Book.guestIconAuto) ? [ isDone = true, Move.continueAutoMove(6000) ] : '';
  focusOnOne = true;

});

async function categorizeIcon(msg, isCustom) {
  var coords = L.latLng(msg.coords),
      options = {
        icon: indicatorIcon(msg.icon),
        draggable: false
      };

  if (!isCustom) {
    if (msg.click === 1) {
      RCVIcon1 !== undefined ? map.removeLayer(RCVIcon1) : '';
      RCVIcon1  = await new L.marker(coords, msg.icon !== 'icon0' ? options : { draggable: false }).bindPopup(receiverSidePopUp(image1.src, firstFrndName)).addTo(map);
      clickEvent(RCVIcon1);
      
    } else if (msg.click === 2) {
      RCVIcon2 !== undefined ? map.removeLayer(RCVIcon2) : '';
      RCVIcon2 = await new L.marker(coords, msg.icon !== 'icon0' ? options : { draggable: false }).bindPopup(receiverSidePopUp(image1.src, firstFrndName)).addTo(map);
      clickEvent(RCVIcon2);
      
    } else if (msg.click === 3) {
      RCVIcon3 !== undefined ? map.removeLayer(RCVIcon3) : '';
      RCVIcon3  = await new L.marker(coords, msg.icon !== 'icon0' ? options : { draggable: false }).bindPopup(receiverSidePopUp(image1.src, firstFrndName)).addTo(map);
      clickEvent(RCVIcon3);
      
    } else if (msg.click >= 4) {
      RCVIcon4 !== undefined ? map.removeLayer(RCVIcon4) : '';
      RCVIcon4 = await new L.marker(coords, msg.icon !== 'icon0' ? options : { draggable: false }).bindPopup(receiverSidePopUp(image1.src, firstFrndName)).addTo(map);
      clickEvent(RCVIcon4);
      
    } 

  } else {
    if (msg.click === 1) {
      RCVIcon1 !== undefined ? map.removeLayer(RCVIcon1) : '';
      RCVIcon1  = await new L.marker(coords, msg.icon !== 'icon0' ? options : { draggable: false }).bindPopup(createPopUp(image1.src, firstFrndName, msg.text, msg.img)).addTo(map);
      clickEvent(RCVIcon1);
  
    } else if (msg.click === 2) {
      RCVIcon2 !== undefined ? map.removeLayer(RCVIcon2) : '';
      RCVIcon2 = await new L.marker(coords, msg.icon !== 'icon0' ? options : { draggable: false }).bindPopup(createPopUp(image1.src, firstFrndName, msg.text, msg.img)).addTo(map);
      clickEvent(RCVIcon2);
      
    } else if (msg.click === 3) {
      RCVIcon3 !== undefined ? map.removeLayer(RCVIcon3) : '';
      RCVIcon3  = await new L.marker(coords, msg.icon !== 'icon0' ? options : { draggable: false }).bindPopup(createPopUp(image1.src, firstFrndName, msg.text, msg.img)).addTo(map);
      clickEvent(RCVIcon3);
      
    } else if (msg.click >= 4) {
      RCVIcon4 !== undefined ? map.removeLayer(RCVIcon4) : '';
      RCVIcon4 = await new L.marker(coords, msg.icon !== 'icon0' ? options : { draggable: false }).bindPopup(createPopUp(image1.src, firstFrndName, msg.text, msg.img)).addTo(map);
      clickEvent(RCVIcon4);
    } 
    
  }
  
  function clickEvent(icon) {
    icon.addEventListener('dblclick', del => map.removeLayer(icon));
  }
}

// ========================= Listening an illustration event =================================
socket.on("illustration", (coords) => {
  doIllustration(coords, isMobile, true);
  readOut('Illustration', 'started');
});

socket.on("userDisconnect", (msg) => {
  open_toast(`${msg.name} has disconnected`, 0)
});

// if user has'nt cookie or did'nt Sign up or LogOut
socket.on("unknownUser", (msg) => {
  if (msg.welcomeUser) {
    checkSignedUser(false);
    displayWelcomeBoard();
    setTimeout(deleteRecording, 1000);
    
  } else if (msg.update) {
    window.location.href = 'LogIn';
    
  } else if (msg.logOut) {
    checkSignedUser(msg);
    displayWelcomeBoard('logOut', 100); 
    setTimeout(deleteRecording, 100);
    
  } else if (msg.unknownUser){
    checkSignedUser(false);
    displayWelcomeBoard(true, 100);
    setTimeout(deleteRecording, 100);

  }
  close_shareLoc_popup(true);
  
});
socket.on('disconnect', disconn => {
  return false;
});

//  Disconnect A Person U had Conn...
function requestDisconnetion(msg) {
  socket.emit('requestDisconnetion',  { 
    route: msg
  });
}

function newGuest(route, img, guest) {
  if (route === 'first') {
    image1.src = `/WebG/image/${img}`;
    image1.style.border = "3px solid red"; // Red border indicating that the frnd is active for the chat and interacrion line
    firstFrndImgFrame.append(image1);
    palName1.innerHTML = guest;
    loadFrndProfile(route, image1.src, guest);  // From chat module
    connected = true;
    firstRoute = true;
    close_shareLoc_popup(true);

    if (secondRoute !== true && thirdRoute !== true) {
      resetDefaultChatMsg();
      globalV.defaultFrndToInteract = route;

    } else if (secondRoute === true && thirdRoute !== true || secondRoute !== true && thirdRoute === true)  {
      resetDefaultChatMsg('second');
      firstCheckedFriend.classList.remove("defaultFrnd");
      
    } else {
      firstCheckedFriend.classList.remove("defaultFrnd");

    }
    
  } else if (route === 'second') {
    image2.src = `/WebG/image/${img}`;
    secondFrndImgFrame.append(image2);
    palName2.innerHTML = guest;
    loadFrndProfile(route, image2.src, guest);  // From chat module
    close_shareLoc_popup(true);
    secondRoute = true;

    if (firstRoute !== true && thirdRoute !== true) {
      resetDefaultChatMsg();

    } else {
      resetDefaultChatMsg(route);

    }
    
  } else if (route === 'third') {
    image3.src = `/WebG/image/${img}`;
    thirdFrndImgFrame.append(image3);
    palName3.innerHTML = guest;
    loadFrndProfile(route, image3.src, guest);  // From chat module
    close_shareLoc_popup(true);
    thirdRoute = true;

    if (firstRoute !== true && secondRoute !== true) {
      resetDefaultChatMsg();

    } else {
      resetDefaultChatMsg(route);

    }

  }

  addChatStyle();
  globalV.onMeasure ? justifyBoard('-73%') : ''; // adjust it down to the G-img for beauty responsive
  readOut('', '');

}

//  Loading RemoteG img Frame for shareLoc req =======================================
export function waitResponse(route, id) {
  globalV.waitIndex = [0, 0, 0];
  route = direction(route);
  let lbl = document.getElementById("counter3");
  if (lbl && route > 3) {
    lbl.innerHTML = route;
  }

  if (route <= 3) {
    var awaitLoader = document.createElement('span');
    var counter = document.createElement('span');
  }

  function count(ele, c) {
    counter.innerHTML = c;
    counter.id = "counter" + c;
    awaitLoader.className = c < 3 ? "onListeningRes" : "onListeningRes lschild";
    awaitLoader.id = id;
    awaitLoader.appendChild(counter);
    ele.append(awaitLoader);
    c === 1 ? globalV.waitIndex[0] = route :
    c === 2 ? globalV.waitIndex[1] = route :
    globalV.waitIndex[2] = route;
  }

  route === 1 ? count(firstFrndImgFrame, 1) : 
  route === 2 ? count(secondFrndImgFrame, 2) : 
  route === 3 ? count(thirdFrndImgFrame, 3) : false;
}

function direction(route) {
  if (firstRoute && secondRoute && thirdRoute) {
    return 0;

  } else if (firstRoute && !secondRoute && !thirdRoute || 
    firstRoute && !secondRoute && thirdRoute) {
    return 2;

  } else if (firstRoute && secondRoute && !thirdRoute) {
    return 3;

  } else if (!firstRoute && secondRoute && thirdRoute || 
    !firstRoute && secondRoute && !thirdRoute ||
    !firstRoute && !secondRoute && thirdRoute ||
    (globalV.waitIndex[0] === 0 && globalV.waitIndex[1] === 0 && globalV.waitIndex[2] === 0)
  ) {
    return 1;

  } else {
    return route;
  }
}

export function removeWaitResponse(id) {
  let child = document.getElementById(`${id}`);
  if (child) {
    let parent = child.parentNode.className;
    if (parent === 'firstFrnd') {
      firstFrndImgFrame.removeChild(child);
      
    } else if (parent === 'secondFrnd') {
      secondFrndImgFrame.removeChild(child);
  
    } else if (parent === 'thirdFrnd') {
      document.querySelectorAll(".lschild").forEach((child, i) => {
        thirdFrndImgFrame.removeChild(child);
        globalV.waitIndex = [0, 0, 0];
      });
    }
  } else {
    let lblChild = document.getElementById(`counter3`);
    if (lblChild) {
      let minus = parseInt(lblChild.innerHTML) - 1;
      lblChild.innerHTML = minus;
    }
  }
}

//  Disconnecting connected friends ======================================================
function guestDisconnected(route) {
  if (route === 'first') {
    image1.src = ``;
    palName1.innerHTML = '';
    firstRoute = false;
    disconnectProfile(route);
    
    firstFrndImgFrame.style.display = 'none' // And make it none to reset the state
    Loc1.innerHTML = "";
    distance1.innerHTML = "";
    Network1.innerHTML = "";
    if (globalV.defaultFrndToInteract == route) {
      globalV.defaultFrndToInteract = undefined;
      focusOnOne = false;
    }
    
  } else if (route === 'second') {
    image2.src = ``;
    palName2.innerHTML = '';
    secondRoute = false;
    disconnectProfile(route);

    secondFrndImgFrame.style.display = 'none' // And make it none to reset the state
    palName2.innerHTML = "";
    Loc2.innerHTML = "";
    distance2.innerHTML = "";
    Network2.innerHTML = "";
    if (globalV.defaultFrndToInteract == route) {
      globalV.defaultFrndToInteract = undefined;
      focusOnOne = false;
    }
    
  } else if (route === 'third') {
    image3.src = ``;
    palName3.innerHTML = '';
    thirdRoute = false;
    disconnectProfile(route);

    secondFrndImgFrame.style.display = 'none' // And make it none to reset the state
    palName3.innerHTML = "";
    Loc3.innerHTML = "";
    distance3.innerHTML = "";
    Network3.innerHTML = "";
    if (globalV.defaultFrndToInteract == route) {
      globalV.defaultFrndToInteract = undefined;
      focusOnOne = false;
    }

  }

}

// Friends Functionalities
firstFrndImgFrame.addEventListener("click", () => {
  remove_frndMsgIcon("bx-mail-send");
  switchBuddy(1);
  
});

secondFrndImgFrame.addEventListener("click", () => {
  remove_frndMsgIcon(0, "bx-mail-send");
  switchBuddy(2);

});

thirdFrndImgFrame.addEventListener("click", () => {
  remove_frndMsgIcon(0, 0, "bx-mail-send");
  switchBuddy(3);

});

function switchBuddy(route) {
palName1.style.display = route !== 1 ? "none" : "flex";
Loc1.style.display = route !== 1 ? "none" : "flex";
distance1.style.display = route !== 1 ? "none" : "flex";
Network1.style.display = route !== 1 ? "none" : "flex";
firstFrndName !== undefined && route === 1 ? readOut(firstFrndName, null, true) : '';

palName2.style.display = route !== 2 ? "none" : "flex";
Loc2.style.display = route !== 2 ? "none" : "flex";
distance2.style.display = route !== 2 ? "none" : "flex";
Network2.style.display = route !== 2 ? "none" : "flex";
secondFrndName !== undefined && route === 2 ? readOut(secondFrndName, null, true) : '';

palName3.style.display = route !== 3 ? "none" : "flex";
Loc3.style.display = route !== 3 ? "none" : "flex";
distance3.style.display = route !== 3 ? "none" : "flex";
Network3.style.display = route !== 3 ? "none" : "flex";
thirdFrndName !== undefined && route === 3 ? readOut(thirdFrndName, null, true) : '';

}

// ============================ Map and Socket Interaction ===========================
const _Options = {
  custom: {
    draggable: false
  },

  indicators: {
    icon: indicatorIcon(activeBtn),
    draggable: true
  },

  panOptions: {
    animate: true, duration: 3, easeLinearity: 0.7,
    noMoveStart: true, offset: [0, 400]
  },

  drag_and_stopAutoMove: function(marker, route, icon) {
    marker.on('dragstart', e => {
      Move.pausedAutoMove();
    });

    marker.on('drag', drag => {
      globalV.defaultFrndToInteract !== undefined ? 
      sendDrag(route, icon, drag.latlng) : '';
    });

    marker.on("click", e => marker.closePopup());

    marker.on('dragend', () => {
      isDone = true;
      Move.continueAutoMove(6000);
    });
  }

};

function createPopUp(senderImg, senderName, textContent, image) {
  if (textContent !== undefined && image === undefined) {
    let popContent = `
      <div class="popup-container">
        <div id="inner-popup-container">
          <div>
            <img src="${senderImg}" alt="WebG" id="popupSenderImg">
            <h6 id="popup-sender">${senderName}</h6>
          </div>
          <p>${textContent}</p>
          <span id="popup-footer"></span>
        </div>
      </div>
      `;
    return L.popup({ keepInView: true, closeButton: false, offset: L.point(-1, 1) })
    .setContent(popContent);

  } else  if (textContent === undefined && image !== undefined || textContent === '' && image !== undefined) {
    let popContent = `
      <div class="popup-container">
        <div id="inner-popup-container">
          <div>
            <img src="${senderImg}" alt="WebG" id="popupSenderImg">
            <h6 id="popup-sender">${senderName}</h6>
          </div>
          <img src="${image}" alt="WebG" class="pop-send-img" width="250px" style="margin-top: 10px;">
          <span id="popup-footer"></span>
        </div>
      </div>
      `;
    return L.popup({ keepInView: true, closeButton: false, offset: L.point(-1, 1) })
    .setContent(popContent);

  } else  if (textContent !== undefined && image !== undefined) {
    let popContent = `
      <div class="popup-container">
        <div id="inner-popup-container">
          <div>
            <img src="${senderImg}" alt="WebG" id="popupSenderImg">
            <h6 id="popup-sender">${senderName}</h6>
          </div>
          <p>${textContent}</p>
          <img src="${image}" alt="WebG" class="pop-send-img">
          <span id="popup-footer"></span>
        </div>
      </div>
      `;  
      return L.popup({ keepInView: true, closeButton: false, offset: L.point(-1, 1) })
      .setContent(popContent);

  }

}

var indicator_one, indicator_two, indicator_three, indicator_four, mapClickCount = 0, mapClickCountOnIllus = 0;
map.on('preclick', async (e) => {
  if (startMapClick === true && activeMethod === "indicators" && activeBtn !== undefined) {
    activeBtn === 'custom' && customIndSet !== true ? mapClickCount = mapClickCount : mapClickCount++; //counting map click for shifting the markers name for delete btns to perform well
    const coordinates = e.latlng;
    globalV.coordToMeasure = coordinates;
    var image;
    isImgDel === false && isImage === true ? image = Cstm_image.src : image = undefined;
    
    if (mapClickCount === 1) {
      let confirmIconOnDrag = activeBtn;
      if (activeBtn === 'custom') {
        if (customIndSet !== false) {
          indicator_one = await new L.marker(coordinates, _Options.custom).bindPopup(createPopUp(userPic.src, 'You', customIndTextMessage, image)).addTo(map);
          resizeAndSendImage(coordinates, customIndImg, customIndTextMessage); // send to remote friend

        } 
        
      } else if (activeBtn !== undefined) {
        indicator_one = await new L.marker(coordinates, activeBtn !== 'icon0' ? _Options.indicators : { draggable: true }).addTo(map);
        sendMarkersToRemote(coordinates); // send to remote friend
        _Options.drag_and_stopAutoMove(indicator_one, 1, confirmIconOnDrag);

      }

    } else if (mapClickCount === 2) {
      let confirmIconOnDrag = activeBtn;
      if (activeBtn === 'custom') {
        if (customIndSet !== false) {
          indicator_two = await new L.marker(coordinates).bindPopup(createPopUp(userPic.src, 'You', customIndTextMessage, image)).addTo(map);
          resizeAndSendImage(coordinates, customIndImg, customIndTextMessage); // send to remote friend
          
        } 

      } else if (activeBtn !== undefined) {
        indicator_two = await new L.marker(coordinates, activeBtn !== 'icon0' ? _Options.indicators : { draggable: true }).addTo(map);
        sendMarkersToRemote(coordinates); // send to remote friend
        _Options.drag_and_stopAutoMove(indicator_two, 2, confirmIconOnDrag);

      }

    } else if (mapClickCount === 3) {
      let confirmIconOnDrag = activeBtn;
      if (activeBtn === 'custom') {
        if (customIndSet !== false) {
          indicator_three = await new L.marker(coordinates).bindPopup(createPopUp(userPic.src, 'You', customIndTextMessage, image)).addTo(map);
          resizeAndSendImage(coordinates, customIndImg, customIndTextMessage); // send to remote friend

        } 

      } else if (activeBtn !== undefined) {
        indicator_three = await new L.marker(coordinates, activeBtn !== 'icon0' ? _Options.indicators : { draggable: true }).addTo(map);
        sendMarkersToRemote(coordinates); // send to remote friend
        _Options.drag_and_stopAutoMove(indicator_three, 3, confirmIconOnDrag);

      }

    } else if (mapClickCount === 4) {
      let confirmIconOnDrag = activeBtn;
      if (activeBtn === 'custom') {
        if (customIndSet !== false) {
          indicator_four = await new L.marker(coordinates).bindPopup(createPopUp(userPic.src, 'You', customIndTextMessage, image)).addTo(map);
          resizeAndSendImage(coordinates, customIndImg, customIndTextMessage); // send to remote friend

        }
        
      } else if (activeBtn !== undefined) {
        indicator_four = await new L.marker(coordinates, activeBtn !== 'icon0' ? _Options.indicators : { draggable: true }).addTo(map);
        sendMarkersToRemote(coordinates); // send to remote friend
        _Options.drag_and_stopAutoMove(indicator_four, 4, confirmIconOnDrag);
      }

    } else if (mapClickCount > 4) {
      map.removeLayer(indicator_four);
      let confirmIconOnDrag = activeBtn;

      if (activeBtn === 'custom') {
        if (customIndSet !== false) {
          indicator_four = await new L.marker(coordinates).bindPopup(createPopUp(userPic.src, 'You', customIndTextMessage, image)).addTo(map);
          resizeAndSendImage(coordinates, customIndImg, customIndTextMessage); // send to remote friend

        }

      } else if (activeBtn !== undefined) {
        indicator_four = await new L.marker(coordinates, activeBtn !== 'icon0' ? _Options.indicators : { draggable: true }).addTo(map);
        sendMarkersToRemote(coordinates); // send to remote friend
        _Options.drag_and_stopAutoMove(indicator_four, 4, confirmIconOnDrag);
      }
      
    }
    // Stop the userPos autoMove on indicators
    globalV.remoteCoords ? (clusterMarker.removeLayer(map.options.user), Move.pausedAutoMove()) : Move.pausedAutoMove();

  } else if (activeMethod === 'Illustration' && activeBtn === 'Self' || activeMethod === 'Illustration' && activeBtn === 'Both' && globalV.defaultFrndToInteract !== undefined) {
    mapClickCountOnIllus++;
    if (!isMobile) {   
      if (mapClickCountOnIllus % 2 === 1) {
        readOut('Illustration', 'Paused');
        illusPaused = true;
        
      } else {
        readOut('Illustration', 'Continue');
        illusPaused = false;
  
      }

    } 
    
  }
  
  closeSettingPanel(); // Close the Setting Panel if it was already opened
  globalV.isBuddyPanelOpened ? hide_buddiesPanel() : '';
  
});

delOne.addEventListener('click', e => { // delete one indicator icon
  showAndHide(delOne, delAll, 1);
  let any = Trip.deleteMarkers('delOne');
  mapClickCount <= 0 && any ? open_toast(any) : '';

  if (mapClickCount <= 4 || indicator_one !== undefined) {
    mapClickCount === 1 ? map.removeLayer(indicator_one) : 
    mapClickCount === 2 ? map.removeLayer(indicator_two) :
    mapClickCount === 3 ? map.removeLayer(indicator_three) :
    mapClickCount === 4 ? map.removeLayer(indicator_four) : 
    '';
    // Reset count
    mapClickCount === 1 ? mapClickCount = 0 : 
    mapClickCount === 2 ? mapClickCount = 1  :
    mapClickCount === 3 ? mapClickCount = 2  :
    mapClickCount === 4 ? mapClickCount = 3  : 
    '';
  }
});

delAll.addEventListener('click', () => {
  showAndHide(delAll, delOne, 1);
  if (mapClickCount === 2) {
    map.removeLayer(indicator_one);
    map.removeLayer(indicator_two);
    mapClickCount = 0;

  } else if (mapClickCount === 3) {
    map.removeLayer(indicator_one);
    map.removeLayer(indicator_two);
    map.removeLayer(indicator_three);
    mapClickCount = 0;

  } else if (mapClickCount >= 4) {
    map.removeLayer(indicator_one);
    map.removeLayer(indicator_two);
    map.removeLayer(indicator_three);
    map.removeLayer(indicator_four);
    mapClickCount = 0;

  } else {
    let any = Trip.deleteMarkers();
    Trip.markerDeletion = true;
    mapClickCount <= 0 && any ? open_toast('Nothing to delete') : '';
  }

});

// Event handlers Base On Device Types .....................................................
var mblPointer;
if (isMobile) {
  map.on("click", (e) => {
    let x = e.latlng.lat;
    let y = e.latlng.lng;
    if (globalV.userLogIn) {
      if (startIllust !== false && activeBtn === 'Self' || startIllust !== false && activeBtn === 'Both') {
        if (mblPointer) {
          clearIllustration();
          map.removeLayer(mblPointer);
        }
        
        activeBtn === 'Self' || activeBtn === 'Both' && globalV.defaultFrndToInteract !== undefined ? mblPointer = L.marker([x, y], { icon: mobilePointerIcon , draggable: true, autoPan: true, autoPanOnFocus: true,
          autoPanPadding: [200, 400], autoPanSpeed: 2
         }).addTo(map) : '';
        activeBtn === 'Both' && globalV.defaultFrndToInteract !== undefined ? socket.emit('visualAid', { route: globalV.defaultFrndToInteract, coords: { x: x, y: y } }) : activeBtn === 'Both' && globalV.defaultFrndToInteract === undefined ? readOut('Illustration', 'No friend') : '';
  
        illusPaused === false ? mblPointer.on('drag', e => {
          // checkScreenWidth(e)
          doIllustration(e, true);
          // Send coordinates to selected route: defaultFrndToInteract,
          activeBtn === 'Both' && globalV.defaultFrndToInteract !== undefined ? socket.emit('visualAid', { route: globalV.defaultFrndToInteract, coords: { x: e.latlng.lat, y: e.latlng.lng } }) : '';
          
        }) : '';
  
      }
    } else {
      open_toast('Log in', 0);
    }

  });

  // clearIllustration lines here ============================================
  expander.addEventListener('click', () => {
    setTimeout(() => {
      if (mblPointer) {
        clearIllustration();
        map.removeLayer(mblPointer);
        isDone = true;
        Move.continueAutoMove();
      }
      }, 500);

  });

} else {
  map.on('mousemove', e => {
    if (startIllust !== false && activeBtn !== undefined && illusPaused === false && globalV.userLogIn) {
      let x = e.latlng.lat;
      let y = e.latlng.lng;
      // checkScreenWidth(e);
      activeBtn === 'Self' && illusPaused === false ? doIllustration(e) : activeBtn === 'Both' && globalV.defaultFrndToInteract !== undefined ? doIllustration(e) : readOut('Illustration', "You're not connected with any friend");
      // Send coordinates to selected route: defaultFrndToChat,
      activeBtn === 'Both' && globalV.defaultFrndToInteract !== undefined ? socket.emit('visualAid', { route: globalV.defaultFrndToInteract, coords: { x: x, y: y } }) : activeBtn === 'Both' && globalV.defaultFrndToInteract === undefined ? clearIllustration() : '';

    } else {
      globalV.userLogIn ? clearIllustration() : '';

    }

  });

}

var midPointer, outerPointer, X0, X1, Y0, Y1;
function doIllustration(e, mobile, receiver) {
  let x = receiver ? e.lat : e.latlng.lat;
  let y = receiver ? e.lng : e.latlng.lng;
  let options = { 
    name: 'localUser', icon: guestIcon, draggable: true, autoPan: true, 
    autoPanOnFocus: true, autoPanPadding: [200, 400], autoPanSpeed: 3
    }

  if (midPointer || X0 || Y0) {
    mobile === true ? '' : map.removeLayer(outerPointer);
    map.removeLayer(midPointer);

    // Removing the existing vertical line
    map.removeLayer(X0);
    map.removeLayer(X1);

    // Removing the existing horizontal
    map.removeLayer(Y0);
    map.removeLayer(Y1);
  }
  mobile === true ? '' :
    outerPointer = L.circle([x, y], { color: "#00ff00", weight: 1, fillColor:"", fillOpacity: 0, radius: 5, pane: 'shadowPane' }).addTo(map);

   // vertical line
  X0 = L.polyline([[x, y],[x, 1.0]], {color: '#00ff00',weight: 1}).addTo(map);
  X1 = L.polyline([[x, y],[x, 100]], {color: '#00ff00',weight: 1}).addTo(map);
  
  // horizontal
  Y0 = L.polyline([[x, y],[1.0, y]], {color: '#00ff00',weight: 1}).addTo(map);
  Y1 = L.polyline([[x, y],[100, y]], {color: '#00ff00',weight: 1}).addTo(map);

  midPointer = L.circle([x, y], { color: "#000000", weight: 0, fillColor:"black", fillOpacity: 0.7, radius: 2, }).addTo(map);

  if (receiver && Book.get(Book.guestIconAuto)) {
    map.panTo([x, y], {duration: 2, animate: true});
    Move.pausedAutoMove();
    isDone = true;
    Move.continueAutoMove(6000);

  } else {
    Move.pausedAutoMove();
  }

  readOut('Illustration', 'Started...');

}

function clearIllustration() {
  if (midPointer) {
    isMobile === true ? '' : map.removeLayer(outerPointer);
    map.removeLayer(midPointer);
  
    // Removing the existing vertical line
    map.removeLayer(X0);
    map.removeLayer(X1);
  
    // Removing the existing horizontal
    map.removeLayer(Y0);
    map.removeLayer(Y1);

    if (activeMethod !== undefined && !isMobile && !startMapClick) {
      Move.continueAutoMove();
      isDone = true;
    }

  }

}

function resizeAndSendImage(coords, img, text, isdrag) {
  if (globalV.defaultFrndToInteract !== undefined) {
    const fileReader = new FileReader();
          fileReader.onload = (event) => {
            const base64Image = event.target.result;
            
            let newImg = new Image();
            newImg.onload = function() {
              let resizedImg = resizeImg(newImg);
              if (isdrag) {
                globalV.defaultFrndToInteract !== undefined ? sendMarkersToRemote(coords, resizedImg, text, isdrag) : ''; // send to remote friend
  
              }
              globalV.defaultFrndToInteract !== undefined ? sendMarkersToRemote(coords, resizedImg, text) : ''; // send to remote friend
  
            }
            newImg.src = base64Image;
          }
          fileReader.readAsDataURL(img);

  }

}

function sendMarkersToRemote(coords, img, text, isdrag) {
  if (activeMethod !== undefined && activeBtn !== undefined && globalV.defaultFrndToInteract !== undefined) {
    activeBtn === 'custom' && customIndSet === true ? 
    socket.emit("mapClick", {
      type: activeMethod,
      route: globalV.defaultFrndToInteract,
      click: isdrag ? isdrag : mapClickCount,
      isCustom: true,
      icon: activeBtn,
      img: img,
      text: text,
      coords: coords
    }) :
    socket.emit("mapClick", {
      type: activeMethod,
      route: globalV.defaultFrndToInteract,
      click: mapClickCount,
      isCustom: false,
      icon: activeBtn,
      coords: coords
    });

  }

}

function sendDrag(clickCount, icon, coords) {
  socket.emit("mapClick", {
    type: 'indicators',
    route: globalV.defaultFrndToInteract,
    click: clickCount,
    isCustom: false,
    ondrag: true,
    icon: icon,
    coords: L.latLng(coords)
  });
}

// ================================================ Record ME ===========================================
var Rec = document.querySelector(".rec");
var onRecording = document.querySelector(".onRecording");
var defaultRecord = document.getElementById("default");
var startStopTime = document.getElementById("startStopTime");
var startStop = document.getElementById("startStop");
var displayRec = document.getElementById("displayRec");
var saveRecording = document.getElementById("saveRecording");
var deleteRecordingBtn = document.getElementById("deleteRecording");

const InitialValues = 3600 / 4; // time interval for rec duration in secs (i.e 15m)
const max_width = isMobile ? 150 : 120
var width = 0, id1, id2, TIME = InitialValues;
var isStart = 0;
var countStartStopClick = 0;
var countShowerClick = 0;
var mayIRestart = true;
var isClick = false, isStartStop = false, isSaving = false;

function startRecord() {  // Reset
  Rec.style.display = 'flex';
  showRecPanel();
  mayIRestart = false;
  InitRecording = false;
  finished = false;
  isSaving = false;
  setTimeout( e => playRecord(), 1000);
}

startStop.addEventListener('click', cl => {
  if(isStartStop !== true && !isSaving) {
    isStartStop = true;
    countStartStopClick++;
    countStartStopClick % 2 === 0 ? 
    Recording.startRecording() : Recording.stopRecording();
  }

  setTimeout(isStartStop = false, 700);

});

function playRecord() {
  isStart++;
  startStop.classList.remove("bx-play");
  startStop.classList.add("bx-pause");
  isStart === 1 ? readOut('Recording', 'started') :
  readOut('Recordig', 'continue');
  InitRecording = true;
  globalV.tripBank = []; //Reset to empty for new rec...
  Trip.newRec = true; // to send for update of current record to playlist of tripBank
}

function pauseRecord() {
  startStop.classList.remove("bx-pause");
  startStop.classList.add("bx-play");
  readOut('Recording', 'paused');
  countStartStopClick = 1;
  InitRecording = finished !== false ? true : false;
  finished && countShowerClick % 2 === 1 ? 
  displayRec.style.backgroundColor = "#00ff00" : '';
}

function showRecPanel() {
  isClick = true;
  id1 = setInterval(() => {
    width += 5;
    onRecording.style.width = width + 'px';
    width === max_width ? 
    [
      isClick = false,
      clearInterval(id1)
    ] : '';

  }, 5);

  setTimeout(() => {
    displayRec.style.backgroundColor = '#050c74';
  }, 500);

}

function hideRecPanel() {
  width = max_width;
  isClick = true;
  id2 = setInterval(() => {
    width -= 5;
    onRecording.style.width = width + 'px';
    width === 0 ? 
    [
      onRecording.style.padding = "0px 0px;",
      isClick = false,
      clearInterval(id2)
    ] : '';

  }, 5);

  setTimeout(() => {
    displayRec.style.backgroundColor = "#ce0000";
  }, 500);
  
}

displayRec.addEventListener("click", cl => {
  if (isClick !== true) {
    countShowerClick++;
    countShowerClick % 2 === 1 ? hideRecPanel() : showRecPanel();
  }

});

saveRecording.addEventListener("click", cl => {
  saveRecording.style.color = "#00ff00";
  !isSaving ? setTimeout(e => [saveRecording.style.color = "#fff", open_toast("Saved")], 1000) :
              setTimeout(e => [saveRecording.style.color = "#fff", open_toast("Already saved")], 2000);
  countStartStopClick = 0;
  !isSaving ? recDuration('save') : '';
});

deleteRecordingBtn.addEventListener("click", cl => {
  Recording.deleteRecording();
});

function deleteRecording() {
  defaultRecord.classList.remove('activeIndicatorIcon');
  deActivate_expander_button_items(recordMe_btn);
  onRecording.style.width = width = 0;
  record.style.display = "none";
  Rec.style.display = "none";
  countStartStopClick = 0;
  finished = true;
  recDuration('delete');
  countShowerClick = 0;
  mayIRestart = true;
  readOut('', '');
  isStart = 0;
}

defaultRecord.addEventListener("click", cl => {
  if (mayIRestart) {
    if (!firstRoute && !secondRoute && !thirdRoute || firstRoute && !secondRoute && !thirdRoute) {
      startRecord(), recDuration();
      defaultRecord.classList.add('activeIndicatorIcon');
      setTimeout(hideExpandButtonItems, 100);
      
    } else {
      setTimeout(
        e => 
        board(
          "RecordMe is recommended on zero or one connected Guest for excellent performance,\n\
           battery maintainance and data consumption. Do you want to continue?",
          null, 'warn'
        ), 1000);
      
      const yesDoRec = yesLogOut;
      yesDoRec.onclick = function(cl) {
        const className = cl.target.classList.toString();
        className ? [startRecord(), recDuration(), defaultRecord.classList.add('activeIndicatorIcon')] : '';
        yesDoRec.classList.remove('warn');
        closeBoard();
      };
      setTimeout(hideExpandButtonItems, 100);
    }

  } else {
    open_toast('Recording been started', 0);
    setTimeout(hideExpandButtonItems, 100);
  }
});

var recStartStopCountIDs = [];
function recDuration(stop) {
  recStartStopCountIDs.push(setInterval( async () => {
    TIME--;
    let minutes = (Math.floor(TIME / 60));
    let seconds = (TIME % 60);
    let mins = minutes > 9 ? minutes : "0" + minutes;
    let secs = seconds > 9 ? seconds : "0" + seconds;

    startStopTime.innerHTML = `${mins}:${secs}`;
    minutes === 0 && seconds === 0 ? recStartStopCountIDs.forEach(id => (
      clearInterval(id), 
      Recording.finishedRec(),
      isSaving = true
    )) : '';

  }, 1000));

  switch (stop) {  
    case 'pause':
      recStartStopCountIDs.forEach(id => clearInterval(id));
      break;
      
    case 'save':
      recStartStopCountIDs.forEach(id => clearInterval(id));
      isSaving = true;
      Recording.finishedRec();
      break;
      
    case 'delete':
      recStartStopCountIDs.forEach(id => clearInterval(id));
      TIME = InitialValues;
      startStopTime.innerHTML = '00:00';
      break;
  
    default:
      break;
  }

}

document.getElementById("customR").addEventListener('click', cl => open_toast('Wait please, On the process!'));

// ========== Auto Move User Position And Start Rec... ============
var ondragFitBoundsIDs = [], isDone = false;
const Move = {
  pausedAutoMove: function() {
    map.options.isIndicators = true;
    globalV.ondragFitBounds = false;
    isDone = false;
    ondragFitBoundsIDs.forEach(id => clearTimeout(id));
  },

  continueAutoMove: function(ext) {
    if (isDone && !globalV.onMeasure) {
      ondragFitBoundsIDs.push(setTimeout(() => {
        globalV.ondragFitBounds = true;
        map.options.isIndicators = false;
      }, ext ? ext : 5000));
    }
  }
}

function mapUserPosPreferece() {
    var _count = 0;
    var book = Book;
    book.get(book._ON) === 'false' ? (checkUserPosBtn(), _count = 1) : 
    (
      book.set(book._ON, true),
      setTimeout(autoMove('start'), 2000)
    );
    
    myPos.addEventListener('click', cl => {
      _count++;
      if (_count % 2 === 0) {
        book.set(book._ON, true), 
        checkUserPosBtn(myPos), setTimeout(hideExpandButtonItems, 100)
        setTimeout(autoMove('start'), 2000);
        
      } else {
        book.set(book._ON, false);
        checkUserPosBtn(), setTimeout(hideExpandButtonItems, 100);
        autoMove('stop');
        map.options.toFly = true;
      }
  
      setTimeout(() => {
        boundryDropDownMenu.style.display = "none";
        deActivate_expander_button_items(my_area_btn);
        
      }, 100);
  
      cl.preventDefault();
  
    });
    
    socket.emit('update', { getTripRec: true }); // Get Trip Recorded data
    map.on('dragstart', e => Move.pausedAutoMove());
    map.on('dragend', e => {
      isDone = true;
      Move.continueAutoMove(2500);
    });
  }

var autoMoveIDs = [], InitRecording = false, 
    finished = false;
function autoMove(cmd) {
  var paddingTop = isMobile && !globalV.remoteCoords ? 400 : globalV.remoteCoords ? 300 : 450;
  var paddingLeft = globalV.remoteCoords ? 200 : 0;
  var paddingRight = globalV.remoteCoords ? 200 : 0;
  var paddingBottom = globalV.remoteCoords ? 300 : 0;
  var lat = map.options.center[0],
      lng = map.options.center[1],
      increment = 0.00010,
      countTime = 0;

  cmd === 'start' ? checkUserPosBtn(cmd) : '';
  switch (cmd) {
    case 'start':
      autoMoveIDs.push(
        setInterval(function() {
          countTime >= 0 && countTime < 25 ? 
          lng += increment : '';
          
          countTime > 25 && countTime < 50 ?
          lat += increment : ''; 
          
          countTime > 50 && countTime < 75 ?
          lng -= increment : '';
          
          countTime > 75 && countTime < 100 ? 
          lat -= increment : ''; 
          
          countTime === 100 ? countTime = 0 : '';

          globalV.localCoords = [lat, lng];
          if (map.options.user) clusterMarker.removeLayer(map.options.user);
          map.options.user = L.marker(L.latLng(globalV.localCoords), { icon: localUserIcon });
          clusterMarker.addLayer(map.options.user).addTo(map)
          countTime++;
          
          if (globalV.ondragFitBounds && !map.options.isIndicators) {
            map.fitBounds(
              [ globalV.localCoords, globalV.remoteCoords ? globalV.remoteCoords : globalV.localCoords ], 
              { 
                animate: true, duration: 2,
                easeLinearity: 0.7,
                // paddingTopLeft: [paddingLeft, paddingTop], 
                // paddingBottomRight: [paddingRight, paddingBottom],
                maxZoom: map.getZoom()
              }
            );
          }
          
          if (globalV.remoteCoords && !map.options.isIndicators) {
            globalV.ondragFitBounds = false;
            map.fitBounds(
              [ globalV.localCoords, globalV.remoteCoords ], 
              { 
                animate: true, duration: 2, //(this.__map.getZoom() / 13.5),
                easeLinearity: 0.7,
                padding: [ 100, 175 ],
                maxZoom: map.getZoom()
              }
              );

            }

            globalV.remoteCoords &&  map.options.isIndicators ? clusterMarker.removeLayer(map.options.user) : '';
              
            InitRecording ? Recording.computeCoords(globalV.localCoords) : '';
            globalV.isPsReq === true && globalV.toId !== null ?
            socket.emit('onPsRequestCoords', [globalV.toId, globalV.localCoords]) : ''; // To person who request using ps no

        }, 1000)
      );
      break;

    case 'stop':
      autoMoveIDs.forEach( id => {
        clearInterval(id);
        if (map.options.user) map.removeLayer(map.options.user);

      });
      break;

    default:
      break;
  }

}

const Recording = {
  storeFeets: [],
  initial: false,
  countStep: 0,
  meters: 25,
  _time: '',

  computeCoords: function(coords) {
    this.storeFeets.push(L.latLng(coords));
    this._time = new Date().toLocaleTimeString();
    finished && InitRecording ? this.sendFeet('end', null, coords) : '';
    
    if (this.storeFeets.length >= 45 && InitRecording) {
      this.lastIndex = this.storeFeets.length - 1;
      this.firstCoords = [this.storeFeets[0].lat, this.storeFeets[0].lng];
      this.lastCoords = [this.storeFeets[this.lastIndex].lat, this.storeFeets[this.lastIndex].lng];
      
      this._firstCoords = L.latLng(this.firstCoords);
      this._lastCoords =  L.latLng(this.lastCoords);
      this.distance = this._firstCoords.distanceTo(this._lastCoords);

      if (this.distance >= this.meters) {
        this.sendFeet(null, null, this._lastCoords);
        this.storeFeets = [];
      }
      
    }
    !this.initial && InitRecording ? this.sendFeet('initial', coords) : '';
  },

  toPoints: function(coords) {
    return map.latLngToLayerPoint(coords);
  },

  toLatlng: function(points) {
    return map.layerPointToLatLng(points);
  },

  startRecording: function() {
    playRecord();
    recDuration();
  },

  stopRecording: function() {
    pauseRecord();
    recDuration('pause');
  },
  
  finishedRec: function() {
    finished = true;
    this.storeFeets = [];
    setTimeout(pauseRecord(), 100);
  },
  
  deleteRecording: function() {
    deleteRecording();
    this.storeFeets = [];
  },

  sendFeet: function(step, coords0, coords1) {
    Trip.date = _date;
    step === 'initial' ?
    (socket.emit('record', { step: step, eventDate: _date, initTime: this._time, firstFeet: coords0 }), this.initial = true) :
    step === 'end' ?
    (
      socket.emit('record', { step: step, endTime: this._time, lastFeet: coords1 }), 
      this.initial = false,
      finished = false, 
      InitRecording = false
    ) :
    socket.emit('record', { nextFeet: coords1 }) ;
  }
  
}

// Measurement =============================================
Measurement.onclick = function() {
  measures.startMeasurement(null, globalV.coordToMeasure);
  activeBtn === 'Measurement' ? Move.pausedAutoMove() : '';
}

closeMea.onclick = function() {
  boardContainer.style.display = 'none';
  globalV.onMeasure = false;
  isDone = true;
  map.setZoom(17);
  Move.continueAutoMove(1000);
  checkBoundryIcon();
  setTimeout(hideExpandButtonItems, 100);
  activeBtn = undefined;
  readOut('', '');
}

// Trip Reading =============================================
var clickIndex = 1, timeId, tripMarkers = [], psMarkers = [];
export const Trip = {
  trip: document.querySelector('.trip'),
  playTrip: document.getElementById('playTrip'),
  delTrip: document.getElementById('delTrip'),
  tripContent: document.querySelector('.tripContent'),
  recInfor: document.getElementById('recInfor'),
  wx: window.innerWidth,
  _isConnected: false,
  markerDeletion: false,
  layered: false,
  newRec: false,
  date: '',
  bbox: [],
  _bbox: [],
  count: 0,

  options: function() {
    return {
      animate: true, duration: 5,
      easeLinearity: 0.7,
      padding: [ 0, 300 ],
      maxZoom: map.getZoom()
    }
  },

  hasRecord: function() {
    if (globalV.tripBank.length !== 0) {
      timeId = setInterval(this.layers, 500);
    }
  },

  startCloseWatch: function() {
    if (globalV.remoteTripBank.length !== 0) {
      timeId = setInterval(this.psLayers, 1000);
    }
  },
  
  fitAfter: function(q) {
    fitBounds.absoluteFit(q?this._bbox[0]:this.bbox[0], q?this._bbox[1]:this.bbox[1], {
      animate: true, duration: 2,
      easeLinearity: 0.7,
      padding: [ 400, 300 ],
      maxZoom: map.getZoom()
    }, true);
    globalV.isPsReq = false;
  },
  
  psLayers: function() {
    let  psMarker, firstCoords, lastCoords, f, l;
    firstCoords = globalV.remoteTripBank[0].geometry.coordinates;
    lastCoords = globalV.remoteTripBank[0].geometry.coordinates;
    f = L.latLng(firstCoords).equals(L.latLng(Trip._bbox[0]));
    l = L.latLng(firstCoords).equals(L.latLng(Trip._bbox[1]));
    try {
      L.geoJSON(globalV.remoteTripBank[0], {
        onEachFeature: Trip.showPsPopUp,
        pointToLayer: function (feature) {
          fitBounds.absoluteFit(feature.geometry.coordinates, feature.geometry.coordinates, {
            animate: true, duration: 4,
            easeLinearity: 0.7,
            maxZoom: map.getZoom()
          });
          psMarker = 
          f ? L.marker(feature.geometry.coordinates, { icon: remotePsBorderIcon }) :
          l ? L.marker(feature.geometry.coordinates, { icon: remotePsBorderIcon }) : 
          L.marker(feature.geometry.coordinates, { icon: remotePsMidIcon });

          psMarkers.push(psMarker);
          psMarker.on('dblclick', e => map.removeLayer(psMarker));
          return psMarker;
        }
      }).addTo(map);
      
    } catch(err) {
      let _err = false;
      !_err ? open_toast(gotWrong + " " + "while set up", 0) : '';
      _err = true;
    }

    globalV.remoteTripBank.shift();
    globalV.remoteTripBank.length <= 0 ? 
    [
      clearInterval(timeId),
      setTimeout( e => Trip.fitAfter('ps'), 2000)
    ] : '';
  },
  
  layers: function() {
    let  tripMarker, firstCoords, lastCoords, f, l;
    firstCoords = globalV.tripBank[0].geometry.coordinates;
    lastCoords = globalV.tripBank[0].geometry.coordinates;
    f = L.latLng(firstCoords).equals(L.latLng(Trip.bbox[0]));
    l = L.latLng(firstCoords).equals(L.latLng(Trip.bbox[1]));
    try {
      L.geoJSON(globalV.tripBank[0], {
        onEachFeature: Trip.showPopUp,
        pointToLayer: function (feature) {
          fitBounds.absoluteFit(feature.geometry.coordinates, feature.geometry.coordinates, {
            animate: true, duration: 4,
            easeLinearity: 0.7,
            maxZoom: map.getZoom()
          });
          tripMarker = 
          f ? L.marker(feature.geometry.coordinates, { icon: remotePsBorderIcon }) :
          l ? L.marker(feature.geometry.coordinates, { icon: remotePsBorderIcon }) : 
          L.marker(feature.geometry.coordinates, { icon: remotePsMidIcon });
          tripMarkers.push(tripMarker);
          tripMarker.on('dblclick', e => map.removeLayer(tripMarker));
          return tripMarker;
        }
      }).addTo(map);
      Trip.layered = true;
      
    } catch(err) {
      open_toast(gotWrong + " " + "while set up", 0);
    }
    globalV.tripBank.shift();
    globalV.tripBank.length <= 0 ? 
    [
      clearInterval(timeId),
      Trip.layered ? setTimeout( e => Trip.fitAfter(), 2000) : '',
      this.newRec = false
    ] : '';
  },

  showPsPopUp: function(feature, layer) {
    layer.bindPopup(Trip.makePsPopUp(feature));
  },

  showPopUp: function(feature, layer) {
    layer.bindPopup(Trip.makePopUp(feature));
  },

  makePsPopUp: function(obj) {
    let data = obj.properties;
    new Image().src = `/WebG/image/${data.phoneNo}`;
    let popContent = `
      <div class="popup-container">
        <div id="inner-popup-container">
          <div class="receiverSidePopUp">
            <img src="/WebG/image/${data.phoneNo}" alt="WebG" class="receiverSideSenderImg">
            <h6 class="receiverSideSenderName">${data.name}
            <i id="i0">Travelled on ${data.date}</i>
            <i id="i1">at time ${data.initTime}</i>
            <a id="moreInfor">More...</a>
            </h6>
          </div>
          <span id="popup-footer"></span>
        </div>
      </div>
    `;
    return L.popup({ keepInView: true, closeButton: false, offset: L.point(-1, 1) })
    .setContent(popContent);
  },
  
  makePopUp: function(obj) {
    let data = obj.properties;
    let popContent = `
    <div class="popup-container">
      <div id="inner-popup-container">
        <div class="receiverSidePopUp">
          <img src="${userPic.src}" alt="WebG" class="receiverSideSenderImg">
          <h6 class="receiverSideSenderName">${data.name}
          <i id="i0">you travelled on ${data.date}</i>
          <i id="i1">at time ${data.initTime}</i>
          <a id="moreInfor">More...</a>
          </h6>
        </div>
        <span id="popup-footer"></span>
      </div>
    </div>
    `;
    return L.popup({ keepInView: true, closeButton: false, offset: L.point(-1, 1) })
    .setContent(popContent);
  },

  show: function() {
    if (globalV.userLogIn) {
      globalV.tripBank.length === 0 && this.newRec && !InitRecording ||
      globalV.tripBank.length === 0 && this.markerDeletion && !InitRecording ? 
      socket.emit('update', { getTripRec: true }) : '';
    }

    this.tripContent.classList.add('showTripContent');
    this.trip.style.height = isMobile || isMobile && this.wx < 481 ? '110px' : 'max-content';
    this.trip.style.margin = isMobile || isMobile && this.wx < 481 ? '20px auto' : false;
  },

  hide: function() {
    this.tripContent.classList.remove('showTripContent');
    !isMobile || !isMobile && this.wx > 481 ? this.trip.style.height = '40px' :
    setTimeout(e => {
      this.trip.style.height = '40px';
      this.trip.style.margin = 'auto';
      }, 300);
    clickIndex = 1;
  },

  localKeep: function(arg) {
    arg.data.forEach( point => {
      globalV.tripBank.push(this.jsonify(point, arg));
    });
  },

  remoteKeep: function(arg) {
    arg.data.forEach( point => {
      globalV.remoteTripBank.push(this.jsonify(point, arg));
    });
  },

  jsonify: function(data, infor) {
    let coords = L.latLng(data.coords);
    this.date = infor.date;
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ coords.lat, coords.lng ]
      },
      "properties": {
        "phoneNo": `${infor.phoneNo}`,
        "name": `${data.name}`,
        "date": `${infor.date}`,
        "initTime": `${infor.initTime}`,
        "endTime": `${infor.endTime}`
      }
    }
  },

  noRecord: function(obj, text, recInit) {
    this.recInfor.style.color = '#023489';
    this.playTrip.style.color = '#023489';
    if (!obj && !recInit) {
      this.recInfor.innerHTML = "Your journey" + " " + "on" + " " + this.date;
      this.playTrip.classList.remove('bx-pause');
      this.playTrip.classList.add('bx-play');
      this.delTrip.classList.add('bx-x');
      this.markerDeletion = false;
      
    } else if (!obj && recInit) {
      this.recInfor.innerHTML = `You are currently on recording...`;
      this.recInfor.style.color = '#ff0000';
      this.playTrip.classList.remove('bx-play');
      this.delTrip.classList.remove('bx-x');
      this.playTrip.classList.add('bx-pause');
      this.playTrip.style.color = '#ff0000';
      
    } else {
      this.recInfor.innerHTML = text ? text : text == 0 ? "" : "You did'nt record any of your journey";
      this.playTrip.classList.remove('bx-play');
      this.playTrip.classList.remove('bx-pause');
      this.delTrip.classList.remove('bx-x');
    }
  }, 

  stopAllAutoMove: function() {
    Move.pausedAutoMove();
  },

  deleteMarkers: function(delOne) {
    let status;
    if (!delOne) {
      tripMarkers.length !== 0 ? [
        tripMarkers.forEach(mk => map.removeLayer(mk)),
        this.layered = false
      ] : psMarkers.length !== 0 ? psMarkers.forEach(mk => map.removeLayer(mk)) : status = 'empty';
      tripMarkers = []; // reset to empty
      psMarkers = []; // reset to empty
      return status;

    }
    return status = tripMarkers.length !== 0 || psMarkers.length !== 0 ? 
           'delete one not allowed instead all' : 'Nothing to delete';
  },

  deleteTrip: function() {
    socket.emit('delTrip', );
    Trip.deleteMarkers();
    globalV.tripBank = [];
  }

}

Trip.trip.addEventListener('click', cl => {
  clickIndex++;
  if (clickIndex % 2 === 0) {
    Trip.show();
    Trip._isConnected && !InitRecording ? Trip.noRecord(false, null, false) : 
    InitRecording ? Trip.noRecord(false, null, true) : 
    globalV.tripBank.length === 0 && !Trip.layered ? 
    Trip.noRecord(true) : Trip.noRecord(false);
  } else {
    Trip.hide();
  }
});

Trip.playTrip.addEventListener('click', cl => {
  if (!globalV.defaultFrndToInteract && !Trip.layered) {
    closeSettingPanel();
    Trip.stopAllAutoMove();
    setTimeout(() => {
      Trip.hasRecord();
      Trip.hide();
    }, 1000);

  } else if (!globalV.defaultFrndToInteract && Trip.layered) {
    Trip.noRecord('blocked', "Aleady read your trip data");
    setTimeout(e => Trip.noRecord(false), 3000);

  } else {
    Trip.noRecord('blocked', "Unable to read your trip data while connected"),
    Trip._isConnected = true;
  }
  cl.stopPropagation();
});

Trip.delTrip.addEventListener('click', cl => {
  Trip.deleteTrip();
  setTimeout(() => {
    closeSettingPanel();
    Trip.hide();
  }, 1000);
  cl.stopPropagation();
});

// In case of shown|openned
menu.onclick = cl => Trip.hide();

function showWidth() {
  readOut(window.innerWidth, window.innerHeight)
}
showWidth()