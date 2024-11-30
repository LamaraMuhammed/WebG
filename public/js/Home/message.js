import { socket } from "./sub_main.js";
import { close_shareLoc_popup } from "./request.js";

var controlKey;

// When enter key pressed
chatInput.addEventListener("click", () => {
    chatInput.addEventListener("keydown", e => e.keyCode === 17 ? controlKey = e.keyCode : false );
    chatInput.addEventListener("keyup", e => {
        e.keyCode === 17 ? controlKey = null : false;
        let controlPlusEnterKey = controlKey && e.keyCode === 13;

        chatInput.style.border = "";
        if (chatInput.value.length <= 350) {
            if (controlPlusEnterKey) {
                sendMessage();
                chatInput.focus();
            }
        } else {
            chatInput.style.border = "2px solid red";
        }
        
    });

});

// When button clicked txt msg will send
sendButton.addEventListener("click", e => sendMessage());

const space = /\s{1,}/g; //<< just look for a white space of 1st index.
function sendMessage() {
    if (chatInput.value && chatInput.value.length <= 350) {
        if(globalV.defaultFrndToInteract) {
            renderMessage(chatInput.value); //Render on Screen
            sendToRemoteFrnd(chatInput.value.replace(space, ' ')); // To friend
            chatInput.value = "";

        } else {
            open_toast('Select a friend to start chatting.')
        }
    } 
    
}

socket.on("incomingMsg", (msg) => {
    if (msg.route === 'first') {
        renderMessage(msg.reply, msg.name, firstFriendImg.src);
        
    } else if (msg.route === 'second') {
        renderMessage(msg.reply, msg.name, secondFriendImg.src);
        
    } else if (msg.route === 'third') {
        renderMessage(msg.reply, msg.name, thirdFriendImg.src);
    }

    show_frndMsgIcon(msg.route)
    quickMsgNote(msg.route, msg.name, msg.reply);

});

function sendToRemoteFrnd(msg) {
    socket.emit("chat", { route: globalV.defaultFrndToInteract, msg: msg });
}

chat.addEventListener("click", () => {
    close_shareLoc_popup(true); 
});
