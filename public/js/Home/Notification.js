
import { socket } from "./sub_main.js";

const outerContainer = document.querySelector(".outerContainer");
const semiContainer = document.createElement("div");
const innerContainer = document.createElement("div");


notification.addEventListener("click", () => {
    if (globalV.disabledAll !== true  && globalV.userLogIn) {
        socket.emit('update', 'isAny');
    }
});

socket.on("notifie", (note) => {
    if (!note.new && !note.del) {
        let e = note.notifie;
        addNotification(e[1], e[0], `You are honored and trust by ${e[0]} been added you in closeWatch.`, e[2], note.index);
        notificationAlert();

    } else if (note.del) {
        removedNotifie(note.del);
    
    } else {
        notificationAlert();
    }

});

document.getElementById("NTnav").addEventListener("click", () => {
    showHomeContent();
    notificationPanelOpened = false;
});
document.querySelector(".newReqAlert").addEventListener("click", () => {
    showHomeContent();
    notificationPanelOpened = false;
});

function showHomeContent(){
    let delayTime = [500, 1000, 800, 600, 700, 900, 500, 300, 400, 200, 950, 150, 250],
    timeInterval = delayTime[Math.floor(Math.random() * delayTime.length)];

    document.getElementById("NotificationContainer").style.display = "none";
    notificationAlert('hide');

    setTimeout(() => {
        showHome(true);
    }, timeInterval);
}

var addNotification = (imgUrl, name, msg, _time, index) => {
    let noteDetails = document.createElement('div'), 
        img = document.createElement('img'), 
        nameNodeTxt = document.createElement('h5'),
        msgNodeTxt = document.createElement('p'),
        timeNodeTxt = document.createElement('span');
        
        img.src = `/WebG/image/${imgUrl}`;
        img.id = index;
        nameNodeTxt.innerHTML = name;
        nameNodeTxt.id = index;
        msgNodeTxt.innerHTML = msg;
        msgNodeTxt.id = index;
        timeNodeTxt.innerHTML = _time;
        timeNodeTxt.id = index;
        
        noteDetails.append(img);
        noteDetails.append(nameNodeTxt);
        noteDetails.append(msgNodeTxt);
        noteDetails.append(timeNodeTxt);
        noteDetails.classList.add("noteDetails");
        noteDetails.style.backgroundColor = '#' + (Math.random() * 0xFFFFFF<<0).toString(16);
        noteDetails.id = index;
        
        innerContainer.classList.add("innerContainer");
        innerContainer.append(noteDetails);
        
        semiContainer.classList.add("semiContainer");
        semiContainer.append(innerContainer);

        outerContainer.append(semiContainer);
        
        noteDetails.addEventListener('click', cl => {
            let id = cl.target.id;
            document.getElementById(id).style.display = 'none';
            socket.emit('delNotifie', id === 'one' ? 0 : id );
        });

}

function generateColor() {
    const r = Math.floor(Math.random() * (256 - 1)) + 1, 
          g = Math.floor(Math.random() * (256 - 1)) + 1,
          b = Math.floor(Math.random() * (256 - 1)) + 1;
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

var count = 0;
var removedNotifie = (delRow) => {
    let noteDetails = document.createElement('div'), 
        msgNodeTxt = document.createElement('p');
        count++;
        
        msgNodeTxt.innerHTML = "You got removed from the person been added you, get comfort";
        msgNodeTxt.id = `del${count}`;
        
        noteDetails.append(msgNodeTxt);
        noteDetails.classList.add("noteDetails");
        noteDetails.style.backgroundColor = generateColor();
        noteDetails.id = `del${count}`;

        document.getElementById(delRow).style.display = 'none';
        
        innerContainer.classList.add("innerContainer");
        innerContainer.append(noteDetails);
        
        semiContainer.classList.add("semiContainer");
        semiContainer.append(innerContainer);

        outerContainer.append(semiContainer);
        
        noteDetails.addEventListener('click', cl => {
            let id = cl.target.id;
            document.getElementById(id).style.display = 'none';

        });

}
