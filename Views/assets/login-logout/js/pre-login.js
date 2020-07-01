// function htmlDecode(input) {
//     let e = document.createElement('div');
//     e.innerHTML = input;
//     return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
// }
//
// function getLoggedDetails() {
//     localStorage.setItem("users-login", htmlDecode("<%= JSON.stringify(Users) %>"));
// }


function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


let $username = $("#username");
let $firstname = $("#firstname");
let $lastname = $("#lastname");
let $email = $("#email");
let $password = $("#password");
let $confirmPass = $("#re-password");

//does not match email
function checkEmail($input) {
    return validateEmail($('#' +$input.target.name).val());
}

//cant be left empty
function checkEmpty($input) {
    return $('#' +$input.target.name).val() !== "";
}

//Check the length of the Password
function checkLength() {
    return $password.val().length > 8;
}

//Check the length of the username, firstnam, lastname
function checkILength($input) {
    return $('#' +$input.target.name).val().length > 4;
}

//Check to see if the value for pass and confirmPass are the same
function samePass() {
    return $password.val() === $confirmPass.val();
}

//check if empty
function PassEmpty($input) {
    if (checkEmpty($input)) {
        $(`#${$input.target.name}`).next().hide();
        $('#' +$input.target.name).next().next().show();
    } else {
        $(`#${$input.target.name}`).next().show();
        $('#' +$input.target.name).next().next().hide();
    }
}

//check if empty
function PassEmail($input) {
    if (checkEmail($input)) {
        $('#' +$input.target.name).next().next().hide();
    } else {
        $('#' +$input.target.name).next().next().show();
    }
}

//If checkLength() is > 8 then we'll hide the hint
function PassLength() {
    if (checkLength()) {
        $password.next().hide();
    } else {
        $password.next().show();
    }
}

//If checkLength() is > 4 then we'll hide the hint
function PassILength($input) {
    if (checkILength($input)) {
        $('#' +$input.target.name).next().next().hide();
    } else {
        $('#' + $input.target.name).next().next().show();
    }
}

//If samePass returns true, we'll hide the hint
function PassMatch() {
    if (samePass()) {
        $confirmPass.next().hide();
    } else {
        $confirmPass.next().show();
    }
}

function canSubmit($input) {
    return samePass() && checkLength() && checkEmpty($input) && checkILength($input) && checkEmail($input);
}

// function canISubmit() {
//     return ;
// }

function enableSubmitButton() {debugger;
    $("#register").prop("disabled", !canSubmit());
}

// function enableISubmitButton($input) {
//     $("#register").prop("disabled", !canISubmit($input));
// }

//Calls the enableSubmitButton() function to disable the button
enableSubmitButton();


$username.keyup(PassEmpty).keyup(PassILength).keyup(enableSubmitButton);
$firstname.keyup(PassEmpty).keyup(PassILength).keyup(enableSubmitButton);
$lastname.keyup(PassEmpty).keyup(PassILength).keyup(enableSubmitButton);
$email.keyup(PassEmpty).keyup(PassEmail).keyup(enableSubmitButton);
$password.keyup(PassLength).keyup(PassMatch).keyup(enableSubmitButton);
$confirmPass.focus(PassMatch).keyup(PassMatch).keyup(enableSubmitButton);