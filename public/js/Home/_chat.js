var connected = false;
var chatPanelOpened = false;
var notificationPanelOpened = false;
var toggle = false;

const chatContainer = document.querySelector(".Chat_Section");
const chatSection = document.querySelector(".chatContainer");

var scroller = document.querySelector(".scroller");
var chatInput = document.getElementById("msgInput"); 
var sendButton = document.getElementById("sendBtn"); 

var showFrndContainer = document.getElementById("showFrndContainer");
var room = document.querySelector(".room");    // Panel Of friends Been Connected

var firstSelectedPerson = document.querySelector(".firstF");
var secondSelectedPerson = document.querySelector(".secondF");
var thirdSelectedPerson = document.querySelector(".thirdF");
var firstCheckedFriend = document.querySelector("#firstCheckedFriend");
var secondCheckedFriend = document.querySelector("#secondCheckedFriend");
var thirdCheckedFriend = document.querySelector("#thirdCheckedFriend");

var selectedFrndHeaderImg = document.querySelector("#headerSelectedFrndImg");
var firstFriendImg = document.querySelector("#firstFriendImg"); 
var secondFriendImg = document.querySelector("#secondFriendImg");
var thirdFriendImg = document.querySelector("#thirdFriendImg");

var firstFriendName = document.querySelector("#firstFriendName");
var secondFriendName = document.querySelector("#secondFriendName");
var thirdFriendName = document.querySelector("#thirdFriendName");
var myCheckBox = document.querySelector("#myCheckBox");
var chatNote = document.querySelector("#chatNote");

// On Mobile View this showFrndContainer btn will appear and when clicked the frnds panel will appear from bottom to mid-top
var displayCounter = 1;
showFrndContainer.addEventListener("click", () => showPanel());
scroller.addEventListener("click", () => closePanel());
chatInput.addEventListener("click", () => closePanel());

// Select All to chat
myCheckBox.addEventListener("click", (e) => {
    if (e.target['checked'] === true) {
        toggleSellection();
        selectedFrndHeaderImg.src = "/WebG/image/self";
        globalV.defaultFrndToInteract = 'All';
        toggle = true;

    } else {
        toggleSellection("remove");
        selectedFrndHeaderImg.src = "/WebG/image/self";
        firstCheckedFriend.classList.remove("defaultFrnd");
        globalV.defaultFrndToInteract = undefined;
        toggle = false;
    }
})

// select a Friend to chat and get started 
firstSelectedPerson.addEventListener('click', () => {
    if (toggle !== true) {
        toggleSellection(1);
        selectedFrndHeaderImg.src = firstFriendImg.src;
        globalV.defaultFrndToInteract = 'first';
    }
});
secondSelectedPerson.addEventListener('click', () => {
    if (toggle !== true) {
        toggleSellection(2);
        selectedFrndHeaderImg.src = secondFriendImg.src;
        globalV.defaultFrndToInteract = 'second';
        firstCheckedFriend.classList.remove("defaultFrnd");

    }
    
});
thirdSelectedPerson.addEventListener('click', () => {
    if (toggle !== true) {
        toggleSellection(3);
        selectedFrndHeaderImg.src = thirdFriendImg.src;
        globalV.defaultFrndToInteract = 'third';

        firstCheckedFriend.classList.remove("defaultFrnd");
    }
    
});

function showPanel() {
    displayCounter ++;
    if (displayCounter % 2 === 0) {
        showFrndContainer.classList.remove("bx-chevrons-up"),
        showFrndContainer.classList.add("bx-chevrons-down"),
        room.classList.add("openRoom");
        setTimeout(e => {
            scroller.classList.add("blur");
        }, 200);

    } else {
        closePanel();
    }

    if (displayCounter === 2) {
        firstCheckedFriend.classList.add("defaultFrnd");
    }
}

function closePanel() {
    room.classList.remove("openRoom");
    showFrndContainer.classList.remove("bx-chevrons-down");
    showFrndContainer.classList.add("bx-chevrons-up");
    scroller.classList.remove("blur");
    displayCounter > 2 ? displayCounter = 3 : false;
}

function toggleSellection(route) {
    if (route) {
        route === 1 ? firstCheckedFriend.classList.add("showselectedFriend") :
        firstCheckedFriend.classList.remove("showselectedFriend");

        route === 2 ? secondCheckedFriend.classList.add("showselectedFriend") :
        secondCheckedFriend.classList.remove("showselectedFriend");

        route === 3 ? thirdCheckedFriend.classList.add("showselectedFriend") :
        thirdCheckedFriend.classList.remove("showselectedFriend");

    } else {
        firstCheckedFriend.classList.add("showselectedFriend");
        secondCheckedFriend.classList.add("showselectedFriend");
        thirdCheckedFriend.classList.add("showselectedFriend");
    }

}

var childClassName;
function renderMessage(txt, remoteUserName, remoteUserImg) {
    let child = document.createElement('div');
    let shape = document.createElement('div');
    let msgPara = document.createElement('p');
    let time = document.createElement('div');
    let small = document.createElement('small');

    msgPara.innerHTML = txt
    small.innerHTML = new Date().toLocaleTimeString();
    time.className = "time";
    time.appendChild(small);
    shape.className = "shape";
    shape.appendChild(msgPara);
    shape.appendChild(time);
    
    if (remoteUserName) {
        childClassName = "child remote";
        let logo = document.createElement('div');
        let img = document.createElement("img");
        let msgBody = document.createElement("div");
        let h6 = document.createElement("h6");

        img.src = remoteUserImg;
        logo.className = "logo";
        logo.appendChild(img);

        h6.innerHTML = remoteUserName
        msgBody.className = "msgBody";
        msgBody.appendChild(h6);
        msgBody.appendChild(shape)

        child.appendChild(logo);
        child.appendChild(msgBody);
        
    } else {
        childClassName = "child local";
        child.appendChild(shape);
    }
    
    child.className = childClassName;
    scroller.appendChild(child);

    setScrollPosition();

}

function setScrollPosition() {
    if (scroller.scrollHeight) {
        scroller.scrollTop = scroller.scrollHeight;
    }
}

const navButton = document.getElementById("nav");
navButton.addEventListener("click", () => {
    chatPanelOpened = false;
    showHomeContent();    
});
document.querySelector(".newReqAlert").addEventListener("click", () => {
    chatPanelOpened = false;
    showHomeContent();    
});

function showHomeContent(){
    let delayTime = [500, 1000, 800, 600, 700, 900, 500, 300, 400, 200, 1100, 150, 250],
    timeInterval = delayTime[Math.floor(Math.random() * delayTime.length)];
    chatContainer.style.display = "none";
    checkedButton(setColor, unSetColor, unSetColor, unSetColor, unSetColor);
    closePanel(); // closing the panel if opened
    setTimeout(() => {
        showHome(true);
    }, timeInterval);
} 

// Load friends profile .
function loadFrndProfile(route, image, name) {
    if (route === 'first') {
        firstFriendImg.src = image;
        firstFriendName.innerHTML = name;
        firstSelectedPerson.style.display = "flex";
        firstCheckedFriend.classList.add("defaultFrnd");
        selectedFrndHeaderImg.style.display = 'block';
        selectedFrndHeaderImg.src = firstFriendImg.src;

    } else if (route === 'second') {
        secondFriendImg.src = image;
        secondFriendName.innerHTML = name;
        secondSelectedPerson.style.display = "flex";

    } else if (route === 'third') {
        thirdFriendImg.src = image;
        thirdFriendName.innerHTML = name;
        thirdSelectedPerson.style.display = "flex";
    }

}

function disconnectProfile(route) {
    if (route === 'first') {
        firstFriendImg.src = '';
        firstFriendName.innerHTML = '';
        firstSelectedPerson.style.display = "none";
        if (secondRoute === false && thirdRoute === false) {
            selectedFrndHeaderImg.style.display = 'none';
            showDefaultChatMsg(true);

        } else if (secondRoute === false && thirdRoute !== false || secondRoute !== false && thirdRoute === false) {
            selectedFrndHeaderImg.style.display = 'block';
            resetDefaultChatMsg('newConn');
            
        } else if (secondRoute !== false && thirdRoute !== false) {
            selectedFrndHeaderImg.style.display = 'block';
            resetDefaultChatMsg('second');

        }

    } else if (route === 'second') {
        secondFriendImg.src = '';
        secondFriendName.innerHTML = '';
        secondSelectedPerson.style.display = "none";
        if (firstRoute === false && thirdRoute === false) {
            selectedFrndHeaderImg.style.display = "none";
            showDefaultChatMsg(true);

        } else if (firstRoute === false && thirdRoute !== false || firstRoute !== false && thirdRoute === false) {
            selectedFrndHeaderImg.style.display = "block";
            resetDefaultChatMsg('newConn');
            
        } else if (firstRoute !== false && thirdRoute !== false) {
            selectedFrndHeaderImg.style.display = "block";
            resetDefaultChatMsg(route);
        }

    } else if (route === 'third') {
        thirdFriendImg.src = '';
        thirdFriendName.innerHTML = '';
        thirdSelectedPerson.style.display = "none";
        if (firstRoute === false && secondRoute === false) {
            selectedFrndHeaderImg.style.display = "none";
            showDefaultChatMsg(true);

        } else if (firstRoute === false && secondRoute !== false || firstRoute !== false && secondRoute === false) {
            selectedFrndHeaderImg.style.display = "block";
            resetDefaultChatMsg('newConn');
            
        } else if (firstRoute !== false && secondRoute !== false) {
            selectedFrndHeaderImg.style.display = "block";
            resetDefaultChatMsg();

        }
    }

}

function showDefaultChatMsg(disconnection) {
    if (connected !== true || disconnection === true) {
        myCheckBox.style.display = "none";
        chatNote.innerHTML = "All your connected friends will be here";
        chatNote.classList.add("chatNoteMsg");
    }
}

function resetDefaultChatMsg(route) {
    if (route === 'second' || route === 'third') {
        chatNote.classList.remove("chatNoteMsg");
        chatNote.innerHTML = `Click on the friend you want to chat or toggle all by clicking on the right  hand coner button.`;
        myCheckBox.style.display = "flex";

    } else if (route === 'newConn') {
        myCheckBox.style.display = "none";
        chatNote.innerHTML = `You're connected.`;
        chatNote.classList.remove("chatNoteMsg");

    } else {
        myCheckBox.style.display = "none";
        chatNote.innerHTML = `You're now connected.`;
        chatNote.classList.remove("chatNoteMsg");
    }
}

// default Quick msg
function quickMsgNote(route, sender, msg) {
    if (route === 'first') {
        let Msg = `${sender} says ${msg}`;
        defaultQuickMsg1.style.display = 'flex';
        defaultQuickMsg1.classList.remove("defaultMsg");
        defaultQuickMsg1.innerHTML = Msg;
        buddiesPanelMsgLocalStorage.msg1.push(Msg);
        isDefaultQuickMsg1 = true;

        defaultQuickMsg2.style.display = 'none';
        defaultQuickMsg3.style.display = 'none';
        
    } else if (route === 'second') {
        let Msg = `${sender} says ${msg}`;
        defaultQuickMsg2.style.display = 'flex';
        defaultQuickMsg2.classList.remove("defaultMsg");
        defaultQuickMsg2.innerHTML = Msg;
        buddiesPanelMsgLocalStorage.msg2.push(Msg);
        isDefaultQuickMsg2 = true;

        defaultQuickMsg1.style.display = 'none';
        defaultQuickMsg3.style.display = 'none';
        
    } else if (route === 'third') {
        let Msg = `${sender} says ${msg}`;
        defaultQuickMsg3.style.display = 'flex';
        defaultQuickMsg3.classList.remove("defaultMsg");
        defaultQuickMsg3.innerHTML = Msg;
        buddiesPanelMsgLocalStorage.msg3.push(Msg);
        isDefaultQuickMsg3 = true;

        defaultQuickMsg1.style.display = 'none';
        defaultQuickMsg2.style.display = 'none';

    } 
}

function defaultMsgNote(route) {
    if(route === 'first') {
        if (isDefaultQuickMsg1 !== true) {
            defaultQuickMsg1.style.display = 'flex';
            defaultQuickMsg1.classList.add("defaultMsg");
            defaultQuickMsg1.innerHTML = defaultMsg;
            
            defaultQuickMsg2.style.display = 'none';
            defaultQuickMsg3.style.display = 'none';
    
        } else {
            defaultQuickMsg1.style.display = 'flex';
            buddiesPanelMsgLocalStorage.msg1.forEach((element, index) => {
                if (index == 0) {
                    defaultQuickMsg1.innerHTML = element;
                } else {
                    defaultQuickMsg1.innerHTML = element + "...";
                }
            });
    
            defaultQuickMsg2.style.display = 'none';
            defaultQuickMsg3.style.display = 'none';
            
        }
        
    } else if (route === 'second') {
        if (isDefaultQuickMsg2 !== true) {
            defaultQuickMsg2.style.display = 'flex';
            defaultQuickMsg2.classList.add("defaultMsg");
            defaultQuickMsg2.innerHTML = defaultMsg;
            
            defaultQuickMsg1.style.display = 'none'
            defaultQuickMsg3.style.display = 'none'
            
        } else {
            defaultQuickMsg2.style.display = 'flex';
            buddiesPanelMsgLocalStorage.msg2.forEach((element, index) => {
                if (index == 0) {
                    isDefaultQuickMsg2.innerHTML = element;
                } else {
                    defaultQuickMsg2.innerHTML = element + "...";
                }
            });

            defaultQuickMsg1.style.display = 'none';
            defaultQuickMsg3.style.display = 'none';
            
        }
        
    } else if (route === 'third') {
        if (isDefaultQuickMsg3 !== true) {
            defaultQuickMsg3.style.display = 'flex';
            defaultQuickMsg3.classList.add("defaultMsg");
            defaultQuickMsg3.innerHTML = defaultMsg;
            
            defaultQuickMsg1.style.display = 'none'
            defaultQuickMsg2.style.display = 'none'
            
        } else {
            defaultQuickMsg3.style.display = 'flex';
            buddiesPanelMsgLocalStorage.msg3.forEach((element, index) => {
                if (index == 0) {
                    defaultQuickMsg3.innerHTML = element;
                } else {
                    defaultQuickMsg3.innerHTML = element + "...";
                }
            });

            defaultQuickMsg1.style.display = 'none';
            defaultQuickMsg2.style.display = 'none';
            
        }

    } else {
        defaultQuickMsg1.classList.add("defaultMsg");
        defaultQuickMsg1.innerHTML = defaultMsg;
        defaultQuickMsg1.style.display = 'flex';

        defaultQuickMsg2.classList.add("defaultMsg");
        defaultQuickMsg2.innerHTML = defaultMsg;
        defaultQuickMsg2.style.display = 'flex';

        defaultQuickMsg3.classList.add("defaultMsg"); 
        defaultQuickMsg3.innerHTML = defaultMsg;
        defaultQuickMsg3.style.display = 'flex';

        buddiesPanelMsgLocalStorage.reset();
    }
}