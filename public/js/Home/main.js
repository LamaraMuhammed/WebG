// Global Variables
const globalV = {
    disabled: false,
    userLogIn: false,
    userLogOut: false,
    disabledAll: false,
    localCoords: null,
    remoteCoords: null,
    coordToMeasure: null,
    defaultFrndToInteract: null,
    ondragFitBounds: true,
    toId: null,
    flyTo: false,
    isPsReq: false, 
    isIndicators: false,
    stopAllAutoMove: false,
    tripBank: [],
    remoteTripBank: [],
    layeredPsNo: [],
};

const Dom = {
    
}

var firstRoute = false;
var secondRoute = false;
var thirdRoute = false;
var startIllust = false;
var illusPaused = false;
var startMapClick = false;
var clearMobileIllustration = false;
var activeMethod;

// checking device brand
var isMobile = /iPhone|iPad|iPod|Android|mobile/i.test(navigator.userAgent);

// Displayers
const homeContentSection = document.getElementById("homeContentSection");
const footer = document.querySelector(".footer");
var expander = document.querySelector(".expander");

var userPic = document.getElementById("profilePic");
userPic.onclick = () => openSettingPanel();

// Buddies Images
const image1 = new Image();
const image2 = new Image();
const image3 = new Image();

var accSignal = document.querySelector(".accSignal");
var notification = document.getElementById("notification");

var menu = document.getElementById("menu");
var msgSymbol = document.querySelector(".symbol");

// Bottom Bar Items
var home = document.getElementById("home");
var sp_home = document.getElementById("sp-home");
var shareLoc = document.getElementById("shareLoc");
var sp_shareLoc = document.getElementById("sp-shareLoc");
var chat = document.getElementById("chat");
var sp_chat = document.getElementById("sp-chat");
var tour = document.getElementById("tour");
var sp_tour = document.getElementById("sp-tour");
var readMe = document.getElementById("readMe");
var sp_readMe = document.getElementById("sp-readMe");
var setColor = "skyblue";
var unSetColor = "white";

// Quick Msgs
var defaultQuickMsg1 = document.getElementById("msgs1");
var defaultQuickMsg2 = document.getElementById("msgs2");
var defaultQuickMsg3 = document.getElementById("msg3");
var isDefaultQuickMsg1 = false, isDefaultQuickMsg2 = false, isDefaultQuickMsg3 = false;

var defaultMsg = "Quick Messages will be appeared Here!";
var buddiesPanelMsgLocalStorage = {
    msg1: [],
    msg2: [],
    msg3: [],

    reset: () => {
        buddiesPanelMsgLocalStorage.msg1 = [],
        buddiesPanelMsgLocalStorage.msg2 = [],
        buddiesPanelMsgLocalStorage.msg3 = []
    }
    
};

function displayExpander() {
    expander.style.display = "flex";
}

function hideExpander() {
    hideExpandButtonItems()
    expander.style.display = "none";
}

function displayWelcomeBoard(duration) {
    var min_time = duration ? min_time = duration : 1000;
    setTimeout(() => {
        close_all_opened_part_on_unLogged_user();
        document.querySelector(".welcomeBoard").classList.add("displayWB");
        globalV.disabledAll = true;

        setTimeout(() => {
            hideExpander();
        }, 950);

    }, min_time);
}

function close_all_opened_part_on_unLogged_user() {
    hideExpandButtonItems();
    chatContainer.style.display = "none";
    document.querySelector(".shareLoc-popup").classList.remove("open-shareLoc-popup");
    document.getElementById("NotificationContainer").style.display = "none";
    setting.style.display = 'none';
    readOut('', '');

    // Normalize the homeContent
    homeContentSection.style.display = "block";
    footer.style.display = "block";
}

// expander-items
var Illustration = document.getElementById("Illus");
var Illus = document.querySelector(".illus");
var Clear = document.getElementById("Clear");
var deletion = document.querySelector(".deletion");
var recordMe = document.getElementById("recordMe");
var record = document.querySelector(".record");
var indicators = document.getElementById("indicators");
var IndicatorDropDownMenu = document.querySelector(".IndicatorDropDownMenu");
var my_area = document.getElementById("my-area");
var boundryDropDownMenu = document.querySelector(".boundryDropDownMenu");
const myPos = document.getElementById("myPos");
var exp_counter = 1;

// Friends Details Panel
var buddiesPanel = document.getElementById("bud-panel");
var buddiesContent = document.querySelector(".buddiesContent");
var firstFrndMsgIcon = document.getElementById("first-frnd-msgIcon");
var secondFrndMsgIcon = document.getElementById("second-frnd-msgIcon");
var thirdFrndMsgIcon = document.getElementById("third-frnd-msgIcon");
var first_panel_counter = 1;
var second_panel_counter = 1;
var third_panel_counter = 1;

function displayBuddyPanel(content) {
    buddiesPanel.classList.add("open-buddiesPanel");
    content ? buddiesContent.style.display = 'none' : buddiesContent.style.display = 'block';
    globalV.isBuddyPanelOpened = true;
}

var hide_buddiesPanel = (x) => {
    buddiesPanel.classList.remove("open-buddiesPanel");
    globalV.isBuddyPanelOpened = false;
    first_panel_counter = x;
    second_panel_counter = x;
    third_panel_counter = x;
}

var show_frndMsgIcon = (route) => {
    if (!chatPanelOpened) {
        if (route === 'first') {
            firstFrndMsgIcon.style.display = "block";
    
        } else if (route === 'second') {
            secondFrndMsgIcon.style.display = "block";
    
        } else if (route === 'third') {
            thirdFrndMsgIcon.style.display = "block";
    
        }
    }
}

var remove_frndMsgIcon = (x1, x2, x3) => {
    firstFrndMsgIcon.classList.remove(x1);
    secondFrndMsgIcon.classList.remove(x2);
    thirdFrndMsgIcon.classList.remove(x3);
    
}

var change_frndMsgIcon = (x1, x2, x3) => {
    secondFrndMsgIcon.classList.add(`bx ${x1}`);
    secondFrndMsgIcon.classList.add(`bx ${x2}`);
    secondFrndMsgIcon.classList.add(`bx ${x3}`);

}

// Buddies Panel Interaction
function show_buddiesPanel(arg) {
    if (globalV.disabledAll !== true) {
        if (globalV.disabled !== true) { 
            if (arg === 'first') {
                first_panel_counter++;
                second_panel_counter = 1;
                third_panel_counter = 1;
                
                if (first_panel_counter % 2 === 0) {
                    hideExpandButtonItems();
                    defaultMsgNote('first');
                    image1.style.border = "3px solid red"; // first frnd default to red border indicating first frnd active to chat and interact
                    image2.style.border = "1px solid #050c74"; // remain normal border unless clicked or visited
                    image3.style.border = "1px solid #050c74";
                    displayBuddyPanel();
                    remove_frndMsgIcon("bx-mail-send");
                    globalV.defaultFrndToInteract = arg;
    
                } else {
                    hide_buddiesPanel(1);
                }
                
            } else if (arg === 'second') {
                second_panel_counter++;
                first_panel_counter = 1;
                third_panel_counter = 1;
                
                if (second_panel_counter % 2 === 0) {
                    hideExpandButtonItems();
                    defaultMsgNote('second');
                    image2.style.border = "3px solid red"; // active frnd
                    image1.style.border = "1px solid #050c74";
                    image3.style.border = "1px solid #050c74";
                    displayBuddyPanel();
                    remove_frndMsgIcon(null, "bx-mail-send");
                    globalV.defaultFrndToInteract = arg;
                    // change_frndMsgIcon();
                    
                } else {
                    hide_buddiesPanel(1);
                } 
    
            } else if (arg === 'third') {
                third_panel_counter++;
                first_panel_counter = 1;
                second_panel_counter = 1;
                
                if (third_panel_counter % 2 === 0) {
                    hideExpandButtonItems();
                    defaultMsgNote('third');
                    image3.style.border = "3px solid red"; // active frnd
                    image1.style.border = "1px solid #050c74";
                    image2.style.border = "1px solid #050c74";
                    displayBuddyPanel();
                    remove_frndMsgIcon(null, null, "bx-mail-send");
                    globalV.defaultFrndToInteract = arg;
                    
                } else {
                    hide_buddiesPanel(1);
                }
            }
            exp_counter = 1;
    
        }

    }
}

// expander Items function
var openExpandButtonItems = () => {
    Clear.classList.add("open-Clear");
    Illustration.classList.add("open-Ilustration");
    recordMe.classList.add("open-recordMe");
    indicators.classList.add("open-indicators");
    my_area.classList.add("open-my-area");
}
var hideExpandButtonItems = () => {
    Clear.classList.remove("open-Clear");
    Illustration.classList.remove("open-Ilustration");
    recordMe.classList.remove("open-recordMe");
    indicators.classList.remove("open-indicators");
    my_area.classList.remove("open-my-area");

    exp_counter = 1;
    illusPaused = false;
}

expander.addEventListener("click", e => {
    if (globalV.disabledAll !== true) {
        if (globalV.disabled !== true) {
            exp_counter++;
            if (exp_counter % 2 === 0) {
                openExpandButtonItems();
                hide_buddiesPanel(1);
                
            } else {
                hideExpandButtonItems();
    
            }
        }

    }

});

// expander_button_items
var Clear_btn = document.getElementById("Clear_btn");
var Illustration_btn = document.getElementById("Ilustration_btn");
var my_area_btn = document.getElementById("my_area_btn");
var indicators_btn = document.getElementById("indicators_btn");
var recordMe_btn = document.getElementById("recordMe_btn");
var activation_expander_button_counter_1 = 1;
var activation_expander_button_counter_2 = 1;
var activation_expander_button_counter_3 = 1;
var activation_expander_button_counter_4 = 1;
var activation_expander_button_counter_5 = 1;
var defaultIndicator_count = 1, dropDownIconPressCounter_2 = 1, 
dropDownIconPressCounter_3 = 1, dropDownIconPressCounter_4 = 1, 
dropDownIconPressCounter_5 = 1, customIndicatorCount = 1;
var masterName, activeBtn = undefined;

var activate_expander_button_items = (arg, indexPrefix) => {
    arg.style.background = "white";
    arg.style.color = "#050c74";
    arg.style.padding = "3px 7px";
    arg.style.border = "1px solid #050c74";
    try{
        document.getElementById(`exp-icon-${indexPrefix}`).style.color = "#050c74";
    } catch(err) {
        return false;
    }
}

var deActivate_expander_button_items = (...arg) => {
    arg.forEach(e => {
        if (typeof e !== Number) {
            try{
                e.style.background = "";
                e.style.color = "";
                e.style.padding = "";
                e.style.border = "";
                
            } catch(err) {
                return false;
            }
        }
    });

    // Restore the rest of the button iteration
    activation_expander_button_counter_1 = arg.at(4) !== 1 ? 1 : false;
    activation_expander_button_counter_2 = arg.at(4) !== 2 ? 1 : false;
    activation_expander_button_counter_3 = arg.at(4) !== 3 ? 1 : false;
    activation_expander_button_counter_4 = arg.at(4) !== 4 ? 1 : false;
    activation_expander_button_counter_5 = arg.at(4) !== 5 ? 1 : false;
    
    // hide some dropdown of some parent btns
    boundryDropDownMenu.style.display = arg.at(4) !== 1 ? "none" : 'block';
    IndicatorDropDownMenu.style.display = arg.at(4) !== 2 ? "none" : 'inline-block';
    record.style.display = arg.at(4) !== 3 ? "none" : 'inline-block';
    Illus.style.display = arg.at(4) !== 4 ? 'none' : 'inline-block';
    deletion.style.display = arg.at(4) !== 5 ? 'none' : 'inline-block';
    
    arg.at(4) !== 2 ? customInd.style.display = 'none' : '';
    
    try {
        document.getElementById("exp-icon-1").style.color = arg.at(4) !== 1 ? "#fff" : "#050c74"; //for Icon 
        document.getElementById("exp-icon-2").style.color = arg.at(4) !== 2 ? "#fff" : "#050c74";
        document.getElementById("exp-icon-3").style.color = arg.at(4) !== 3 ? "#fff" : "#050c74";
        document.getElementById("exp-icon-4").style.color = arg.at(4) !== 4 ? "#fff" : "#050c74";
        document.getElementById("exp-icon-5").style.color = arg.at(4) !== 5 ? "#fff" : "#050c74";

    } catch (err) {
        return false;
    }
    
}

function checkUserPosBtn(arg) {
    let posIcon = document.getElementById('posIcon');
    if (arg) {
        myPos.classList.add('activeIndicatorIcon');
        myPos.style.color = "#ff0000";
        setTimeout(() => {
            posIcon.style.color = "#ff0000";
            accSignal.style.display = 'inline-block';
        }, 1000);
        
    } else {
        myPos.classList.remove('activeIndicatorIcon');
        myPos.style.color = "#fff";
        posIcon.style.color = "#fff";
        accSignal.style.display = 'none';
    }

}

function active_expander_button_items(arg) {
    if (globalV.userLogIn) {
        this.checked = Book.get(Book._ON);
        if (globalV.disabledAll !== true) {
            if (arg === 'my-area') {
                activation_expander_button_counter_1++;
                if (activation_expander_button_counter_1 % 2 === 0) {
                    boundryDropDownMenu.style.display = "block";
                    activate_expander_button_items(my_area_btn, 1);
                    resetAllDropdownMenu();
                    activeMethod = 'My Boundry';
                    startMapClick = false;
                    startIllust = false;
                    readOut('My Boundry', '');
    
                    deActivate_expander_button_items(indicators_btn, recordMe_btn, Illustration_btn, Clear_btn, 1);
    
                     // reset indicaors dropdown 
                     resetDropDown(true, null, true);
                     this.checked !== 'false' ? checkUserPosBtn(myPos) : '';
        
                } else {
                    boundryDropDownMenu.style.display = "none";
                    deActivate_expander_button_items(my_area_btn);
                    setTimeout(hideExpandButtonItems, 100);
                    activeMethod = undefined;
                    readOut('', '');
                }
    
            } else if (arg === 'indicators') {
                activation_expander_button_counter_2++;
                if (activation_expander_button_counter_2 % 2 === 0) {
                    IndicatorDropDownMenu.style.display = "inline-block";
                    activate_expander_button_items(indicators_btn, 2);
                    resetAllDropdownMenu();
                    activeMethod = arg;
                    activeBtn = undefined;
                    startMapClick = true;
                    startIllust = false;
                    
                    readOut('Indicators', '');
            
                    deActivate_expander_button_items(my_area_btn, recordMe_btn, Illustration_btn, Clear_btn, 2);
    
                    // reset indicaors dropdown 
                    resetDropDown(true, true, true);
        
                } else {
                    deActivate_expander_button_items(indicators_btn);
                    IndicatorDropDownMenu.style.display = "none";
                    setTimeout(hideExpandButtonItems, 200);
                    activeMethod = undefined;
                    startMapClick = false;
                    readOut('', '');
                }
        
            } else if (arg === 'recordMe') {
                activation_expander_button_counter_3++;
                if (activation_expander_button_counter_3 % 2 === 0) {
                    activate_expander_button_items(recordMe_btn, 3);
                    resetAllDropdownMenu();
                    activeMethod = undefined;
                    startMapClick = false;
                    startIllust = false;
                    record.style.display = "inline-block"
                    readOut('RecordMe', '');
            
                    deActivate_expander_button_items(my_area_btn, indicators_btn, Illustration_btn, Clear_btn, 3);
        
                } else {
                    deActivate_expander_button_items(recordMe_btn);
                    setTimeout(hideExpandButtonItems, 100);
                    record.style.display = "none";
                    activeMethod = undefined;
                    readOut('', '');
                }
    
            } else if (arg === 'Illustration') {
                activation_expander_button_counter_4++;
                if (activation_expander_button_counter_4 % 2 === 0) {
                    activate_expander_button_items(Illustration_btn, 4);
                    Illus.style.display = 'inline-block';
                    resetAllDropdownMenu();
                    activeMethod = arg;
                    startMapClick = false;
                    startIllust = true;
                    readOut(arg, '');
            
                    deActivate_expander_button_items(my_area_btn, indicators_btn, recordMe_btn, Clear_btn, 4);
    
                    // reset indicaors dropdown 
                    resetDropDown(true, null, true);
        
                } else {
                    deActivate_expander_button_items(Illustration_btn);
                    setTimeout(hideExpandButtonItems, 100);
                    Illus.style.display = 'none';
                    activeMethod = undefined;
                    startIllust = false;
                    readOut('', '');
                }
    
            } else if (arg === 'Clear') {
                activation_expander_button_counter_5++;
                if (activation_expander_button_counter_5 % 2 === 0) {
                    activate_expander_button_items(Clear_btn, 5);
                    deletion.style.display = "inline-block";
                    resetAllDropdownMenu();
    
                    deActivate_expander_button_items(my_area_btn, indicators_btn, recordMe_btn, Illustration_btn, 5);
                    readOut('', '');
                    // reset indicaors dropdown 
                    resetDropDown(true, true);
        
                } else {
                    deActivate_expander_button_items(Clear_btn);
                    deletion.style.display = "none";
                    setTimeout(hideExpandButtonItems, 200);
                }
    
            }
    
            exp_counter = 1;
    
        }

    } else {
        open_toast('Log in please', 0);
    }
}

// ======================== boundryDropDownMenu ====================================
var Post = document.getElementById("Post"); 
var Call = document.getElementById("Call");
var Measurement = document.getElementById("Measurement");

function checkBoundryIcon(arg) {
    arg !== Post ? Post.classList.remove('activeIndicatorIcon') : 
    Post.classList.add('activeIndicatorIcon');
    arg !== Call ? Call.classList.remove('activeIndicatorIcon') : 
    Call.classList.add('activeIndicatorIcon');
    arg !== Measurement ? Measurement.classList.remove('activeIndicatorIcon') : 
    Measurement.classList.add('activeIndicatorIcon');
}

Post.addEventListener('click', e => {
    dropDownIconPressCounter_2++;
    if (dropDownIconPressCounter_2 % 2 === 0) {
        checkBoundryIcon(Post);
        setTimeout(hideExpandButtonItems, 100);
        activeBtn = 'Post';
        readOut('My Boundry', 'Post');

        // reset members count state
        dropDownIconPressCounter_3 = 1;
        dropDownIconPressCounter_4 = 1;
        
    } else {
        checkBoundryIcon();
        setTimeout(hideExpandButtonItems, 100);
        activeBtn = undefined;
        readOut('', '');
        
    }
    
});

Call.addEventListener('click', e => {
    dropDownIconPressCounter_3++;
    if (dropDownIconPressCounter_3 % 2 === 0) {
        checkBoundryIcon(Call);
        setTimeout(hideExpandButtonItems, 100);
        activeBtn = 'Call';
        readOut('My Boundry', 'Call');

        // reset members count state
        dropDownIconPressCounter_2 = 1;
        dropDownIconPressCounter_4 = 1;
        
    } else {
        checkBoundryIcon();
        setTimeout(hideExpandButtonItems, 100);
        activeBtn = undefined;
        readOut('', '');
        
    }
    
});

Measurement.addEventListener('click', e => {
    dropDownIconPressCounter_4++;
    if (dropDownIconPressCounter_4 % 2 === 0) {
        setTimeout(hideExpandButtonItems, 100);

        // reset members count state
        dropDownIconPressCounter_2 = 1;
        dropDownIconPressCounter_3 = 1;
        
    } else {
        checkBoundryIcon();
        setTimeout(hideExpandButtonItems, 100);
        activeBtn = undefined;
        readOut('', '');
        
    }
    
});


// ======================== IndicatorDropDownMenu ====================================
var defaultIndicator = document.getElementById("def-icon");
var customIndicator = document.getElementById("custom");
var customInd = document.querySelector(".customInd"); // customIndicator
var HomeIcon = document.getElementById("Home");
var SchoolIcon = document.getElementById("School");
var InstituationIcon = document.getElementById("Instituation");
var BankIcon = document.getElementById("Bank");
var StoreIcon = document.getElementById("Store");

function check_IndicatorIcon(arg) {
    arg !== defaultIndicator ? defaultIndicator.classList.remove("activeIndicatorIcon") :
    defaultIndicator.classList.add("activeIndicatorIcon");
    arg !== HomeIcon ? HomeIcon.classList.remove("activeIndicatorIcon") :
    HomeIcon.classList.add("activeIndicatorIcon");
    arg !== SchoolIcon ? SchoolIcon.classList.remove("activeIndicatorIcon") :
    SchoolIcon.classList.add("activeIndicatorIcon");
    arg !== InstituationIcon ? InstituationIcon.classList.remove("activeIndicatorIcon") :
    InstituationIcon.classList.add("activeIndicatorIcon");
    arg !== BankIcon ? BankIcon.classList.remove("activeIndicatorIcon") :
    BankIcon.classList.add("activeIndicatorIcon");
    arg !== StoreIcon ? StoreIcon.classList.remove("activeIndicatorIcon") :
    StoreIcon.classList.add("activeIndicatorIcon");
    arg !== customIndicator ? customIndicator.classList.remove("activeIndicatorIcon") :
    customIndicator.classList.add("activeIndicatorIcon");

    // reset members count state
    arg !== defaultIndicator ? defaultIndicator_count = 1 : false;
    arg !== HomeIcon ? dropDownIconPressCounter_1 = 1 : false;
    arg !== SchoolIcon ? dropDownIconPressCounter_2 = 1 : false;
    arg !== InstituationIcon ? dropDownIconPressCounter_3 = 1 : false;
    arg !== BankIcon ? dropDownIconPressCounter_4 = 1 : false;
    arg !== StoreIcon ? dropDownIconPressCounter_5 = 1 : false;
    arg !== customIndicator ? customIndicatorCount = 1 : false;

    arg !== customIndicator ? customInd.style.display = 'none' : false;
}

defaultIndicator.addEventListener("click", e => {
    defaultIndicator_count++;
    if (defaultIndicator_count % 2 === 0) {
        check_IndicatorIcon(defaultIndicator);
        setTimeout(hideExpandButtonItems, 100);
        startMapClick = true;
        activeBtn = 'icon0';
        readOut('Indicators', ' Default Icon');

    } else {
        check_IndicatorIcon();
        setTimeout(hideExpandButtonItems, 100);
        startMapClick = false;
        activeBtn = undefined;
        readOut('', '');
        
    } 

});
HomeIcon.addEventListener('click', e => {
    dropDownIconPressCounter_1++;
    if (dropDownIconPressCounter_1 % 2 === 0) {
        check_IndicatorIcon(HomeIcon);
        setTimeout(hideExpandButtonItems, 100);
        startMapClick = true;
        activeBtn = 'icon1';
        readOut('Indicators', 'Home Icon');
        
    } else {
        check_IndicatorIcon();
        setTimeout(hideExpandButtonItems, 100);
        startMapClick = false;
        activeBtn = undefined;
        readOut('', '');
        
    }
    
});
SchoolIcon.addEventListener('click', e => {
    dropDownIconPressCounter_2++;
    if (dropDownIconPressCounter_2 % 2 === 0) {
        check_IndicatorIcon(SchoolIcon);
        setTimeout(hideExpandButtonItems, 100);
        startMapClick = true;
        activeBtn = 'icon2';
        readOut('Indicators', 'School Icon');
        
    } else {
        check_IndicatorIcon();
        setTimeout(hideExpandButtonItems, 100);
        startMapClick = false;
        activeBtn = undefined;
        readOut('', '');   
    }
    
});
InstituationIcon.addEventListener('click', e => {
    dropDownIconPressCounter_3++;
    if (dropDownIconPressCounter_3 % 2 === 0) {
        check_IndicatorIcon(InstituationIcon);
        setTimeout(hideExpandButtonItems, 100);
        startMapClick = true;
        activeBtn = 'icon3';
        readOut('Indicators', 'Inst... Icon');
        
    } else {
        check_IndicatorIcon();
        setTimeout(hideExpandButtonItems, 100);
        startMapClick = false;
        activeBtn = undefined;
        readOut('', '');
    }
    
});
BankIcon.addEventListener('click', e => {
    dropDownIconPressCounter_4++;
    if (dropDownIconPressCounter_4 % 2 === 0) {
        check_IndicatorIcon(BankIcon);
        setTimeout(hideExpandButtonItems, 100);
        startMapClick = true;
        activeBtn = 'icon4';
        readOut('Indicators', 'Bank Icon');
        
    } else {
        check_IndicatorIcon();
        setTimeout(hideExpandButtonItems, 100);
        startMapClick = false;
        activeBtn = undefined;
        readOut('', '');
    }
    
});
StoreIcon.addEventListener('click', e => {
    dropDownIconPressCounter_5++;
    if (dropDownIconPressCounter_5 % 2 === 0) {
        check_IndicatorIcon(StoreIcon);
        setTimeout(hideExpandButtonItems, 100);
        startMapClick = true;
        activeBtn = 'icon5';
        readOut('Indicators', 'Store Icon');
        
    } else {
        check_IndicatorIcon();
        setTimeout(hideExpandButtonItems, 100);
        startMapClick = false;
        activeBtn = undefined;
        readOut('', '');
    }
    
});
customIndicator.addEventListener("click", e => {
    customIndicatorCount++;
    if (customIndicatorCount % 2 === 0) {
        check_IndicatorIcon(customIndicator);
        setTimeout(hideExpandButtonItems, 100);
        setTimeout(() => customInd.style.display = 'flex', 150); // makes it appeared
        startMapClick = true;
        activeBtn = 'custom';
        readOut('Indicators', ' Custom');

        if (customIndSet === true) {
            isText === true && isImage === false || isText === true && isImage === true ? editCustomInd.style.display = "inline-block" :
            isImage === true && isText === false ? editCustomInd.style.display = 'none' : '';

        } else {
            editCustomInd.style.display = "none";
        }
        
    } else {
        check_IndicatorIcon();
        customInd.style.display = 'none'; // makes it disappeared
        setTimeout(hideExpandButtonItems, 100);
        startMapClick = false;
        activeBtn = undefined;
        readOut('', '');
        
    } 

});

// Reset Other Parent Dropdown
function resetDropDown(ind, guide, del) {
    if (ind) {
        customIndicatorCount = 1;
        dropDownIconPressCounter_1 = 1;
        dropDownIconPressCounter_2 = 1;
        dropDownIconPressCounter_3 = 1;
        dropDownIconPressCounter_4 = 1;
        dropDownIconPressCounter_5 = 1;
    }

    if (guide && guide !== null) {
        selfPressCount = 1;
        bothPressCount = 1;
    }
}

let delOne = document.getElementById("delOne");
let delAll = document.getElementById("delAll");
var delPressCount;

function selectedIndicatorIcon(arg, activeClass) {
    arg.classList.add(activeClass);
}

function showAndHide(x, y, z) {
    delPressCount = z;
    delPressCount++;
    if (delPressCount % 2 === 0) {
        selectedIndicatorIcon(x, 'activeIndicatorIcon');
        y.classList.remove('activeIndicatorIcon');
        setTimeout(hideExpandButtonItems, 100);
        deletion.style.display = "none";
        activation_expander_button_counter_5 = 1;

    } else {
        x.classList.remove('activeIndicatorIcon');
    }
}

let Self = document.getElementById("Self");
let Both = document.getElementById("Both");
var selfPressCount = 1, bothPressCount = 1;
Self.addEventListener("click", e => {
    selfPressCount++;
    bothPressCount = 1;
    if (selfPressCount % 2 === 0 ) {
        selectedIndicatorIcon(Self, 'activeIndicatorIcon');
        Both.classList.remove('activeIndicatorIcon');
        activation_expander_button_counter_4 = 1;
        setTimeout(hideExpandButtonItems, 100);
        clearMobileIllustration = false;
        activeBtn = 'Self';
        
    } else {
        Self.classList.remove('activeIndicatorIcon');
        activeBtn = undefined;
        readOut('', '');
        clearMobileIllustration = true;
        setTimeout(hideExpandButtonItems, 100);
    }
});

Both.addEventListener("click", e => {
    bothPressCount++;
    selfPressCount = 1;
    if (bothPressCount % 2 === 0) {
        selectedIndicatorIcon(Both, 'activeIndicatorIcon');
        Self.classList.remove('activeIndicatorIcon');
        activation_expander_button_counter_4 = 1;
        setTimeout(hideExpandButtonItems, 100);
        clearMobileIllustration = false;
        activeBtn = 'Both';
        
    } else {
        Both.classList.remove('activeIndicatorIcon');
        activeBtn = undefined;
        readOut('', '');
        clearMobileIllustration = true;
        setTimeout(hideExpandButtonItems, 100);
    }
});

// ===================================================================== Custom pop buttons ======================================================================
var setCustomInd = document.getElementById("setCustomInd");
var editCustomInd = document.getElementById("editCustomInd");
var textArea = document.getElementById("textArea");
var imgUploader = document.getElementById("imgUploader");
var Cstm_image = document.getElementById("customIndImg");
var imgLblBtn = document.getElementById('label');
var delImg = document.getElementById('delImg');
var customIndSet = false, isImage = false, isText = false, isImgDel = false, customIndTextMessage, customIndImg;

textArea.addEventListener('keyup', e => {
    textArea.style.height = "30px";
    let height = e.target.scrollHeight;
    if (height <= 85) {
        textArea.style.height = `${height}px`;
    } else {
        textArea.style.height = `90px`;
    }
});

setCustomInd.addEventListener("click", e => {
    if (textArea.value.length !== 0 && imgUploader.files[0] !== undefined) {
        customIndTextMessage = textArea.value;
        textArea.setAttribute('readonly', 'true');
        textArea.style.outline = 'none';
        customIndSet = true;
        isText = true, isImage = true;
        
    } else if (textArea.value.length !== 0 && imgUploader.files[0] === undefined) {
        customIndTextMessage = textArea.value;
        textArea.setAttribute('readonly', 'true');
        textArea.style.outline = 'none';
        customIndSet = true;
        isText = true;
        
    } else if (textArea.value.length === 0 && imgUploader.files[0] !== undefined) {
        isImgDel === false ? customIndSet = true : customIndSet = false;
        customIndTextMessage = '';
        isImage = true;
        isImgDel = false;

    }

    customIndSet === false ? open_toast("Not Set") : '';
    customInd.style.display = 'none';
    setTimeout(hideExpandButtonItems, 100);
    customIndicatorCount = 1;
});

imgUploader.onchange = () => { // Custom indicator img uploader
    if (imgUploader.files[0]) {
        Cstm_image.style.display = 'flex';
        delImg.style.display = 'flex';
        imgLblBtn.innerHTML = 'Change Image';
        Cstm_image.src = URL.createObjectURL(imgUploader.files[0]);
        customIndImg = imgUploader.files[0];
    }
}

delImg.addEventListener("click", del => {
    Cstm_image.src = undefined;
    Cstm_image.style.display = 'none';
    delImg.style.display = 'none';
    imgLblBtn.innerHTML = 'Add Image';
    isImgDel = true;

})

editCustomInd.addEventListener("click", e => {
    textArea.removeAttribute('readonly');
    textArea.style.outline = 'auto';
    textArea.focus();
});

function resetAllDropdownMenu() {
    checkBoundryIcon('activeIndicatorIcon', 'activeIndicatorIcon', 'activeIndicatorIcon', 'activeIndicatorIcon');
    check_IndicatorIcon('activeIndicatorIcon', 'activeIndicatorIcon', 'activeIndicatorIcon', 'activeIndicatorIcon', 'activeIndicatorIcon', 'activeIndicatorIcon');
    delOne.classList.remove('activeIndicatorIcon');
    delAll.classList.remove('activeIndicatorIcon');
    Self.classList.remove('activeIndicatorIcon');
    Both.classList.remove('activeIndicatorIcon');
}

// Bottom App Bar
function checkedButton (homeColor, shareLocColor, chatColor, tourColor, readMeColor) {
    //  home button
    home.style.color = homeColor;
    sp_home.style.color = homeColor;

    //  shareLoc button
    shareLoc.style.color = shareLocColor;
    sp_shareLoc.style.color = shareLocColor;

    //  chat button
    chat.style.color = chatColor;
    sp_chat.style.color = chatColor;

    //  tour button
    tour.style.color = tourColor;
    sp_tour.style.color = tourColor;

    //  readMe button
    readMe.style.color = readMeColor;
    sp_readMe.style.color = readMeColor;
}

//  changing the color of every clicked btn
function activeButton(e){
    if (globalV.userLogIn) {
        if (e === 'home') {
            checkedButton(setColor, unSetColor, unSetColor, unSetColor, unSetColor);
            globalV.disabledAll === false ? window.location.href = "/WebG/Home" : false;

        } else if (e === 'chat') {
            globalV.userLogIn ? showChatSection() : open_toast('Log in', 0);

        } else if (e === 'tour') {
                if (globalV.disabledAll !== true) {
                    checkedButton(unSetColor, unSetColor, unSetColor, setColor, unSetColor);
                    window.location.href = "/WebG/Tour";
                }
                
        } else if(e === 'readMe') {
            checkedButton(unSetColor, unSetColor, unSetColor, unSetColor, setColor);
            window.location.href = "/WebG/readMe";
        }

    } else {
        open_toast("Log in please", 0);
    }
}
// Global function
var toast = document.getElementById("toast");
var toastPara = document.getElementById("toastPara");
function open_toast(msg, extendFadeDuration, arg) {
    toastPara.innerHTML = msg;
    toast.classList.add("open-toast");
    toast.style.opacity = "1";
    isMobile ? toastPara.style.fontSize = ".7em" : false;
    if (extendFadeDuration === 0) {
        setTimeout(fadeIn_toast, 5000);
    } else {
        setTimeout(fadeIn_toast, 4000);
    }
}

function fadeIn_toast(arg) {
    toast.style.opacity = "0";
    if (!arg) {
        let close = () => {
            toast.classList.remove("open-toast");
        }
        setTimeout(close, 500);
    } else {
        toast.classList.remove("open-toast");
    }
}

function notificationAlert(hide) {
    if(hide) {
        msgSymbol.style.display = 'none';
    } else {
        msgSymbol.style.display = "flex";
    }
}

// CHAT PANEL ==========================================================
function showChatSection() {
    if (globalV.disabledAll !== true) {
        checkedButton(unSetColor, unSetColor, setColor, unSetColor, unSetColor);
        addChatStyle();
        let msgInput = document.getElementById("msgInput");
        let chatDelayTime = [500, 1000, 800, 600, 700, 900, 500, 300, 400, 200, 1100, 150, 250],
        displayChatTimeInterval = chatDelayTime[Math.floor(Math.random() * chatDelayTime.length)];
        
        hide_buddiesPanel(1);
        hideExpandButtonItems(); 
        showHome(false);
        
        showDefaultChatMsg();
        defaultMsgNote('chat');

        setTimeout(() => {
            msgInput.value = '';
            chatContainer.style.display = "block";   // show chat container
            chatPanelOpened = true;
        }, displayChatTimeInterval);
        
    }
    
}

function addChatStyle() {
    if (!document.getElementById('chatLink').href) {
        document.getElementById('chatLink').href = "/css/chat.css";
    }
}

notification.addEventListener("click", () => showNotificationPanel());
msgSymbol.addEventListener("click", () => showNotificationPanel());

function showNotificationPanel() {
    let chatDelayTime = [500, 1000, 800, 600, 700, 900, 500, 300, 400, 200, 1100, 150, 250],
        displayChatTimeInterval = chatDelayTime[Math.floor(Math.random() * chatDelayTime.length)];

        if (!globalV.disabledAll) {
            hide_buddiesPanel(1);
            hideExpandButtonItems();
            showHome(false);
    
            setTimeout(() => {
                document.getElementById("NotificationContainer").style.display = "flex";   // show Notification container
                notificationPanelOpened = true;
            }, displayChatTimeInterval);
        }
}

function showHome(q) {
    homeContentSection.style.display = q ? "block" : "none";
    footer.style.display = q ? "block" : "none";
    boardContainer.style.opacity = q ? "1" : "0";
    document.querySelector(".ConfirmationBody").style.visibility = q ? "visible" : "hidden";
    document.querySelector(".newReqAlert").style.display = "none";
}

function readOut(activist, text, buddiesPanel) {
    let readOut = document.getElementById("readOut");
    let colon = !activist ? '' : ':';
    
    if (buddiesPanel) {
        readOut.innerHTML = isMobile ? 
        `<p style="color:rgb(8, 252, 142);">You're with<u> ${activist}</u></p>` :
        `<p style="color:rgb(8, 252, 142);">You're interacting with<u> ${activist}</u></p>`;

    } else {
        readOut.innerHTML = `<p style="color:rgb(8, 252, 142);
        text-decoration: underline; padding-right: 5px;">${activist}${colon}</p> <aside style="color: #dbf7ff; font-size: 0.8em; margin-top: 1px">${text}</aside>`;

    }
}

function resizeImg(img) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    canvas.width = 350;
    canvas.height = 250;
    
    context.drawImage(img, 0, 0, 350, 250);
    let resizedImg = canvas.toDataURL("image/jpeg");
    return resizedImg;
}

// =================================== Profile Setting =======================================
var setting = document.querySelector(".setting_container");
menu.addEventListener('click', cl => {
    if (globalV.disabledAll !== true) {
        openSettingPanel();
        hide_buddiesPanel(1);
        hideExpandButtonItems();
    }
});

function openSettingPanel() {
    if (window.innerWidth <= 481 || isMobile) {
        setting.style.display = 'inline-block';
        setting.style.width = '100%';
        footer.style.display = 'none';
    } else {
        setting.style.display = 'inline-block';
        setting.style.width = '50%';
        footer.style.zIndex = '0';
        globalV.disabledAll = true;
    }
}

var automateGuest = document.getElementById("automate");
var isAutomate = document.getElementById("isAutomate");
globalV.countAutomateGuestClick = 0;

automateGuest.addEventListener('click', cl => {
    if (globalV.userLogOut === false && globalV.userLogIn) {
        globalV.countAutomateGuestClick++;
        if (globalV.countAutomateGuestClick % 2 === 1) {
            showAutomateChecked();
            Book.set(Book.guestIconAuto, true);
            
        } else {
            showAutomateChecked(false);
            Book.remove(Book.guestIconAuto);
        }
    }
        
});

function showAutomateChecked(show) {
    window.innerWidth <= 381 ? automateGuest.innerHTML = show !== false ? "Automate" : "Automate" : "";
    isAutomate.style.display = show !== false ? "block" : "none";
    window.innerWidth <= 381 ? automateGuest.appendChild(isAutomate) : '';
    globalV.countAutomateGuestClick = show !== false ? 1 : 0;
}

var lang = document.getElementById("lang");
lang.addEventListener("click", cl => {
    lang.innerHTML = `Language <pre>default to English</pre>`;
    setTimeout(() => {
        lang.innerHTML = "Language";
    }, 3000);
});

document.getElementById("sett-nav")
.addEventListener('click', cl => {
    closeSettingPanel();
});

function closeSettingPanel() {
    setting.style.display = 'none';
    footer.style.display = 'block';
    footer.style.zIndex = '1000';
    globalV.disabledAll = false;
}
var username = document.getElementById('username');
var userPhoneNo = document.getElementById('sim');
var editProfileImg = document.getElementById('editProfileImg');
var boardContainer = document.querySelector(".userConsent");
var yesLogOut = document.getElementById('yes');
var nope = document.getElementById('no');
var closeMea = document.getElementById('closeMea');

var _log = document.getElementById("log");
_log.addEventListener("click", cl => {
    closeSettingPanel();
    if (globalV.userLogOut === false && globalV.userLogIn) {
        setTimeout(() => {
            board('Do you sure you want to Log out from WebG?', true);
        }, 100);
        
    } else {
        setTimeout(() => {
            window.location.href = "/WebG/LogIn";
        }, 100);
        
    }

});

function justifyBoard(top) {
    if (top) {
        boardContainer.style.top = top;
        boardContainer.style.width = 'fit-content';
        boardContainer.style.padding = '5px 11px';

        closeMea.style.display = 'inline';
        closeMea.style.top = top == '-73%' ? '-90%' : top;

        nope.style.display = 'none';
        yesLogOut.style.display = 'none';

    } else {
        boardContainer.style.top = '0px';
        boardContainer.style.width = '50%';
        boardContainer.style.padding = '15px 20px 10px 20px';
        globalV.disabledAll = true;
        
        nope.style.display = 'block';
        closeMea.style.display = 'none';
        yesLogOut.style.display = 'block';
        nope.addEventListener('click', cl => closeBoard());
    }
}

function board(text, btns, cls) {
    if (!globalV.disabledAll) {
        boardContainer.style.display = 'flex';
        !btns && !cls && globalV.defaultFrndToInteract ? justifyBoard('-73%') :
        !btns && !cls && !globalV.defaultFrndToInteract ? justifyBoard('-85%') : justifyBoard();
        document.getElementById('messageToUser').innerHTML = text;
        cls ? [yesLogOut.classList.add(cls), isMobile?boardContainer.style.width = '75%':''] : '';

    }

}

yesLogOut.addEventListener('click', cl => {
    const className = cl.target.classList.toString();
    !className ? loggingOut() : ''; 
});

function closeBoard() {
    boardContainer.style.display = 'none';
    globalV.disabledAll = false;
}

function loggingOut() {
    fetch('/WebG/logOut', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ logOut: true })
    })
    .then(res => res.json())
    .then(result => {
        if (result.redirect === true) {
            homeContentSection.style.display = "none"; // Hide the hm page
            footer.style.display = "none";
            document.body.style.backgroundColor = "#050c7428";
            setTimeout(() => {
                window.location.href = "/WebG/LogIn";
            }, 1000);

        } else {

        }
    })
    .catch(err => {
        return false;
    });
}

const formData = new FormData();
var profileImgUploader = document.getElementById("_profileImgUploader"),
    imgLoadErr = document.getElementById("imgLoadErr");
profileImgUploader.onchange = () => {
    if (globalV.userLogIn) {
        const reader = new FileReader();
        const imgFile = profileImgUploader.files[0];
        try{
            reader.readAsArrayBuffer(imgFile);
            reader.onload = async() => {
                const result = reader.result;
                const byte = new Uint8Array(result);
                const fitByte = byte.byteLength;
                
                if (imgFile && (fitByte <= (1.5 * 1024 * 1024))) {
                    try{
                        formData.append('imgFile', imgFile);
                        await fetch('/WebG/upload_Profile_Image', {
                            method: 'POST',
                            body: formData
                        })
                        .then( res => res.json())
                        .then( result => {
                            result.redirect ? window.location.href = 'Home' : false;
                        })
                        .catch(err => ImgLoadError('Something went wrong, try again.'));
                        
                    } catch (err) {
                        ImgLoadError('Something went wrong while processing image file.');
                    }
                    
                } else {
                    ImgLoadError('Image file exceeded the required limit.');
                }
            }
            
        } catch (err) {
            ImgLoadError('Something went wrong while processing image file.');    
        }
    
        function ImgLoadError(err) {
            imgLoadErr.innerHTML = err;
            setTimeout(() => {
                imgLoadErr.innerHTML = '';
            }, 7000);
        }
    } else {
        window.location.href = 'Login';
    }
    
}

function checkSignedUser(msg) {
    if (msg.ok) {
        globalV.userLogIn = msg.ok;
        username.innerHTML = msg.username;
        userPhoneNo.innerHTML = msg.phoneNo;
        editProfileImg.style.display = 'block';
        _log.innerHTML = 'Log out';
        Book.get(Book.guestIconAuto) ? showAutomateChecked() : false;
        
    } else if (msg.logOut || !msg) {
        username.innerHTML = '';
        userPhoneNo.innerHTML = '';
        editProfileImg.style.display = 'none';
        _log.innerHTML = 'Log in'
        globalV.userLogOut = msg.logOut;
        
    } 

    // set user profile img
    userPic.src = "/WebG/image/self";
    document.getElementById("chatProfilePic").src = userPic.src; // Loading the user chat profile Pic
    document.getElementById("set-img").src = userPic.src;
}

const Book = {
    _localStr: localStorage,
    _ON: 'auto',
    guestIconAuto: 'isAuto',
  
    get: function(x) {
      this.checked = this._localStr.getItem(x);
      return this.checked;
    },
  
    set: function(x, y) {
      this._localStr.setItem(x, y);
    },
  
    remove: function(x) {
      this._localStr.removeItem(x);
    }
  
  }
//   showChatSection()