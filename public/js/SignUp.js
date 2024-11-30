const form = document.querySelector("form");
var submitbtn = document.getElementById('submitBtn');
var first_name = document.getElementById("firstName");
var last_name = document.getElementById("lastName");
var phone_no = document.getElementById("phone_no");
var phoneDiv = document.querySelector('.phoneNo');
var password = document.getElementById("password");
var age = document.getElementById("age");
var gender = document.querySelector(".radio");
var radioUnchecked = document.querySelectorAll(".radioInput");
var state = document.getElementById("state");
var town = document.getElementById("town");
const numberRegex = /^[0-9]+$/; //Extracting number in string
const wordRegex = /[A-Za-z]+/g; //Extracting String From Numbers

var psNo = document.querySelector(".ps");
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);   // checking device brand

var errAlert = document.querySelector(".bigErr");
var mblErr = document.getElementById('mblErr');
var psMsg = document.querySelector('i');

var responeCount = 0;
var label = [];
var okColor = "2px solid rgb(2, 250, 2)", errColor =  "1px solid rgb(211, 7, 7)";

first_name.addEventListener('keyup', k => analyseKeys(first_name, k));
last_name.addEventListener('keyup', k => analyseKeys(last_name, k));

function analyseKeys(ele, k) {
    let key = k.key.match(wordRegex);
    let eleVal = ele.value;
    let eleLen = eleVal.length;
    if (eleLen > 0) {
        let testEle = wordRegex.test(ele.value);
        if (testEle && key) {
            makeAlert(0);
            ele.style.border = okColor;
        } else {
            ele.style.border = errColor;
            makeAlert();
        }
    } else if (ele.style.border !== errColor) {
        ele.style.border = '';
        makeAlert(0);

    } else {
        ele.style.border = errColor;
        makeAlert(ele.placeholder + " is required");
    }
}

first_name.addEventListener('change', ch => analyseLength(first_name, 2));
last_name.addEventListener('change', ch => analyseLength(last_name, 2));

function analyseLength(ele, len) {
    let eleLen = ele.value.length;
    if (eleLen === 1) {
        ele.style.border = errColor;
        makeAlert('Provided value is too short');
    } else if (eleLen >= len) {
        if (ele.style.border !== errColor) {
            makeAlert(0);
            ele.style.border = okColor;
        }
    }
}

phone_no.addEventListener('keyup', key => {
    let _key = key.key
    if (_key) {
        let keyCheck = _key.match(numberRegex);
        let exp_key = _key === "Backspace" ? true : false;
    
        let eleVal = phone_no.value;
        let eleLen = eleVal.length;
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
                    phoneDiv.style.border = errColor;
                    makeAlert("The phone number seems not to be real!");
                    
                } else if (phone_no.value.startsWith('234')) {
                    phoneDiv.style.border = errColor;
                    makeAlert('National code not necessarily');
                    
                } else if (validateLength(eleVal) === 0) {
                    phoneDiv.style.border = errColor;
                    makeAlert("Too much phone numbers");
                    
                } else if (validateLength(eleVal) && !x || validateLength(eleVal) && !y) {
                    makeAlert(0);
                    phoneDiv.style.border = okColor;
                    transformNationalCode(true);
                }
                
            } else {
                phoneDiv.style.border = errColor;
                makeAlert();
            }
        } else if (phoneDiv.style.border !== errColor) {
            phoneDiv.style.border = '';
            makeAlert(0);
    
        } else {
            makeAlert("Phone number is required");
        }
    }
});

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

function transformNationalCode(q) {
    if (q) {
        label[0].style.fontWeight = "normal";
        label[0].style.color = "rgb(2, 250, 2)";
    } else {
        label[0].style.fontWeight = "600";
        label[0].style.color = "";
    }
}

phone_no.addEventListener('change', () => {
    if (validateLength(phone_no.value) !== 0) {
        makeAlert(0);
        phoneDiv.style.border = okColor;
        transformNationalCode(true);

    } else {
        makeAlert("Invalid phone number");
        phoneDiv.style.border = errColor;
    }
});

password.addEventListener("keyup", (k) => {
    k.key === 'Backspace' ?
    passwordRight() : false;
    if (password.value.length > 5) {
        makeAlert(0);
        password.style.border = okColor
    }
});

password.addEventListener("change", () => passwordRight());

function passwordRight() {
    if (password.value.length == 0) {
        password.style.border = errColor;
        makeAlert("Password is required");
        
    } else if (password.value.length <= 5) {
        password.style.border = errColor;
        makeAlert("Your password is weak! at least six 6 or above");
        
    } else if (password.value.length > 5) {
        makeAlert(0);
        password.style.border = okColor
    }
}

//  Gender Analysis
var userGender;
gender.addEventListener("click", (e) => {
    removeRadioErrChecked();
    userGender = e.target['id'];
});

age.addEventListener("change", () => age.value ? age.style.border = okColor : age.style.border = '');
state.addEventListener("keyup", () => state.value ? state.style.border = okColor : state.style.border !== errColor ? state.style.border = '' : true);
town.addEventListener("keyup", () => town.value ? town.style.border = okColor : town.style.border !== errColor ? town.style.border = '' : true);

function addRadioErrChecked(){
    radioUnchecked[0].classList.add('onEmpty');
    radioUnchecked[1].classList.add('onEmpty');
    radioUnchecked[2].classList.add('onEmpty');
}
function removeRadioErrChecked(){
    radioUnchecked[0].classList.remove('onEmpty');
    radioUnchecked[1].classList.remove('onEmpty');
    radioUnchecked[2].classList.remove('onEmpty');
}

function signErr() {
    if (psNo.innerHTML === "****") {
        first_name.value.length < 1 ? first_name.style.border = errColor : false;
        last_name.value.length < 1 ? last_name.style.border = errColor : false;
        phone_no.value.length < 1 ? phoneDiv.style.border = errColor : false;
        password.value.length < 1 ? password.style.border = errColor : false;
        age.value.length < 1 ? age.style.border = errColor : false;
        !userGender ? addRadioErrChecked() : false;
        state.value.length < 1 ? state.style.border = errColor : false;
        town.value.length < 1 ? town.style.border = errColor : false;
    }
}

function makeAlert(val) {
    let err = val !== 0 && val ? val : val === 0 ? '' : 'Unexpected value';
    mblErr.innerHTML = err; errAlert.innerHTML = err;
}

// Sending the Data to Server further more processing
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (psNo.innerHTML === '****' && submitbtn.attributes[1].value === 'Sign Up') {
        if (first_name.value.length > 1) {
            if (last_name.value.length > 1) {
                if (validateLength(phone_no.value) !== 0) {
                    if (password.value.length > 5) {
                        if (age.value) {
                            if (userGender) {
                                let _first_name = first_name.value.charAt(0).toUpperCase() + first_name.value.slice(1);
                                let _last_name = last_name.value.charAt(0).toUpperCase() + last_name.value.slice(1);
                                let _state = state.value.charAt(0).toUpperCase() + state.value.slice(1);
                                let _town = town.value.charAt(0).toUpperCase() + town.value.slice(1);
                                
                                // Sending the form to Serv..
                                sendFormData(_first_name, _last_name, phone_no.value, password.value, age.value, userGender, _state, _town);
                                resetAll();

                            } else {
                                signErr()
                            }
                        } else {
                            signErr()
                        }
                    } else {
                        signErr()
                    }
                } else {
                    signErr()
                }
            } else {
                signErr()
            }
        } else {
            signErr()
        }
    } else {
        signErr()
    }
});

function sendFormData(first_name, last_name, phone_no, password, _age, gender, state, town) {
    const defaultPsTxt = "The * field is your PS Number field don't let it known!";
    var data = {
        first_name: first_name,
        last_name: last_name,
        phone_no: phone_no,
        password: password,
        age: _age,
        gender: gender,
        state: state, 
        town: town,
        date: new Date().toDateString() + " " + "-" + " " + new Date().toLocaleTimeString()
    };

    fetch('/WebG/Sign-Up', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then(data => {
        
        if (data.reg) {
            if (responeCount === 1) {
                window.location.href = '/WebG/LogIn';
            } else {
                errAlert.innerHTML = data.reg;
                submitbtn.setAttribute('value', "Sign Up");
            }
            psMsg.innerHTML = defaultPsTxt;
            submitbtn.setAttribute('value', "Sign Up");
            responeCount++;

        } else if (data.userPsNo) {
            submitbtn.setAttribute('value', "Sign Up");
            setTimeout(() => {
                psNo.innerHTML = data.userPsNo;
                copy.style.visibility = 'visible';
                psMsg.style.color = '#008200';
                psMsg.innerHTML = "This is your PS Number don't let it known, SAVE IT!";
            }, 200);
            
            openPopUp();

        } else {
            if (data.redirect) {
                location.reload();
                // window.location.href = '/WebG/Sign-Up';
            } else {
                submitbtn.setAttribute('value', "Sign Up");
                errAlert.innerHTML = data.psNo_1; 
                psMsg.innerHTML = defaultPsTxt;
            }
        }
    })
    .catch((err) => {
        submitbtn.setAttribute('value', "Sign Up");
        psMsg.innerHTML = defaultPsTxt;
        errAlert.innerHTML = `Error Gotten Please Try Again...`;
    });
    submitbtn.setAttribute('value', "Please wait...");

}

var copy = document.getElementById("copy");
copy.addEventListener("click", cl => {
    if (doCopy()) {
        setTimeout(() => window.location.href = "/WebG/LogIn", 2700);
    } else {
        psMsg.style.color = "rgb(211, 7, 7)";
        psMsg.innerHTML = "Oh! sorry no clipboard.";
        copy.style.color = "rgb(211, 7, 7)";
        setTimeout(e => {
            psMsg.style.color = '#008200';
            psMsg.innerHTML = "Incase of that, write down your PS Number.";
            document.querySelector(".succPop").style.visibility = "hidden";
        }, 2000);
    }
    
});

function doCopy() {
    const text = psNo.innerText;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        copy.innerHTML = "Copied!";
        psNo.innerText = '...';
        psNo.style.color = "#02fa02";
        copy.style.color = "#02fa02";
        setTimeout(() => psNo.innerText = text, 700);
        return true;
    } else {
        return false;
    }
}

function openPopUp() {
    document.querySelector(".succPop").classList.add("openPopUp");
}

function resetAll() {
    first_name.value = "";
    first_name.style.border = "";
    last_name.value = "";
    last_name.style.border = "";
    phone_no.value = "";
    phoneDiv.style.border = "";
    password.value = "";
    password.style.border = "";
    age.value = "";
    age.style.border = "";
    state.value = "";
    state.style.border = "";
    town.value = "";
    town.style.border = "";
    
    radioUnchecked[0].checked = false;
    radioUnchecked[1].checked = false;
    radioUnchecked[2].checked = false;
    transformNationalCode();
}

document.querySelectorAll('label').forEach(child => {
    if (child.attributes[0].value !== 'phone_no') {
        child.addEventListener('click', cl => removeRadioErrChecked());
    } else {
        label.push(child)
    }
});

window.addEventListener('load', e => resetAll());