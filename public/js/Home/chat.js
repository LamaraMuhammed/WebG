// var connected = false;
// var chatPanelOpened = false;
// const chatContainer = document.querySelector(".Chat_Section");
// const chatSection = document.querySelector(".chatSection");

// // Panel Of friends Been Connected
// var mobileFrndsBottomPanel = document.querySelector(".friends");
// var showFrndContainer = document.getElementById("showFrndContainer");
// var closeFrndPanel = document.querySelector("#closeFrndPanel");
// var firstSelectedPerson = document.querySelector(".firstFriend");
// var secondSelectedPerson = document.querySelector(".secondFriend");
// var thirdSelectedPerson = document.querySelector(".thirdFriend");
// var firstCheckedFriend = document.querySelector("#firstCheckedFriend");
// var secondCheckedFriend = document.querySelector("#secondCheckedFriend");
// var thirdCheckedFriend = document.querySelector("#thirdCheckedFriend");

// var selectedFrndHeaderImg = document.querySelector("#headerSelectedFrndImg");
// var firstFriendImg = document.querySelector("#firstFriendImg"); 
// var secondFriendImg = document.querySelector("#secondFriendImg");
// var thirdFriendImg = document.querySelector("#thirdFriendImg");

// var firstFriendName = document.querySelector("#firstFriendName");
// var secondFriendName = document.querySelector("#secondFriendName");
// var thirdFriendName = document.querySelector("#thirdFriendName");

// var myCheckBox = document.querySelector("#myCheckBox");
// var chatNote = document.querySelector("#chatNote");
// // var myCheckBox = document.querySelector(".toggle");
// var toggle = false;

// var msgInput = document.querySelector(".msgInput"); 
// var input = document.querySelector("#msgInput"); 
// var sendButton = document.querySelector("#sendBtn"); 
// var friends = document.querySelector(".friends"); 
// var messageContainer  = document.querySelector(".msgContainer");

// // On Mobile View this showFrndContainer btn will appear and when clicked the frnds panel will appear from bottom to mid-top
// var showFrndContainerCounter = 0;
// showFrndContainer.addEventListener("click", () => {
//     showFrndContainerCounter ++;
//     mobileFrndsBottomPanel.classList.add("showFrndContainer");
//     msgInput.classList.add("hideMsgInput");
//     if (showFrndContainerCounter === 1) {
//         firstCheckedFriend.classList.add("defaultFrnd");
//     }

// });

// closeFrndPanel.addEventListener("click", () => {
//     closePanel();
// });
// //  if mobileFrndsBottomPanel is shown when chatContainer touch will hide
// messageContainer.addEventListener("click", () => {
//     closePanel();
// });

// // Select All to chat
// myCheckBox.addEventListener("click", (e) => {
//     if (e.target['checked'] === true) {
//         firstCheckedFriend.classList.add("showselectedFriend");
//         secondCheckedFriend.classList.add("showselectedFriend");
//         thirdCheckedFriend.classList.add("showselectedFriend");
//         selectedFrndHeaderImg.src = "/WebG/image/self";
//         globalV.defaultFrndToInteract = 'All';
//         toggle = true;
//     } else {
//         firstCheckedFriend.classList.remove("showselectedFriend");
//         secondCheckedFriend.classList.remove("showselectedFriend");
//         thirdCheckedFriend.classList.remove("showselectedFriend");
//         selectedFrndHeaderImg.src = "/WebG/image/self";
//         firstCheckedFriend.classList.remove("defaultFrnd");
//         globalV.defaultFrndToInteract = undefined;
//         toggle = false;
//     }
// })

// // select a Friend to chat and get started 
// firstSelectedPerson.addEventListener('click', () => {
//     if (toggle !== true) {
//         firstCheckedFriend.classList.add("showselectedFriend");
//         selectedFrndHeaderImg.src = firstFriendImg.src;
//         globalV.defaultFrndToInteract = 'first';

//         secondCheckedFriend.classList.remove("showselectedFriend");
//         thirdCheckedFriend.classList.remove("showselectedFriend");
//     }
// });
// secondSelectedPerson.addEventListener('click', () => {
//     if (toggle !== true) {
//         secondCheckedFriend.classList.add("showselectedFriend");
//         selectedFrndHeaderImg.src = secondFriendImg.src;
//         globalV.defaultFrndToInteract = 'second';

//         firstCheckedFriend.classList.remove("showselectedFriend");
//         thirdCheckedFriend.classList.remove("showselectedFriend");
//         firstCheckedFriend.classList.remove("defaultFrnd");
//     }
    
// });
// thirdSelectedPerson.addEventListener('click', () => {
//     if (toggle !== true) {
//         thirdCheckedFriend.classList.add("showselectedFriend");
//         selectedFrndHeaderImg.src = thirdFriendImg.src;
//         globalV.defaultFrndToInteract = 'third';

//         firstCheckedFriend.classList.remove("showselectedFriend");
//         secondCheckedFriend.classList.remove("showselectedFriend");
//         firstCheckedFriend.classList.remove("defaultFrnd");
//     }
    
// });

// var renderMsg = (txt, type) => {

//     let className = "senderMsg";
//     let timeClass = "senderTime";
//     let logoClass = "senderLogo";
//     let time = 250;
//     if (type !== 'self') {
//         className = "receiverMsg";
//         timeClass = "time";
//         logoClass = "receiverLogo";
//         time = 0;
//     }

//     const msgEle = document.createElement("div");
//     const timeLine = document.createElement("p");
//     // const logoEle = document.createElement("div");
//     const txtNode = document.createTextNode(txt);

//     timeLine.innerHTML = new Date().toLocaleTimeString();
//     timeLine.classList.add(timeClass);
//     msgEle.append(txtNode);
//     msgEle.append(timeLine);
//     msgEle.classList.add(className);
//     // logoEle.classList.add(logoClass);
//     setTimeout(() => {
//         messageContainer.append(msgEle);
//     }, time);
// }

// const setScrollPosition = () => {
//     if (chatSection.scrollHeight > 620) {
//         chatSection.scrollTop = messageContainer.scrollHeight;
//     }
// }
// // Navigation Button to Home Page,
// const navButton = document.getElementById("nav");
// navButton.addEventListener("click", () => {
//     chatPanelOpened = false;
//     showHomeContent();    
// });

// function showHomeContent(){
//     let delayTime = [500, 1000, 800, 600, 700, 900, 500, 300, 400, 200, 1100, 150, 250],
//     timeInterval = delayTime[Math.floor(Math.random() * delayTime.length)];
//     chatContainer.style.display = "none";
//     checkedButton(setColor, unSetColor, unSetColor, unSetColor, unSetColor);
//     closePanel(); // closing the panel if opened
//     setTimeout(() => {
//         homeContentSection.style.display = "block";
//         footer.style.display = "block";
//         boardContainer.style.opacity = '1';
//     }, timeInterval);
// } 

// function closePanel() {
//     mobileFrndsBottomPanel.classList.remove("showFrndContainer");
//     msgInput.classList.remove("hideMsgInput");
// }

// // Load friends profile .
// function loadFrndProfile(route, image, name) {
//     if (route === 'first') {
//         firstFriendImg.src = image;
//         firstFriendName.innerHTML = name;
//         firstSelectedPerson.style.display = "flex";
//         firstCheckedFriend.classList.add("defaultFrnd");
//         selectedFrndHeaderImg.style.display = 'block';
//         selectedFrndHeaderImg.src = firstFriendImg.src;

//     } else if (route === 'second') {
//         secondFriendImg.src = image;
//         secondFriendName.innerHTML = name;
//         secondSelectedPerson.style.display = "flex";

//     } else if (route === 'third') {
//         thirdFriendImg.src = image;
//         thirdFriendName.innerHTML = name;
//         thirdSelectedPerson.style.display = "flex";
//     }

// }

// function disconnectProfile(route) {
//     if (route === 'first') {
//         firstFriendImg.src = '';
//         firstFriendName.innerHTML = '';
//         firstSelectedPerson.style.display = "none";
//         if (secondRoute === false && thirdRoute === false) {
//             selectedFrndHeaderImg.style.display = 'none';
//             showDefaultChatMsg(true);

//         } else if (secondRoute === false && thirdRoute !== false || secondRoute !== false && thirdRoute === false) {
//             selectedFrndHeaderImg.style.display = 'block';
//             resetDefaultChatMsg('newConn');
            
//         } else if (secondRoute !== false && thirdRoute !== false) {
//             selectedFrndHeaderImg.style.display = 'block';
//             resetDefaultChatMsg('second');

//         }

//     } else if (route === 'second') {
//         secondFriendImg.src = '';
//         secondFriendName.innerHTML = '';
//         secondSelectedPerson.style.display = "none";
//         if (firstRoute === false && thirdRoute === false) {
//             selectedFrndHeaderImg.style.display = "none";
//             showDefaultChatMsg(true);

//         } else if (firstRoute === false && thirdRoute !== false || firstRoute !== false && thirdRoute === false) {
//             selectedFrndHeaderImg.style.display = "block";
//             resetDefaultChatMsg('newConn');
            
//         } else if (firstRoute !== false && thirdRoute !== false) {
//             selectedFrndHeaderImg.style.display = "block";
//             resetDefaultChatMsg(route);
//         }

//     } else if (route === 'third') {
//         thirdFriendImg.src = '';
//         thirdFriendName.innerHTML = '';
//         thirdSelectedPerson.style.display = "none";
//         if (firstRoute === false && secondRoute === false) {
//             selectedFrndHeaderImg.style.display = "none";
//             showDefaultChatMsg(true);

//         } else if (firstRoute === false && secondRoute !== false || firstRoute !== false && secondRoute === false) {
//             selectedFrndHeaderImg.style.display = "block";
//             resetDefaultChatMsg('newConn');
            
//         } else if (firstRoute !== false && secondRoute !== false) {
//             selectedFrndHeaderImg.style.display = "block";
//             resetDefaultChatMsg();

//         }
//     }

// }

// function showDefaultChatMsg(disconnection) {
//     if (connected !== true || disconnection === true) {
//         myCheckBox.style.display = "none";
//         chatNote.innerHTML = "All your connected friends will be here";
//         chatNote.classList.add("chatNoteMsg");
//     }
// }
// function resetDefaultChatMsg(route) {
//     if (route === 'second' || route === 'third') {
//         myCheckBox.style.display = "flex";
//         chatNote.innerHTML = `<i>Click on the friend you want to chat, or<br> Toggle all by clicking on the right  hand coner</i> &nbsp;&nbsp;--<span id="arrow">&triangleright;</span>`;
//         chatNote.classList.remove("chatNoteMsg");

//     } else if (route === 'newConn') {
//         myCheckBox.style.display = "none";
//         chatNote.innerHTML = `<i>You're connected!</i>`;
//         chatNote.classList.remove("chatNoteMsg");

//     } else {
//         myCheckBox.style.display = "none";
//         chatNote.innerHTML = `<i>You're now connected!</i>`;
//         chatNote.classList.remove("chatNoteMsg");
//     }
// }
