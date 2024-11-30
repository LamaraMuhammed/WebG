
const formContainer = document.getElementById("formContainer");
const doubleDevice = document.querySelector(".doubleDevice");
const form = document.querySelector("form");
const numberRegex = /^[0-9]+$/; //Extracting number in string
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);   // checking device brand

var phoneNoResCount = 0;
var pwdResCount = 0;
var psResCount = 0;
var phone_no_Ok = false, password_Ok = false;

var col_1 = document.querySelector(".col-1");
var col_2 = document.querySelector(".col-2");

var phn = document.querySelector('#phn');
var ps = document.querySelector('#ps');
var label = document.querySelector('label');

var phone_no = document.getElementById("phone_no");
var password = document.getElementById("password");

var noticer = document.querySelector("#err"), selectedField = 'phoneNo';
var okColor = "2px solid rgb(2, 250, 2)", errColor =  "1px solid rgb(211, 7, 7)";

var storeValuesInCaseOfDoubleDevice = {
    phoneNo: [],
    password: [],
    reset: () => {
        storeValuesInCaseOfDoubleDevice.phoneNo = [];
        storeValuesInCaseOfDoubleDevice.password = [];
    }
}

phn.addEventListener("click", () => {
    col_1.classList.remove('col-1-fade-away');
    col_2.classList.remove('col-2-selected');
    phn.style.color = '#03ce03';
    ps.style.color = '#050c74';
    selectedField = 'phoneNo';
    removePsInput(700);
});

ps.addEventListener("click", () => {
    col_1.classList.add('col-1-fade-away');
    col_2.classList.add('col-2-selected');
    ps.style.color = '#03ce03';
    phn.style.color = '#050c74';
    selectedField = 'ps';
    createPsInput();
    makeAlert(0);

    phone_no.value = '';
    password.value = '';
    phone_no.style.border = '';
    password.style.border = '';
});

phone_no.addEventListener('keyup', key => {
    let _key = key.key
    if (_key) {
        let keyCheck = _key.match(numberRegex);
        let exp_key = _key === "Backspace" ? true : false;
    
        let eleVal = phone_no.value;
        let eleLen = eleVal.length;
        phone_no_Ok = false;
        transformNationalCode();
        if (eleLen > 0) {
            let testEle = numberRegex.test(eleVal);
            if (testEle && keyCheck || testEle && exp_key) {
                let numCountZeroes = {}; 
                let maxiZeroes = [];
                let numCount = {}; 
                let maxi = [];
                
                for (var char of phone_no.value) {
                    if (char === 0) {
                        numCountZeroes[char] = (numCountZeroes[char] || 0) + 1;
                        maxiZeroes.push(numCountZeroes[char]);

                    } else {
                        numCount[char] = (numCount[char] || 0) + 1;
                        maxi.push(numCount[char]);
                    }
                }
                
                let x = Math.max(...maxi) > 5, y = Math.max(...maxiZeroes) > 6;
                if (x || y) {
                    phone_no.style.border = errColor;
                    makeAlert("The phone number seems not to be real!");
                    phone_no_Ok = false;
                    
                } else if (phone_no.value.startsWith('234')) {
                    phone_no.style.border = errColor;
                    makeAlert('National code not necessarily');
                    phone_no_Ok = false;
    
                } else if (validateLength(eleVal) === 0) {
                    phone_no.style.border = errColor;
                    makeAlert("Too much phone numbers");
                    phone_no_Ok = false;
    
                } else if (validateLength(eleVal) && !x || validateLength(eleVal) && !y) {
                    phone_no.style.border = okColor;
                    transformNationalCode(true);
                    phone_no_Ok = true;
                }

            } else {
                phone_no.style.border = errColor;
                phone_no_Ok = false;
                makeAlert();
            }
        } else if (phone_no.style.border !== errColor) {
            phone_no.style.border = '';
            phone_no_Ok = false;
            makeAlert(0);
    
        } else {
            makeAlert("Phone number is required");
        }
    }
});

function transformNationalCode(q) {
    if (q) {
        label.style.fontWeight = "normal";
        label.style.color = "rgb(2, 250, 2)";
    } else {
        label.style.fontWeight = "600";
        label.style.color = "";
    }
}

phone_no.addEventListener('change', () => {
    if (validateLength(phone_no.value)) {
        makeAlert(0);
        phone_no.style.border = okColor;
        transformNationalCode(true);
        phone_no_Ok = true;

    } else {
        makeAlert("Invalid phone number");
        phone_no.style.border = errColor;
        phone_no_Ok = false;
    }
});

password.addEventListener("keyup", (k) => {
    k.key === 'Backspace' ?
    passwordRight() : false;
    if (password.value.length > 5) {
        makeAlert(0);
        password.style.border = okColor
        password_Ok = true; //  Permit
    }
});

password.addEventListener("change", () => passwordRight());

function passwordRight() {
    if (password.value.length == 0) {
        password.style.border = errColor;
        makeAlert("Password is required");
        password_Ok = false;
        
    } else if (password.value.length <= 5) {
        password.style.border = errColor;
        makeAlert("Your password is weak! atleast six 6 or above");
        password_Ok = false;
        
    } else {
        makeAlert(0);
        password.style.border = okColor
        password_Ok = true; //  Permit
    }
}

function makeAlert(val) {
    let err = val !== 0 && val ? val : val === 0 ? '' : 'Unexpected value';
    noticer.innerHTML = err;
}

function createPsInput() {
    removePsInput();
    let input = document.createElement('input');
    input.type = 'password';
    input.placeholder = 'PS Number';
    input.maxLength = '9';
    input.id = 'psNo';
    input.addEventListener('keyup', k => psCheck(input));
    col_2.appendChild(input);
}

function psCheck(ele) {
    ele.value.length !== 0 ? 
    [ele.style.border = okColor, makeAlert(0)] : 
    [ele.style.border = errColor, makeAlert('PS Number is required')];
}

function removePsInput(d) {
    let child = document.getElementById('psNo');
    let tm = d ? d : 0;
    setTimeout(t => {
        child ? col_2.removeChild(child) : false; // Incase of it exist
    }, tm);
}

function validateSIMCode(val) {
    if (val.startsWith('07') || val.startsWith('08') || val.startsWith('09')) {
        return '+0'
    } else if (val.startsWith('7') || val.startsWith('8') || val.startsWith('9')) {
        return '-0'
    } 
}

function validateLength(val) {
    if (validateSIMCode(val) === '+0' && val.length === 11) {
        return val;
    } else if (validateSIMCode(val) === '-0' && val.length === 10) {
        return val;
    } else if (validateSIMCode(val) === '-0' && val.length === 11) {
        return 0;
    } 
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (selectedField === 'phoneNo') {
        let phoneNoLen = phone_no.value.length;
        let passLen = password.value.length;
        if (( validateLength(phone_no.value) && phone_no_Ok) && (passLen !== 0 && password_Ok)) {
            sendData(phone_no.value, password.value);
            
        } else if (phoneNoLen === 0 && passLen !== 0){
            phone_no.style.border = errColor;
            makeAlert('Remain phone number');
       
        } else if (phoneNoLen !== 0 && passLen === 0) {
            password.style.border = errColor;
            makeAlert('Remain password');
            
        } else  if (phoneNoLen === 0 && passLen === 0) {
            phone_no.style.border = errColor;
            password.style.border = errColor;
            makeAlert('Fill the required fields');
        }

    }

    if (selectedField === 'ps') {
        var psNo = document.getElementById("psNo");
        if (psNo.value.length !== 0) {
            console.log(psNo.value)
            if (psNo.value.length === 9 && psNo.value.includes('-')) {
                sendData(psNo.value);
            } else {
                makeAlert('Invalid PS Number!');
                psNo.style.border = errColor;
                psNo.value = '';
            }
        } else {
            psNo.style.border = errColor;
            makeAlert('Fill the required field');  
        } 
    }
});

function sendData(...val) {
    storeValuesInCaseOfDoubleDevice.phoneNo.push(phone_no.value);
    storeValuesInCaseOfDoubleDevice.password.push(password.value);
    var data = val.length > 1 ? {
        phone_no: val[0],
        password: val[1]
    } : { psNo: val[0] };

    fetch('/WebG/LogIn', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then(data => {
        if (data.permit === true) {
            window.location.href = '/WebG/Home';

        } else if (data.Double) {
            doubleDevicePopup();

        } else if (data.psNoErr) { 
            if (psResCount === 2) {
                setTimeout(() => {
                    window.location.href = '/WebG/Sign-Up';
                }, 500);
            }

            makeAlert(data.psNoErr);
            document.getElementById("psNo").style.border = errColor;
            psResCount++;

        } else if (data.phoneNoErr) {
            makeAlert(data.phoneNoErr); 
            phone_no.style.border = errColor;
            phone_no.value = storeValuesInCaseOfDoubleDevice.phoneNo.toString();
            password.value = storeValuesInCaseOfDoubleDevice.password.toString();
            storeValuesInCaseOfDoubleDevice.reset();
            
            if (phoneNoResCount === 3) {
                setTimeout(() => {
                    window.location.href = '/WebG/Sign-Up';
                }, 500);
            }
            phoneNoResCount++;
            
        } else if (data.pwdErr) {
            phone_no.value = storeValuesInCaseOfDoubleDevice.phoneNo.toString();
            password.value = storeValuesInCaseOfDoubleDevice.password.toString();
            storeValuesInCaseOfDoubleDevice.reset();
            makeAlert(data.pwdErr);
            password.style.border = errColor;

            if (pwdResCount === 3) {
                setTimeout(() => {
                    window.location.href = '/WebG/Sign-Up';
                }, 500);
            }
            pwdResCount++;

        } else {
            makeAlert("Oops! Error Gotten Please Try Again...");
        }

    })
    .catch((err) => {
        makeAlert(`Error: Gotten Please Try Again...`);
    });
    phone_no.value = ""; password.value = ""; 
}

function doubleDevicePopup() {
    formContainer.style.display = "none";
    setTimeout(() => {
        doubleDevice.style.display = "flex";
    }, 200);
}

var SignOut = document.getElementById("SignOut");
var Remain = document.getElementById("Remain");
var pressCount_1 = 0;
var pressCount_2 = 0;
SignOut.addEventListener("click", () => {
    pressCount_1++;
    if (pressCount_1 === 1) {
        sendUserConsent("SignOut");
        pressCount_2 = 2;
    }
})
Remain.addEventListener("click", () => {
    pressCount_2++;
    if (pressCount_2 === 1) {
        sendUserConsent("Remain");
        pressCount_1 = 2;
    }
})

function sendUserConsent(res) {
    var data = {
        phone_no: storeValuesInCaseOfDoubleDevice.phoneNo.toString(),
        password: storeValuesInCaseOfDoubleDevice.password.toString(),
        respond: res
    }

    fetch('/WebG/userConsent', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then(data => {

        if (data.permit === true) {
            window.location.href = '/WebG/Home';
            doubleDevice.style.display = "none";
            storeValuesInCaseOfDoubleDevice.reset();

        } else {
            doubleDevice.style.display = "none";
            formContainer.style.display = "block"; 
            storeValuesInCaseOfDoubleDevice.reset();
        }
    })
    .catch((err) => {
        makeAlert(`We're Sorry, Something Went Wrong`);
    });
}
