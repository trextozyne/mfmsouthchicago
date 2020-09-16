
let getEvents_recur = [];
let _eventId = "";
let start_time, end_time = "";

//======check if windows just loaded=======
// loaded_on = true;
// function is_Load(){
//     loaded_on;
// }
// window.onload = is_Load;
//======check if windows just loaded=======

//======================perform all delete list(cards) operations======================
function prepare_isDeleteListCards() {

    let Items = document.getElementsByClassName("close"); // or document.querySelectorAll("li");
    for (let i = 0; i < Items.length; i++) {
        Items[i].onclick = function() {

            let functionName = this.getAttribute('onclick');
            eval(functionName);
            setTimeout(()=> {
                this.parentNode.parentNode.parentNode.remove();
            }, 1500)
        }
    }
}
//======================perform all delete list(cards) operations======================

function getFormData($form){

    let unindexed_array = $form.serializeArray();
    let indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function loadScript() {

    let script = document.createElement('script');
    script.id = 'events-calendar';
    script.type = 'text/javascript';
    script.src = '../event-calendar-module/js/caleandar.js';
    document.body.appendChild(script);
    setTimeout(()=> {
        script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.id = 'events-calendar-demo';
        script2.src = '../event-calendar-module/js/demo.js';

        document.body.appendChild(script2);
    }, 2000);
    // setTimeout(()=> {
    //
    //     script3 = document.createElement('script');
    //     script3.type = 'text/javascript';
    //     script3.id = 'auto.logout';
    //     script3.src = '../assets/login-logout/js/auto.logout.js';
    //
    //     document.body.appendChild(script3);
    // }, 2000);
}
//==================================pull saved event datas==========================================
function loadData() {
    let uri = '/events/find';
    $.ajax({
        url: uri,
        dataType: "json",
        success: function(data) {
            let html = '', html2 = '';
            let getModal = "";
            let getModalDialog, getModalContent, getModalHeader;
            let getModalHeaderCounter = document.querySelectorAll('*[id^="largeModal"]').length;
            $.each(data, function(key, content) {
                let content_event_recur = JSON.parse(content.event_recur);

                getEvents_recur = [...getEvents_recur, ...content_event_recur];

                html += '<li data-event_name="'+ content.event_name +'" data-start_date="'+ content.start_date +'" data-end_date="'+ content.end_date +'" class="card" style="background-color: #d9edf7; border-color: #bce8f1;">\n';
                html +='<div class="card-body panel-heading"><div class="row"><div class="col-lg-2"><a href="javascript:void(0)" data-toggle="modal" data-target="#largeModal'+ getModalHeaderCounter +'">\n';
                html +='<img class="img-thumbnail img-fluid" style="cursor: pointer;" src="'+ content.event_imgPath +'" alt="mfmsouth-church-events"></a>\n';
                html +='</div><div class="col-lg-10" style="padding-top: 10px;"><span>Event Name:<a  onclick="insertText(this, \'Name\')"> '+ content.event_name +'</a></span> &nbsp;\n';
                html +='<span>Start Dtae:<a  href="javascript:void(0)" onclick="insertText(this, \'Start Date\')"> '+ content.start_date +'</a></span>&nbsp;';
                html +='<span>End Date:<a  href="javascript:void(0)" onclick="insertText(this, \'End Date\')"> '+ content.end_date +'</a></span></div>\n';
                html +='<a class="edit" href="javascript:void(0)" onclick="_onEditItem(\''+ content._id +'\')">Edit</a>\n';
                html +='<button type="button"onclick="_onDeleteItem(\''+ content._id +'\')"  class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></div></div>\n';
                html +='<!--=======================================/modal=============================-->\n';
                html +='<!-- large modal -->\n';

                html2 += '<img src="' + content.event_imgPath + '" alt="mfmsouth-church-events" style="width:100%">\n';
                html2 += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>\n';
                html2 += '</button>';

                getModal = document.createElement('div');
                getModal.id = "largeModal"+getModalHeaderCounter;
                getModal.className += "modal fade";
                getModal.setAttribute("tabindex", "-1");
                getModal.setAttribute("role", "dialog");
                getModal.setAttribute("aria-labelledby", "basicModal");
                getModal.setAttribute("aria-hidden", "true");

                getModalDialog = document.createElement('div');
                getModalDialog.className += "modal-dialog modal-lg";
                getModal.appendChild(getModalDialog);

                getModalContent = document.createElement('div');
                getModalContent.className += "modal-content";
                getModalDialog.appendChild(getModalContent);

                getModalHeader = document.createElement('div');
                getModalHeader.className += "modal-header";
                getModalContent.appendChild(getModalHeader);

                getModalHeader.innerHTML = html2;

                document.getElementsByTagName("body")[0].appendChild(getModal);
                getModalHeaderCounter += 1;
                html2 = "";
                html += "</li>";
            });
            document.getElementById("draggablePanelList1").innerHTML = html;
        }
    }).done(function(data){

        // if(loaded_on)
        //     loadScript();
        //
        // loaded_on = false;

        prepare_isDeleteListCards();
    });
}

jQuery(($) => {
    loadData()
});
//==================================pull saved event datas==========================================

//=======================================events form validation================================================
function getTotalMinutes(time) {
    let a = time.split(':'); // split it at the colons
//debugger;
    // Hours are worth 60 minutes.
    return (+a[0]) * 60 + (+a[1]);
}

function canSubmit() {
    let event_name = document.forms["event_form"]["event_name"].value;
    let event_desc = document.forms["event_form"]["event_desc"].value;
    let start_date = document.forms["event_form"]["start_date"].value;
    let end_date = document.forms["event_form"]["end_date"].value;
    let start_time = document.forms["event_form"]["start_time"].value;
    let end_time = document.forms["event_form"]["end_time"].value;
    let fileInput = document.forms["event_form"]["eventImg"];

    if (event_name === "") {
        alert("Please: Whats the name of this events i.e Holy Ghost crossover night");
        return false;
    }
    if (event_desc === "") {
        alert("Please: Whats the description of this events");
        return false;
    }
    if (start_date === "") {
        alert("Please: provide a start date for the event");
        return false;
    }
    if (end_date === "") {
        alert("Please: provide an end date to the event");
        return false;
    }
    if (start_time === "") {
        alert("Please: provide an start time for the event");
        return false;
    }
    if (end_time === "") {
        alert("Please: provide an end time to the event");
        return false;
    }
    if(__id === null) {

        if (fileInput.value === "") {
            alert("Please: Select an image to save");
            return false;
        }
    }

    const isToday = (someDate) => {
        const today = new Date()
        return someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear()
    };

    // const isGreaterDay = (someDate, someOtherDate) => {
    //     debugger;
    //     let startDate = new Date(someDate);
    //     startDate.setHours(0,0,0,0);
    //     let endDate = new Date(someOtherDate);
    //     endDate.setHours(0,0,0,0);
    //
    //     return startDate < endDate;
    // };
    const isSameDay =  (someDate, someOtherDate) => {
        return someDate.getFullYear() === someOtherDate.getFullYear() &&
            someDate.getMonth() === someOtherDate.getMonth() &&
            someDate.getDate() === someOtherDate.getDate();
    };

    if (new Date(start_date).getTime() < new Date().getTime()  && !isToday(new Date(start_date))){
        alert('the event you are creating would be a past event as the supplied start date is a previous date');
    }
    if (new Date(end_date).getTime() < new Date(start_date).getTime()){
        alert('the start date cannot be greater than the end date');
        return false;
    } else {
        if(isSameDay(new Date(start_date), new Date(end_date))){
            if (getTotalMinutes(end_time) < getTotalMinutes(start_time)){
                alert('the start time cannot be greater than the end time on the same day');
                return false;
            }
        }
        // if(!isGreaterDay(start_date, end_date)) {
        //     if (getTotalMinutes(end_time) < getTotalMinutes(start_time)){
        //         alert('the start time cannot be greater than the end time on the same date');
        //         return false;
        //     }
        // }
    }

    return true;
}
//======================form validation end=======================================
//================start perform submit, edit, update delete functions================
let __id = null, event_img = null, event_imgName = null, editResponse = {}, event_recurClone = [];

$(document).on("click","#event_submit",function(evt){
    evt.preventDefault();
    //debugger;
    start_time  = document.getElementById("start_time").value;
    end_time = document.getElementById("end_time").value;

    if (canSubmit() && validateAllInputs()) {
        $("#event_form").submit(); //Trigger the Submit Here
    } else {
        alert("the forms info is not valid");
    }
});

function updateCalendar(_event_recur) {
    //debugger;
    let events = [..._event_recur];
    // getEvents_recur.push(..._event_recur);
    let settings = {};
    let element = document.getElementById('caleandar');
    caleandar(element, events, settings);
}

function doJoin(val){
    val = val.split(',');
    val = val[1]+ '/' + val[2] + '/' + val[0];
    return val;
}

function getTimeAmorPm(time) {
    //debugger;
    let hms = time + ":00";
    let dt = new Date("1970-01-01 " + hms);

    let hours = dt.getHours() ; // gives the value in 24 hours format
    let AmOrPm = hours >= 12 ? 'pm' : 'am';
    hours = (hours % 12) || 12;
    let minutes = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
    let finalTime = hours + ":" + minutes + " " + AmOrPm;
    return finalTime;
}

// Handle the sumbit here.
$("#event_form").submit(function(evt) {
    evt.preventDefault();
    try {
        if (__id === null) {//save

            let url = "/events/create";
            let $form = $('form#event_form')[0];//$("#event_form")
            let data = new FormData($form);

            //debugger;
            if (document.getElementById('recur').checked) {
                data.append("event_recur", JSON.stringify(getEvents));
                data.append("start_date", document.getElementById("start_date").value);
                data.append("end_date", document.getElementById("end_date").value);
                // data.event_recur = JSON.stringify(getEvents);
            } else {
                let event_start_date = document.getElementById("start_date").value.split("/");
                createdEvents.Date = event_start_date[2] + ',' + event_start_date[0] + ',' + event_start_date[1];
                // createdEvents.Date = createdEvents.Date.join(',');
                createdEvents.Title = $form.event_name.value;
                createdEvents.Time = getTimeAmorPm(document.getElementById("start_time").value) + "-" + getTimeAmorPm(document.getElementById("end_time").value);
                getEvents.push(createdEvents);
                createdEvents = {};
                data.append("event_recur", JSON.stringify(getEvents));
            }

            document.getElementById('recur').click();

            getEvents = [];

            //the array of dates loop should switch in after the first formdata is stored and the neww data should replace the old formdata
            // let formData = $("#event_form").serialize();
            //i showuld you my brain here to stroer the rest of the occurences
            //debugger;

            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    doUpdate(this.response, []);
                    getEvents.length = 0;

                    // document.getElementById("event_form").reset();
                }
            });

            xhr.open("POST", url);
            xhr.setRequestHeader("cache-control", "no-cache");
            xhr.setRequestHeader("postman-token", "fb4e4d0c-26b1-ef6c-3beb-5f791abc83b0");

            xhr.send(data);
        }
        else {//update
            // check iff recurrence is checked
            //debugger;
            // event_recurClone.push(...getEvents);
            doUpdate(editResponse, event_recurClone);
            getEvents = [];

            alert('events updated successfully!');
            _id = null;
            // document.getElementById('ImgForm_submit').innerText = "Submit Form"
            document.getElementById('recur').click();
        }
    } catch (err) {
        console.log(err);

        document.getElementById('recur').click();

        getEvents = [];
        event_recurClone = [];
    }
});

function doUpdate (response, clone_eventRecur) {
    debugger;

    let isArray = (data) => {
        return (Object.prototype.toString.call(data) === "[object Array]");
    };

    if (typeof (response) === "string") {
        response = JSON.parse(response);
        response.event_recur = JSON.parse(response.event_recur[0]);
    }
    if (typeof (response) === "object" && typeof response.event_recur[0] === "string")
        response.event_recur = JSON.parse(response.event_recur[0]);


    let $form = $('form#event_form')[0];
    let data = new FormData($form);

    event_img = response.event_imgPath;
    event_imgName = response.event_imgName;


    if (isArray(clone_eventRecur) && clone_eventRecur.length > 0)
        getEvents.forEach(function (value) {
            value._id = response._id;
        });
    else
        response.event_recur.forEach(function (value) {
            value._id = response._id;
        });

    let event_recur = isArray(clone_eventRecur) && clone_eventRecur.length > 0 ? getEvents : response.event_recur;

    let url = "/events/" + response._id + "/update";

    data.append("event_imgName", response.event_imgName);
    data.append("event_imgPath", response.event_imgPath);
    data.append("event_recur", JSON.stringify(event_recur));

    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            // if (__id === null)
            //debugger;;
            getEvents_recur =[];
            loadData();

            setTimeout(()=>{
                updateCalendar(getEvents_recur);
            }, 1500);

            __id = null;
            document.getElementById('event_submit').innerText = "Submit";

            toggleClasses();
            showModal();
            showModalChildren();
        }
    });

    xhr.open("PUT", url);
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("postman-token", "fb4e4d0c-26b1-ef6c-3beb-5f791abc83b0");

    xhr.send(data);
}
//end submit

//perform edit functions
function _onEditItem(id) {
    __id = id;
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "/events/" + id,
        "method": "GET"
    };

    $.ajax(settings).done(function (response) {
        document.getElementsByClassName('currMonth')[0].click();

        document.forms["event_form"]["event_name"].value = response.event_name;
        document.forms["event_form"]["event_desc"].value = response.event_desc;
        document.forms["event_form"]["start_date"].value = response.start_date;
        document.forms["event_form"]["end_date"].value = response.end_date;
        document.forms["event_form"]["start_time"].value = response.start_time;
        document.forms["event_form"]["end_time"].value = response.end_time;
        event_img = response.event_imgPath;
        event_imgName = response.event_imgName;

        if (JSON.parse(response.event_recur).length > 1 && !document.getElementById('recur').checked) {
            document.getElementById('recur').click();
        }
//debugger;;
        editResponse = response;//edit response to pass id to event_recureclone

        event_recurClone = [];
        event_recurClone.push(...getEvents_recur);
        let counterDel = 0;
        //debugger;

        getEvents_recur.forEach(function (eventVal, index) {
            if (eventVal._id === response._id){
                event_recurClone.splice(index - counterDel, 1);
                counterDel++;
            }
        });
        // getEvents_recur = [];

        toggleClasses();
        showModal();
        showModalChildren();
    });
    document.getElementById('event_submit').innerText = "Update Form";
    $("a#nav-add-event-tab").click();
}

//perform delete functions

function _onDeleteItem(id){
    __id = id;
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "/events/" + __id + "/delete",
        "method": "DELETE",
        "headers": {
            "cache-control": "no-cache",
            "Postman-Token": "d8a72744-3f78-45eb-9967-05d281a007b9"
        }
    };

    $.ajax(settings).done(function (response) {
        if (response.event_recur.length > 1 && !document.getElementById('recur').checked) {
            document.getElementById('recur').click();
        }

        //debugger;;
        document.getElementById("event_form").reset();
        alert('Deleted successfully!');

        event_recurClone = [];
        event_recurClone.push(...getEvents_recur);
        let counterDel = 0;

        //debugger;;
        getEvents_recur.forEach(function (eventVal, index) {
            if (eventVal._id === response._id){
                event_recurClone.splice(index - counterDel, 1);
                counterDel++;
            }
        });

        let del_GetEvents_recur = event_recurClone;
        // getEvents_recur = [];

        updateCalendar(del_GetEvents_recur);
        _id = null;
        __id = null;

        toggleClasses();
        showModal();
        showModalChildren();
    });
}

function loadDateTimePicker() {

    $("#start_date").datepicker({
        uiLibrary: 'bootstrap4'
    });
    $("#end_date").datepicker({
        uiLibrary: 'bootstrap4'
    });
    $("#start_time").timepicker({
        uiLibrary: 'bootstrap4'
    });
    $("#end_time").timepicker({
        uiLibrary: 'bootstrap4'
    });

}

loadDateTimePicker();

