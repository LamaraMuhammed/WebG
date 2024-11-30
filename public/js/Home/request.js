import { socket, waitResponse, removeWaitResponse } from "./sub_main.js";
import { utils } from "../utilities.js";

const accept = document.getElementById("accept");
const reject = document.getElementById("reject");

var routeOneSet = false;
var routeTwoSet = false;
var routeThreeSet = false;
var requester = [];
var requested = [];
var phone_number, countReq = 0;

var requestLocalStorage = { store: [] }

socket.on('closeWatch', (msg) => {
    close_shareLoc_popup(true);
});

var message;
socket.on('request', (msg) => {
    requestLocalStorage.store.push(msg);
    let sender = requestLocalStorage.store[0];
    displayRequestPopUp(sender); // displayRequestPopUp i.e as browser confirm popup, listening user res for connection to share loc.
    message = sender; // passing arguement to res btn

});

accept.addEventListener('click', e => {
    socket.emit('confirm-to-share', { message, res: true });
    validLifeTimeOfConfirmationPopup(true, true);
    closeWB();
    
});

reject.addEventListener("click", res => {
    socket.emit('confirm-to-share', { message, res: false });
    validLifeTimeOfConfirmationPopup(true, true);
    closeWB()
});

socket.on('stopQuery', (msg) => {
    if (msg.route === 'first') {
      routeOneSet = msg.value;
      
    } else if (msg.route === 'second') {
        routeTwoSet = msg.value;
        
    } else if(msg.route === 'third') {
        routeThreeSet = msg.value;
    }
    
  });

socket.on('requester', (msg) => {
    waitAbit(msg.wait)
    restoreBack();
    if(msg.request === true) {
        requester.push(msg.remainder);
        
    } else {
        requester.forEach(id => removeWaitResponse(id));
        let filtered = requester.filter(x => x !== msg.remainder);
        requester = filtered;

    }
});

function waitAbit(m) {
    if (m) {
        countReq++;
        waitResponse(countReq, m);
    }
}

socket.on('requested', (msg) => {
    if(msg.request === true) {
        requested.push(msg.remainder)

    } else {
        let filtered = requested.filter(x => x !== msg.remainder);
        requested = filtered;
    }

});

// When Gotten Err From Server
socket.on("serverSideErr", errMsg => open_toast(errMsg));
socket.on("warning", msg => {
    let txt = msg.decline ? msg.decline + " " + "declined your request." : msg;
    open_toast(txt, 0);
    removeWaitResponse(msg.decline);
    restoreBack(true);  // Restore Back Phone Number 

    let ps = document.getElementById("psInput");
    if (globalV.ps && ps) {
        ps.value = globalV.ps.toString()
        ps.style.border = msg.includes('Invalid') ? errColor : "";
        document.getElementById('psConn').innerHTML = 'Connect';
        globalV.isPsReq = false;

    }
});

// shareLoc-popup, Analization of Input Field
const shareLoc_popup = document.querySelector(".shareLoc-popup");
const shareLocInput = document.querySelector(".shareLocInput");
const numberRegex = /^[0-9]+$/; //Extracting number in string

var okColor = "2px solid rgb(2, 250, 2)", errColor =  "2px solid rgb(211, 7, 7)",
shareLocClick_Count = 1,
timeToFade = 15000,
ids = [];

var shareLoc = document.getElementById("shareLoc"), // Share Location Button will open the shareLoc-popup
    phoneNo = document.getElementById("shr-phNo"),
    label = document.getElementById("shr-lbl"),
    shareLocBtn = document.getElementById("shr"),
    noShareLocBtn = document.getElementById("No-shr"),
    shower = document.getElementById("shower"),
    phoneNo_col = document.querySelector(".shr-phNo"),
    psNo_col = document.querySelector(".shr-psNo"),
    selectedField = 'phoneNo', attemptCount = 0,
    showerPressCount = 1, wait = false, phone_no_Ok = false;

shareLoc.addEventListener("click", e => {
    if (!globalV.disabledAll) {
        shareLocClick_Count++;
        if (shareLocClick_Count % 2 === 0) {
            checkedButton(unSetColor, setColor, unSetColor, unSetColor, unSetColor);
            open_shareLoc_popup();
            phoneNo.value = '';
            ids.forEach( id => clearTimeout(id));
            close_shareLoc_popup_on_unFocus();
            
        } else {
            close_shareLoc_popup(true);
        }
    }
    
});

const open_shareLoc_popup = () => {
    shareLoc_popup.classList.add("open-shareLoc-popup");
    hide_buddiesPanel(1);
    hideExpandButtonItems();
    globalV.disabled = true;
};

export const close_shareLoc_popup = (direct) => {
    if (phoneNo.value.length === 0 || direct) {
        shareLoc_popup.classList.remove("open-shareLoc-popup");
        expander.style.visibility = "visible";
        footer.style.visibility = 'visible';
        shareLocClick_Count = 1;
        showerPressCount = 1;
        globalV.disabled = false;
        resetTheState();
        removePsNoInput();
    }
}

phoneNo.onchange = () => close_shareLoc_popup_on_unFocus();
phoneNo.onclick = () => ids.forEach( id => clearTimeout(id));

function close_shareLoc_popup_on_unFocus() {
    ids.push(setTimeout(() => {
        phoneNo.value.length === 0 && selectedField !== 'psNo' ? close_shareLoc_popup() : '';
    }, timeToFade));
}

shower.addEventListener('click', e => {
    showerPressCount++;
    if (showerPressCount % 2 === 0) {
        phoneNo_col.classList.add("slideLeft-phoneNo-col");
        phoneNo.value = '';
        selectedField = 'psNo';
        createPsNoInput();
        setTimeout(() => {
            shower.classList.remove("showerRight");       
            shower.classList.add("showerLeft");   
        }, 300);
        ids.forEach( id => clearTimeout(id));
        close_shareLoc_popup_on_unFocus();
        
    } else {
        phoneNo_col.classList.remove("slideLeft-phoneNo-col");
        selectedField = 'phoneNo';
        removePsNoInput();
        setTimeout(() => {
            shower.classList.add("showerRight");       
            shower.classList.remove("showerLeft");       
        }, 300);
        ids.forEach( id => clearTimeout(id));
        close_shareLoc_popup_on_unFocus();
    }
});

phoneNo.addEventListener('keyup', key => {
    let _key = key.key
    let keyCheck = _key.match(numberRegex);
    let exp_key = _key === "Backspace" || "Enter" ? true : false;
    let eleVal = phoneNo.value;
    let eleLen = eleVal.length;
    phone_no_Ok = false;
    transformNationalCode();
    if (eleLen > 0) {
        if (utils.validateSIMCode(eleVal)) {
            let testEle = numberRegex.test(eleVal);
            if (testEle && keyCheck || testEle && exp_key) {
                let numCountZeroes = {}; 
                let maxiZeroes = [];
                let numCount = {}; 
                let maxi = [];
                
                for (var char of phoneNo.value) {
                    if (char === 0) {
                        numCountZeroes[char] = (numCountZeroes[char] || 0) + 1;
                        maxiZeroes.push(numCountZeroes[char]);

                    } else {
                        numCount[char] = (numCount[char] || 0) + 1;
                        maxi.push(numCount[char]);
                    }
                }

                shareLocInput.style.border = okColor;
                let x = Math.max(...maxi) > 5, y = Math.max(...maxiZeroes) > 6;
                if (x || y) {
                    shareLocInput.style.border = errColor;
                    phone_no_Ok = false;

                } else if (utils.validateLength(eleVal) === 0) {
                    shareLocInput.style.border = errColor;
                    phone_no_Ok = false;

                } else if (utils.validateLength(eleVal) && !x || utils.validateLength(eleVal) && !y) {
                    shareLocInput.style.border = okColor;
                    transformNationalCode(true);
                    phone_no_Ok = true;
                }

            } else {
                shareLocInput.style.border = errColor;
                phone_no_Ok = false;
            }
        } else {
            shareLocInput.style.border = errColor;
            phone_no_Ok = false;
        }
    } else {
        shareLocInput.style.border = '';
    } 
});

function transformNationalCode(q) {
    if (q) {
        label.style.fontWeight = "normal";
        label.style.color = "rgb(2, 250, 2)";
    } else {
        label.style.fontWeight = "600";
        label.style.color = "";
        phone_no_Ok = false;
    }
}

phoneNo.addEventListener('change', () => {
    if (utils.validateLength(phoneNo.value)) {
        shareLocInput.style.border = okColor;
        transformNationalCode(true);
        phone_no_Ok = true;
        
    } else {
        shareLocInput.style.border = errColor;
    }
});

shareLocBtn.addEventListener("click", () => sendRequest('Share'));
noShareLocBtn.addEventListener("click", () => sendRequest('NoShare'));

function sendRequest(mode) {
    if (globalV.userLogIn) {
        if (selectedField === 'phoneNo' && !wait && phone_no_Ok) {
            if (phone_no_Ok && phoneNo.value) {
                phone_number = phoneNo.value;
                if (!routeOneSet || !routeTwoSet || !routeThreeSet) {
                    let remoteG = requester.includes(phone_number);

                    if (!remoteG) {
                        requestConnection(selectedField, mode, phone_number);
                        mode === 'Share' ? shareLocBtn.innerHTML = 'Wait...' :
                        mode === 'NoShare' ? noShareLocBtn.innerHTML = 'Wait...' : '';
                        
                        phoneNo.value = '';
                        shareLocInput.style.border = "";
                        transformNationalCode();
                        wait = true;
                        
                    } else {
                        attemptCount++;
                        phoneNo.value = phone_number;
                        mode === 'Share' ? [shareLocBtn.innerHTML = 'Wait...', setTimeout( e => shareLocBtn.innerHTML = 'ShareLoc', 700)] :
                        mode === 'NoShare' ? [noShareLocBtn.innerHTML = 'Wait...', setTimeout( e => noShareLocBtn.innerHTML = 'No ShareLoc', 700)] : '';
                        attemptCount % 2 === 0 ? setTimeout( e => open_toast(`Wait please or check connected friends list.`), 700) : '';
                    }
              
                } else {
                    open_toast("You have reached your limit.");
                }
    
            }
    
        } else if (selectedField === 'psNo') {
            if (!routeOneSet || !routeTwoSet || !routeThreeSet) {
                let x, psNo = document.getElementById("psInput");
                if (psNo.value.length === 9 && psNo.value.includes('-')) {
                    globalV.layeredPsNo.forEach( e => e === psNo.value ? x = true : x = false);
                    !globalV.isPsReq && !x ? requestConnection(selectedField, null, psNo.value) : open_toast('Already connected.');
                    psNo.value = '';
                    globalV.isPsReq = true;
    
                } else if (psNo.value.length === 0) {
                    psNo.style.border = errColor
                    return false;
    
                } else {
                    psNo.style.border = errColor
                    open_toast('Incorrect PS Number.');
                }
                
            } else {
                open_toast("You have reached your limit.");
            }
            
        }
        
    } else {
        open_toast('Log in please to share.', 0);
    }
}

//  Request A Connection With The Person U wanna
function requestConnection(type, mode, msg) {
    if (type === "phoneNo") {
        socket.emit('requestConnection',  {
          mode: mode,
          value: msg,
          time: new Date().toLocaleTimeString()
        });

    } else if (type === "psNo") {
        let psConn = document.getElementById('psConn');
        socket.emit('psNumberRequestConnection',  {
          value: msg,
          time: new Date().toLocaleTimeString()
        });
        globalV.ps = [];
        psConn.innerHTML = 'Wait...';
        globalV.ps.push(msg);
    }

}

function resetTheState() {
    phoneNo_col.classList.remove("slideLeft-phoneNo-col");
    phoneNo.value = '';
    psNo_col.classList.remove("slideLeft-psNo-col");
    shower.classList.remove("showerLeft");
    shower.classList.add("showerRight");       
}

function restoreBack(q) {
    if (phone_number) {
        phoneNo.value = q ? phone_number : "";
        shareLocBtn.innerHTML = "ShareLoc";
        noShareLocBtn.innerHTML = "No ShareLoc";
        wait = false;
    }
}

var popedUp = false;
var stop = false;

const ConfirmationBody = document.querySelector(".ConfirmationBody");
const newReqAlert = document.querySelector(".newReqAlert");
var imgTag = document.getElementById("ConfirmationImgTag");
var person = document.getElementById("person");
var timeout = document.getElementById("timeout");
var newReqTime = document.getElementById("newReqS");
var validSec = 25;
var counter = validSec;

function displayRequestPopUp(requester) {
    if (!popedUp) {
        imgTag.src = `/WebG/image/${requester.senderNo}`;
        requester.mode === 'Share' ? person.innerHTML =  requester.sender + " " + "want to share location with you." :
        person.innerHTML =  requester.sender + " " + "want to connect with you.";
        time.innerHTML = new Date().toLocaleTimeString();
        ConfirmationBody.classList.add("fadeInWBbody");
        ConfirmationBody.style.visibility = chatPanelOpened ? "hidden" : notificationPanelOpened ? "hidden" : "visible";
        timeout.innerHTML = counter + " " + "<small id='sec'>s</small>";
        stop = false;
        popedUp = true;
        
        setTimeout(() => { // Set Time To Start Animation
            ConfirmationBody.classList.add("animateWBbody");
        }, 2000);
        
        setTimeout(() => { // Start Counting when not respond for 5sec...
            validLifeTimeOfConfirmationPopup(true);
        }, 5000);

        if (chatPanelOpened) {
            aNewReq(`${counter} s`);
            
        } else if (notificationPanelOpened) {
            aNewReq(`${counter} s`);
        }

    } 
        
}

function aNewReq(t) { // This will only pop up if chat or notification panel is openned
    newReqAlert.style.display = "flex";
    newReqTime.innerHTML = t;

    newReqAlert.addEventListener('click', cl => newReqAlert.style.display = "none");
}

function validLifeTimeOfConfirmationPopup(start, stopMe) {
    if (stopMe) {
        stop = true;
    }
    if (start) {
        let id = setInterval(() => {
            counter--;
            timeout.innerHTML = counter < 10 ? `0${counter}<small id='sec'>s</small>` : counter + " " + "<small id='sec'>s</small>";
            newReqTime.innerHTML = counter < 10 ? `0${counter}s` : counter + " " + 's';
            stopMe();
        }, 1000);
        
        function stopMe() {
            if (counter === 0) {
                clearInterval(id);
                closeWB();
                newReqAlert.style.display = "none";
                
            } else if (stop) {
                clearInterval(id);
                newReqAlert.style.display = "none";
    
            }
    
        }

    }
    
}

function closeWB() {
    ConfirmationBody.classList.remove("animateWBbody");
    ConfirmationBody.style.visibility = "hidden";
    popedUp = false;

    setTimeout(() => {
        ConfirmationBody.classList.remove("fadeInWBbody");
    }, 200);

    let requesters = requestLocalStorage.store; // tcheck the length of requestLocalStorage to continues poping if listeners more than 1
    if (requesters.length > 1) {
        requesters.shift();
        setTimeout(() => {
            counter = validSec;
            if (routeOneSet === true && routeTwoSet === true && routeThreeSet === true) {
                requestLocalStorage.store = [];
                
            } else {
                displayRequestPopUp(requesters[0]);

            }

        }, 1200);

    } else if (requesters.length <= 1) {
        counter = validSec;
        requestLocalStorage.store.shift()
        requestLocalStorage.store = [];
    }
    
}

// Overridden the menu btn to close the close_shareLoc_popup if it is opened already
menu.addEventListener('click', cl => {
    close_shareLoc_popup(true);
});

function createPsNoInput() {
    let ps = document.createElement('input');
    let psConn = document.createElement('button');

    ps.type = 'text';
    ps.placeholder = "PS Number";
    ps.maxLength = '9';
    ps.id = "psInput";
    ps.addEventListener('keyup', k => psOnEnterKey(ps, k));
    ps.addEventListener('change', k => ps.style.border = ps.value.length === 9 ? okColor : errColor);

    psConn.innerHTML = "Connect";
    psConn.id = "psConn";
    psConn.addEventListener('click', e => sendRequest());

    psNo_col.appendChild(ps);
    psNo_col.appendChild(psConn);
    psNo_col.classList.add("slideLeft-psNo-col");
}

function removePsNoInput() {
    psNo_col.classList.remove("slideLeft-psNo-col");
    shareLocInput.style.border = '';
    transformNationalCode();

    if (document.getElementById("psInput")){
        setTimeout(tm => {
            psNo_col.removeChild(document.getElementById("psInput"));
            psNo_col.removeChild(document.getElementById("psConn"));
        }, 400);
    }
}

function psOnEnterKey (ele, e) {
    if (ele.value.length === 9) {
        ele.style.border = okColor;
    } else {
        ele.style.border = "";
    }

    if (e.keyCode === 13 && selectedField === 'psNo') {
        sendRequest();
    }
};

window.addEventListener('resize', e => {
    let wh = window.innerHeight;
    if (isMobile && wh <= 250) {
        wh <= 200 ? phoneNo_col.style.top = "3px" : false;
        wh <= 200 ? psNo_col.style.marginTop = "3px" : false;
        expander.style.visibility = "hidden";
        footer.style.visibility = "hidden";
    } else {
        expander.style.visibility = "visible";
        footer.style.visibility = "visible";
        wh > 200 ? phoneNo_col.style.top = '' : false;
        wh > 200 ? psNo_col.style.marginTop = '' : false;
     } 
});