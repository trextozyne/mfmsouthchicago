var devElement = new Image;
let devtoolsOpen = false, boolCloseLockModal = false, boolLoginLock = false;

const warningTimeout = 500000;
const timoutNow = 100000;
let warningTimerID, timeoutTimerID;


function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementsByClassName(elementId)[0];
    element.parentNode.removeChild(element);
}
function createLoginScreen (instruction) {
    if (document.querySelectorAll('.md-modal').length > 0 && document.querySelectorAll('.md-overlay').length > 0 && !boolCloseLockModal) {
        boolCloseLockModal = true;
        closeModalForm();
    }

    let alert = alertLoginModal(instruction);
    if (document.querySelectorAll('.md-modal').length < 1 && document.querySelectorAll('.md-overlay').length < 1) {
        document.body.insertAdjacentHTML('beforeend', alert);
    }

    //===in case of manual delete, return that joint perfectly
    if((document.querySelectorAll('.md-modal').length < 1 && document.querySelectorAll('.md-overlay').length > 0) ||
        (document.querySelectorAll('.md-modal').length > 0 && document.querySelectorAll('.md-overlay').length < 1)){
        document.querySelectorAll('.md-modal').length < 1 ? removeElement("md-overlay") : removeElement("md-modal");

        document.body.insertAdjacentHTML('beforeend', alert);
    }
}

function createLockScreen(instruction) {
    let alert = alertModal(instruction);
    if (document.querySelectorAll('.md-modal').length < 1 && document.querySelectorAll('.md-overlay').length < 1) {
        document.body.insertAdjacentHTML('beforeend', alert);
    }

    //===in case of manual delete, return that joint perfectly
    if((document.querySelectorAll('.md-modal').length < 1 && document.querySelectorAll('.md-overlay').length > 0) ||
        (document.querySelectorAll('.md-modal').length > 0 && document.querySelectorAll('.md-overlay').length < 1)){
        document.querySelectorAll('.md-modal').length < 1 ? removeElement("md-overlay") : removeElement("md-modal");

        document.body.insertAdjacentHTML('beforeend', alert);
    }
}

function startTimer() {
    // window.setTimeout returns an Id that can be used to start and stop a timer
    warningTimerID = window.setTimeout(warningInactive, warningTimeout);
}

function warningInactive() {
    window.clearTimeout(warningTimerID);
    timeoutTimerID = window.setTimeout(IdleTimeout, timoutNow);
    // $('#modalAutoLogout').modal('show');
    // alert();

    createLockScreen("You are about to be logged out!!!");
}

function resetTimer() {
    window.clearTimeout(timeoutTimerID);
    window.clearTimeout(warningTimerID);

    startTimer();
}

// Logout the user.
function IdleTimeout() {
    // alert("logged out")
    // document.getElementsByClassName('logout-form').submit();
    boolLoginLock = true;
    createLoginScreen("You will need to login");
}

function setupTimers () {
    window.addEventListener("scroll", resetTimer, {passive: true});

    document.addEventListener("mousemove", resetTimer, false);
    document.addEventListener("mousedown", resetTimer, false);
    document.addEventListener("keypress", resetTimer, false);
    document.addEventListener("touchmove", resetTimer, false);
    document.addEventListener("onscroll", resetTimer, false);
    startTimer();
}

function getFormData($form){

    let unindexed_array = $form.serializeArray();
    let indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

$(document).on('click','#btnStayLoggedIn',function() {
    resetTimer();

    let $form = $("#re_login_form");

    let formData = JSON.parse(JSON.stringify(getFormData($form)));
    debugger;
    let foundUser = JSON.parse(localStorage.getItem("user-login"));

    let user = foundUser.username === formData.username;
    let pass = foundUser.password === formData.password;

    if (!pass && !user) {
        // alert("Both do not exist/Incorrect!!!");
        document.getElementById("error-output").textContent = "Both do not exist/Incorrect!!!";
        document.getElementsByClassName("login-box")[0].classList.add("error");

        setTimeout(()=>{
            document.getElementsByClassName("login-box")[0].classList.remove("error");
            document.getElementById("error-output").textContent = "";
        }, 2000)
    } else if (!user && pass) {
        // alert("Username not exist/Incorrect!!!");
        document.getElementById("error-output").textContent = "Username not exist/Incorrect!!!";
        document.getElementsByClassName("login-box")[0].classList.add("error");

        setTimeout(()=>{
            document.getElementsByClassName("login-box")[0].classList.remove("error");
            document.getElementById("error-output").textContent = "";
        }, 2000)
    } else if (user && !pass) {
        // alert("Password not exist/Incorrect!!!");
        document.getElementById("error-output").textContent = "Password not exist/Incorrect!!!";
        document.getElementsByClassName("login-box")[0].classList.add("error");

        setTimeout(()=>{
            document.getElementsByClassName("login-box")[0].classList.remove("error");
            document.getElementById("error-output").textContent = "";
        }, 2000)
    } else if (user && pass) {
        boolLoginLock = false;
        boolCloseLockModal = false;

        closeModalForm();
    }
});

$(document).ready(function(){
    setupTimers();
});



function interval(func, wait, times){
    let outT = null;

    const interv = function (w, t) {
        return function () {
            if(outT !== null)
                t=0;

            if (typeof t === "undefined" || t-- > 0) {
                setTimeout(interv, w);
                try {
                    func.call(null);
                }
                catch (e) {
                    t = 0;
                    throw e.toString();
                }
            }
        };
    }(wait, times);


    setTimeout(interv, wait);

    return { cleared: function() {  outT = 0 ;   } };
}

devElement.__defineGetter__("id", function() {
    devtoolsOpen = true; // This only executes when devtools is open.
});

let getIntervalId = null;
let createDetectIntervalId = null;

function preventContinousLockScreen() {
    if(createDetectIntervalId)
        clearInterval(createDetectIntervalId);
}

function detectLockScreen() {
    detectBrowserOpen();

    if (boolLoginLock) {
        createLoginScreen("Dont do that Bro!!!, You need to login");
    }
}

function createContinousLockScreen() {
    createDetectIntervalId = setInterval(detectLockScreen, 1000);
}

function detectBrowserOpen() {
    devtoolsOpen = false;
    console.log(devElement);
    // document.getElementById('output').innerHTML += (devtoolsOpen ? "dev tools is open\n" : "dev tools is closed\n");

    if(devtoolsOpen) {
        if (createDetectIntervalId) {
            clearInterval(createDetectIntervalId);
        }
        if (getIntervalId) {
            getIntervalId.cleared();

            getIntervalId = null;
        }

        createContinousLockScreen();
    } else {
        preventContinousLockScreen();
    }
}

window.oncontextmenu = function ()    {
    getIntervalId = interval(detectBrowserOpen, 1000, 10);
};

detectBrowserOpen();
