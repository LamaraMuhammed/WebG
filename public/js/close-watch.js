// import { checkPoint } from "./Home/shareLocPopup";

const socket = io("ws://localhost:3000");

const eventTime = new Date().toLocaleTimeString();
const eventDate = new Date().toLocaleDateString();

var input = document.querySelector('input');
var add_closeWatch_Number = document.getElementById('btn');
var alertErr = document.getElementById("err");
var limit = 4, count = 0, inputOk = false, isEdit = false, onEditRow = [], onDeleteRow = [], splitter = '0_', oldNum;
var vecantRetrieveRow = [];
var MY_LOCAL_STORAGE = {
    availableNumbers: [],
    onRetrieveDisabledAddBtn: [],
}
var myNumber;

function addRow(row, phone_num) {
    count++;
    let index = onDeleteRow.length !== 0 ? row : 
    onDeleteRow.length === 0 && vecantRetrieveRow.length !== 0 ||
    onDeleteRow.length === 0 && vecantRetrieveRow.length !== 4 ? vecantRetrieveRow[0] : count;
    
    let phoneNo = document.getElementById(`phoneNo_${index}`);
    let status = document.getElementById(`status_${index}`);
    let action = document.getElementById(`action_${index}`);
    let edit = document.getElementById(`edit_${index}`);
    let del = document.getElementById(`del_${index}`);
    let editBtn = document.createElement("button");
    let delBtn = document.createElement("button");
    
    try{
        phoneNo.innerHTML = phone_num;
    } catch(err) {
        alertErr = 'Something went wrong';
    }
    phoneNo.style.color = ''  //"#00ff00";
    status.innerHTML = '';
    action.innerHTML = '';
    editBtn.innerHTML = '&#9997';
    delBtn.innerHTML = '&#10005;';
    editBtn.id = index;
    delBtn.id = `0_${index}`;
    edit.appendChild(editBtn);
    del.appendChild(delBtn);
    
    addCloseWatchNumber(String(index), phone_num); // Send to server
    MY_LOCAL_STORAGE.availableNumbers.push(phone_num);
    
    const limitReferencer = document.getElementById("phoneNo_4").innerHTML;
    const confirmLimit = onDeleteRow.length === 1 ? 1 : onEditRow.length === 1 ? 1 : vecantRetrieveRow.length === 1 ? 1 : "";
    if (parseInt(index) ===  limit || limitReferencer !== "" && confirmLimit !== "") {
        add_closeWatch_Number.classList.add('disabled');
        add_closeWatch_Number.setAttribute('disabled', true);
        input.setAttribute('disabled', true);
    }
    
    input.value = '';
    inputOk = false;
    onDeleteRow.shift();
    vecantRetrieveRow.shift();
    
    editBtn.addEventListener('click', cl => {
        if (isEdit === false) {
            let row_id = cl.target.id;
            onEditRow.push(row_id);
            phoneNo.style.color = "#00ff00";
            editBtn.classList.add("edit");
            input.value = phoneNo.innerHTML;
            oldNum = phoneNo.innerHTML;
            isEdit = true;
            
            // Remove the disabled state
            add_closeWatch_Number.classList.remove('disabled');
            add_closeWatch_Number.removeAttribute('disabled');
            input.removeAttribute('disabled');
    
            // Reset
            countSendingEdit = 0;
            stopSendingEdit = false;
        }
        
    });

    delBtn.addEventListener('click', cl => {
        let row_id = cl.target.id.split(splitter)[1];
        onDeleteRow.push(row_id);
        deleteRow(row_id);

        // Reset
        countSendingDelete = 0;
        stopSendingDelete = false;
        
    }, { once: true });
    
}

function editRow(row, phone_num) {
    let phoneNo = document.getElementById(`phoneNo_${row}`);
    let editBtn = document.getElementById(row);
    phoneNo.innerHTML = phone_num !== 'editIssue' ? phone_num : phoneNo.innerHTML;
    phoneNo.style.color = '';
    editBtn.classList.remove("edit");
    isEdit = false;
    inputOk = false;
    onEditRow.shift();
    input.value = '';

    MY_LOCAL_STORAGE.availableNumbers = MY_LOCAL_STORAGE.availableNumbers.filter(num => num !== oldNum);
    
    phone_num === 'editIssue' ? '' : editCloseWatchNumber(row, phone_num); // Send to server

    const limitReferencer = document.getElementById("phoneNo_4").innerHTML;
    const checkRetrieveRow = vecantRetrieveRow.includes(4-1) === true ? 1 : vecantRetrieveRow.includes(3-1) === true ? 1 : vecantRetrieveRow.includes(2-1) === true ? 1 : "";
    if (parseInt(row) ===  limit && checkRetrieveRow === "" || limitReferencer !== "" && checkRetrieveRow === "") {
        add_closeWatch_Number.classList.add('disabled');
        add_closeWatch_Number.setAttribute('disabled', true);
        input.setAttribute('disabled', true);
    }
    
}

function deleteRow(row) {
    let phoneNo = document.getElementById(`phoneNo_${row}`);
    let status = document.getElementById(`status_${row}`);
    let action = document.getElementById(`action_${row}`);
    let edit = document.getElementById(`edit_${row}`);
    let del = document.getElementById(`del_${row}`);
    let editBtn = document.getElementById(row);
    let delBtn = document.getElementById(`0_${row}`);

    phoneNo.style.color = '';
    status.innerHTML = '';
    action.innerHTML = '';
    input.value = '';
    isEdit = false; // if user click edit btn and delete without editting
    edit.removeChild(editBtn);
    del.removeChild(delBtn);
    deleteCloseWatchNumber(row); // server deletion
    count--;
    
    if (count < limit) {
        add_closeWatch_Number.classList.remove('disabled');
        add_closeWatch_Number.removeAttribute('disabled');
        input.removeAttribute('disabled');
    }
    
    if (MY_LOCAL_STORAGE.availableNumbers.length !== 0) {
        let trash = phoneNo.innerHTML;
        MY_LOCAL_STORAGE.availableNumbers = MY_LOCAL_STORAGE.availableNumbers.filter(f => f !== undefined);
        MY_LOCAL_STORAGE.availableNumbers = MY_LOCAL_STORAGE.availableNumbers.filter(tr => tr !== trash);
        phoneNo.innerHTML = '';
    }
    
}

input.addEventListener('change', ch => inputOk = true);

// Send Stuff Here
add_closeWatch_Number.addEventListener('click', cl => {
    if (myNumber.myNumber) {
        let inputValue = input.value;
        let cleanNumber = checkPoint(inputValue);
        cleanNumber.ok && inputOk !== false && isEdit === false ? addRow(onDeleteRow[0], cleanNumber.ok) : 
        cleanNumber.ok && inputOk !== false && isEdit !== false ? editRow(onEditRow[0], cleanNumber.ok) : 
        alertErr.innerHTML = cleanNumber.ok ? "" : cleanNumber, setTimeout(() => alertErr.innerHTML = '', 2500);
    
        // Reset
        countSendingAdd = 0;
        stopSendingAdd = false;
        countSendingEdit = 0;
        stopSendingEdit = false;
        countSendingDelete = 0;
        stopSendingDelete = false;

    }
});

function checkPoint(phone_no) {
    
    if (phone_no !== '' && inputOk !== false) {
        const wordRegex = /[A-Za-z]+/g; // Extracting String From Numbers
        let numCount = {}; 
        let maxi = [];
        
        for (var char of phone_no) {
            
            numCount[char] = (numCount[char] || 0) + 1;
            maxi.push(numCount[char])
            
        }

        let maxiOccurrencesNum = Math.max(...maxi);
        
        let extractString = phone_no.match(wordRegex);
        let punctuationless = sanitizeMe(phone_no);
        let checkPhoneNumber = wordRegex.test(phone_no);
        let nationalCode = '+234'; // +234 for my nation Nig.
        let removeFirstZero;
        let newPhoneNumber;

        if (phone_no !== myNumber.myNumber) {
            if (phone_no.includes(nationalCode) === true) {
                
                let splitPhoneNo = phone_no.split(nationalCode).toString().replace(',0', '');
                if (splitPhoneNo.startsWith(',')) {
                    
                    removeFirstZero = splitPhoneNo.replace(',', '')
                    newPhoneNumber = nationalCode + removeFirstZero;
                    
                } else {
                    
                    newPhoneNumber = nationalCode + splitPhoneNo;
                    
                }
                
            } else {
                
                if (phone_no.startsWith('0')) {
                    
                    removeFirstZero = phone_no.replace('0', '');
                    newPhoneNumber = nationalCode + removeFirstZero;
                    
                } else {
                    
                    newPhoneNumber = nationalCode + phone_no;
                    
                }
                
                
            }
    
            if (checkPhoneNumber !== false || punctuationless !== undefined) {
                
                if (extractString !== false && punctuationless) {
                    return ('Incorrect Number');
                    
                } else if (checkPhoneNumber == null && punctuationless) {
                    return ('Incorrect Number');
    
                } else {
                    return ('Incorrect Number');
    
                }
                
            } else {
                let cleanPhoneNumber = newPhoneNumber.replace(/\s{1,}/g,"");
                if (cleanPhoneNumber.length < 14) {
                    
                    return ("Incomplete number");
                    
                } else if (cleanPhoneNumber.length > 14) {
                    
                    return ("Too much numbers");
                    
                } else if (cleanPhoneNumber.length === 14 && maxiOccurrencesNum > 5){
                    
                    return ("The number seems not to be real!");
                    
                } else {
                    let reCheck = !phone_no.includes(nationalCode) ? phone_no : phone_no.replace(nationalCode, '');
                    let fullNumber = reCheck[0] !== '0' ? "0" + reCheck : reCheck;
                    if (MY_LOCAL_STORAGE.availableNumbers.length !== 0) {
                        if (fullNumber === MY_LOCAL_STORAGE.availableNumbers[0] || fullNumber === MY_LOCAL_STORAGE.availableNumbers[1]
                        || fullNumber === MY_LOCAL_STORAGE.availableNumbers[2] || fullNumber === MY_LOCAL_STORAGE.availableNumbers[3]) {
                            return ("Possible duplicates!");

                        } else {
                            return { ok: fullNumber }
                        }
        
                        } else {
                            return { ok: fullNumber }

                        }
                }  
            }

        } else {
            return ("This is your number instead use alternative");
        }
        
    } else {
        if (isEdit === true) {
            return { ok: 'editIssue' }

        } else {
            return ('Type Something To Go');
        }
    }
}

//  Removing any punctuation mark 
function sanitizeMe(item) {

    var punctuationless = item.match(/[.,\/|'"?><``\\@#!$%\^&\*;:{}=\-_`~()]/gi);
    if (punctuationless) return {
        exeption: punctuationless.toString() 
    }
}

var countSendingAdd = 0, stopSendingAdd = false;
function addCloseWatchNumber(row, num) {
    countSendingAdd++;
    row == '1' && countSendingAdd > 1 ? stopSendingAdd = true :
    row == '2' && countSendingAdd > 1 ? stopSendingAdd = true :
    row == '3' && countSendingAdd > 1 ? stopSendingAdd = true :
    row == '4' && countSendingAdd > 1 ? stopSendingAdd = true : false;
    stopSendingAdd === true ? "" : 
    socket.emit('closeWatch', {
        mode: 'add',
        row: row,
        eventTime: eventTime,
        eventDate: eventDate,
        phoneNo: num
    });
}

var countSendingEdit = 0, stopSendingEdit = false;
function editCloseWatchNumber(row, num) {
    countSendingEdit++;
    row == '1' && countSendingEdit > 1 ? stopSendingEdit = true :
    row == '2' && countSendingEdit > 1 ? stopSendingEdit = true :
    row == '3' && countSendingEdit > 1 ? stopSendingEdit = true :
    row == '4' && countSendingEdit > 1 ? stopSendingEdit = true : false;
    stopSendingEdit === true ? "" : 
    socket.emit('closeWatch', {
        mode: 'edit',
        row: row,
        eventTime: eventTime,
        eventDate: eventDate,
        oldNum: oldNum,
        phoneNo: num
    });
}

var countSendingDelete = 0, stopSendingDelete = false;
function deleteCloseWatchNumber(row) {
    countSendingDelete++;
    row == '1' && countSendingDelete > 1 ? stopSendingDelete = true :
    row == '2' && countSendingDelete > 1 ? stopSendingDelete = true :
    row == '3' && countSendingDelete > 1 ? stopSendingDelete = true :
    row == '4' && countSendingDelete > 1 ? stopSendingDelete = true : false;
    stopSendingDelete === true ? "" : socket.emit('closeWatch', {
        mode: 'delete',
        row: row
    });
}

socket.on('warn', (msg) => alertErr.innerHTML = msg);

socket.on('watch', (msg) => {
    if (msg.myNumber) {
        myNumber = msg;

    } else {
        let person = document.getElementById(`status_${msg.row}`);
        let action = document.getElementById(`action_${msg.row}`);
        person.innerHTML = msg.name === '' ? "" : msg.name;
        action.innerHTML = msg.action === '' ? "" : msg.action;
    }

});

socket.on('retrieveData', (message) => {
    let msg = message[0];
    let row = msg.row;
    let _vecantIndex = message[1];
    myNumber = message[2];
    
    const id = setInterval(() => {    
        if (row[0] === 0) { // remove any leading zero if any and beyong
            row.shift();
            msg.phoneNo.shift();
            msg.name.shift();
            msg.action.shift(); 
        } 
        
        let rowIndex = row[0];
        if (rowIndex !== 0) {
            let phoneNo = msg.phoneNo[0] !== 0 ? msg.phoneNo[0] : '';
            let person = msg.name[0] !== 0 ? msg.name[0] : '';
            let action = msg.action[0] !== 0 ? msg.action[0] : ''
            retrieveRows(rowIndex, phoneNo, person, action);
        }
        
        row.shift();
        msg.phoneNo.shift();
        msg.name.shift();
        msg.action.shift();
        row.length === 0 ? clearInterval(id) : ''; // Stop iteration
    
    }, 100);

    extractVecantRow(_vecantIndex);

});

function extractVecantRow(vecantIndex) {
    vecantIndex.row_1 !== 'occupied' ? vecantRetrieveRow.push(1) : '';
    vecantIndex.row_2 !== 'occupied' ? vecantRetrieveRow.push(2) : '';
    vecantIndex.row_3 !== 'occupied' ? vecantRetrieveRow.push(3) : '';
    vecantIndex.row_4 !== 'occupied' ? vecantRetrieveRow.push(4) : '';
}

function retrieveRows(id, phone_num, name, act) {
    let phoneNo = document.getElementById(`phoneNo_${id}`);
    let person = document.getElementById(`status_${id}`);
    let action = document.getElementById(`action_${id}`);
    let edit = document.getElementById(`edit_${id}`);
    let del = document.getElementById(`del_${id}`);
    let editBtn = document.createElement("button");
    let delBtn = document.createElement("button");
    
    editBtn.innerHTML = '&#9997';
    delBtn.innerHTML = '&#10005;';
    editBtn.id = id;
    delBtn.id = `0_${id}`;
    edit !== null ? edit.appendChild(editBtn) : '';
    del !== null ? del.appendChild(delBtn) : '';

    phoneNo === null ? '' : phoneNo.innerHTML = phone_num;
    person === null ? '' : person.innerHTML = name;
    action === null ? '' : action.innerHTML = act === null ? '' : act;
    
    typeof phone_num !== undefined ? MY_LOCAL_STORAGE.availableNumbers.push(phone_num) : '';
    MY_LOCAL_STORAGE.onRetrieveDisabledAddBtn.push(id);
    if (MY_LOCAL_STORAGE.onRetrieveDisabledAddBtn.includes('1') !== false && MY_LOCAL_STORAGE.onRetrieveDisabledAddBtn.includes('2') !== false &&
        MY_LOCAL_STORAGE.onRetrieveDisabledAddBtn.includes('3') !== false && MY_LOCAL_STORAGE.onRetrieveDisabledAddBtn.includes('4') !== false) {
        add_closeWatch_Number.classList.add('disabled');
        add_closeWatch_Number.setAttribute('disabled', true);
        input.setAttribute('disabled', true);
    }

    input.value = '';

    editBtn.addEventListener('click', cl => {
        if (isEdit === false) {
            let row_id = cl.target.id;
            onEditRow.push(row_id);
            phoneNo.style.color = "#00ff00";
            editBtn.classList.add("edit");
            input.value = phoneNo.innerHTML;
            oldNum = phoneNo.innerHTML;
            isEdit = true;
    
            // Remove the disabled state
            add_closeWatch_Number.classList.remove('disabled');
            add_closeWatch_Number.removeAttribute('disabled');
            input.removeAttribute('disabled');
    
            // Reset
            countSendingEdit = 0;
            stopSendingEdit = false;
        }
        
    });

    delBtn.addEventListener('click', cl => {
        let row_id = cl.target.id.split(splitter)[1];
        onDeleteRow.push(row_id);
        deleteCloseWatchNumber(row_id);
        deleteRow(row_id);

        // Reset
        countSendingDelete = 0;
        stopSendingDelete = false;
        
    }, { once: true });

}

document.getElementById('nav').addEventListener('click', back => window.location.href = "Home");