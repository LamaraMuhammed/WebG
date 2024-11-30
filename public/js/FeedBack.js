const socket = io("ws://localhost:3000");
// export const socket = io('http://192.168.43.93:3000'); 

var msgContainer = document.querySelector(".msgContainer"); 
var msgInput = document.querySelector(".msgInput"); 
var textArea = document.querySelector("textarea"); 
var sendButton = document.querySelector("#sendBtn"); 
var defaultMsg = document.querySelector("._default"); 
var shape = document.querySelector(".shape"); 
var closeDefault = document.querySelector("span"); 
var isPop = true, controlKey, maxi = [];

const alphaNumeric = /^[a-zA-Z0-9]/;
var isMobile = /iPhone|iPad|iPod|Android|mobile/i.test(navigator.userAgent);

socket.on('feedback', (views) => renderMessage(views));

function sendFeedBack(text) {
    let TIME = new Date().toLocaleTimeString();
    let DATE = new Date().toLocaleDateString();
    socket.emit('myFeed', { comment: text, time: [TIME, DATE] });
    textArea.style.minHeight = "";
    textArea.style.height = "";
}

isPop ? msgContainer.classList.add("blur") : false;
closeDefault.addEventListener('click', cl => {
    msgContainer.classList.remove("blur");
    defaultMsg.style.display = 'none'; 
    msgContainer.style.overflowY = 'auto';
    isPop = false;
    setScrollPosition();
});

msgContainer.addEventListener('scroll', scroll => isPop ? msgContainer.style.overflowY = 'hidden' : false);

sendButton.addEventListener('click', cl => {
    if (!isPop) {
        let neededValue = alphaNumeric.test(textArea.value);
        let textValue = textArea.value;
        if (neededValue && (textValue.length >= 3 && textValue.length < 750)) {
            sendFeedBack(textValue);
            textArea.value = "";
            controlKey = null;
            
        } else {
            textArea.focus();  
        }
    }
    
});

function renderMessage(obj) {
    let shape = document.createElement("div");
    let image = document.createElement("img");
    let folder = document.createElement("div");
    let h6 = document.createElement("h6");
    let paraDiv = document.createElement("div");
    let para = document.createElement("p");
    let timeDiv = document.createElement("div");
    let t = document.createElement("small");
    let date = calcDate(obj.data.date);
    
    image.src = `/WebG/image/${obj.data.phoneNo}`;
    h6.innerHTML = obj.data.username;
    para.innerHTML = obj.data.comment;
    t.innerHTML = obj.data.time;
    
    shape.className = "shape";
    timeDiv.className = "time";
    
    paraDiv.appendChild(para);
    timeDiv.appendChild(t);
    
    if (obj.view) {
        let s = document.createElement("small");
        s.className = "seen";
        s.innerHTML = "seen";
        timeDiv.appendChild(s);
    } 
    
    if (sortMaxDate(date)) {
        let dateDiv = document.createElement("div");
        let dt = document.createElement("small");

        dt.innerHTML = date;
        dateDiv.className = "date";
        dateDiv.appendChild(dt);
        msgContainer.appendChild(dateDiv);
    }

    if (isMobile && (obj.data.comment.length > 400)) {
        para.style.margin = "11px auto";
    }

    folder.appendChild(h6);
    folder.appendChild(paraDiv);
    folder.appendChild(timeDiv);


    shape.appendChild(image);
    shape.appendChild(folder);
    msgContainer.appendChild(shape);

    setScrollPosition();
}

function calcDate(dt) {
    const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const DAYs = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    let toDayDate = new Date().toLocaleDateString();

    let dateA = new Date(dt);
    let previousDay = DAYs[dateA.getDay()];
    let previousMonth = Months[dateA.getMonth()];
    let year = dateA.getFullYear();

    let dateB = new Date(toDayDate);
    let thisDay = DAYs[dateB.getDay()];
    let thisMonth = Months[dateB.getMonth()];

    let d0 = dateA.getDate();
    // let d1 = dateA.getDay();
    let dA = dateB.getDate();
    // let dB = dateB.getDay();

    if (previousMonth === thisMonth) {
        if (previousDay === thisDay) {
            return "Today";

        } else {
            if ((dA - d0) === 1) {
                return `Yesterday`;
                
            } else if ((dA - d0) > 1 && (dA - d0) <= 6) {
                return `This week - ${previousDay}.`;

            } else if ((dA - d0) >= 7 && (dA - d0) <= 13) {
                return `About week ago.`;
                
            } else {
                // console.log("Not day Equal", d0, d1, dA, dB);
                // console.log("Date: ", dA - d0);
                // console.log("Day: ", dB - d1);
                // console.log(previousDay)
                return `About weeks ago.`;
            }
        }

    } else {
        return `${previousDay} - ${previousMonth} - ${year}`;
    }
}

function sortMaxDate(val) {
    if (!(maxi.includes(val))) {
        maxi.push(val)
        return true;
    } else {
        return false;
    }
}

const setScrollPosition = () => {
    if (msgContainer.scrollHeight > 675) {
        msgContainer.scrollTop = msgContainer.scrollHeight;
        msgContainer.style.paddingBottom = "50px";
    }
}

// When enter key pressed
textArea.addEventListener("keydown", e => {
    if (!isPop) {
        e.keyCode === 17 ? controlKey = e.keyCode : false;

    } else{
        textArea.value = "";
    }
});
textArea.addEventListener('keyup', e => {
    if (!isPop) {
        let neededValue = alphaNumeric.test(textArea.value);
        let textValue = textArea.value;

        textArea.style.border = ""
        if (neededValue && (textValue.length >= 3 && textValue.length < 750)) {
            e.keyCode === 17 ? controlKey = null : false;
            let controlPlusEnterKey = controlKey && e.keyCode === 13;

            if (controlPlusEnterKey) {
                sendFeedBack(textValue);
                textArea.value = "";
                textArea.focus();
                controlKey = null;
            }
            
        } else if (neededValue && textValue.length > 750) {
            textArea.style.border = "2px solid red"

        } else {
            textArea.focus();
        }

        textArea.style.minHeight = "";
        textArea.style.height = "";
        let height = e.target.scrollHeight;
        if (height > 30 && height < 100) {
            textArea.style.height = `${height}px`;
    
        } else if (height > 100) {
            textArea.style.height = `100px`;
        }
    } else {
        textArea.value = "";
    }
});

// Navigation Button to Home Page, 
document.getElementById("nav").addEventListener("click", () => window.location.href = "Home");




var txt =  "Assalam Alaikah ya Rasullah ina son ka ya manzan Allah, Assalam alaikum ya ahlul bait wa ashab wa auliya, shehu dan Annabi ya shehu a amsa min amin a bani fiye da lissafi na alheri da albarka da rabo duniya da kiyama cikin ka ya muradi."