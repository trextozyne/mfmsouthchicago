
let getEvents_recur = [];
let _eventId = "";
let start_time, end_time = "";

//======check if windows just loaded=======
loaded_on = true;
function is_Load(){
    loaded_on;
}
window.onload = is_Load;
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
    // console.log('loadScript');
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

                getEvents_recur = [...getEvents_recur, ...content.event_recur];

                html += '<li data-event_name="'+ content.event_name +'" data-start_date="'+ content.start_date +'" data-end_date="'+ content.end_date +'" class="card" style="background-color: #d9edf7; border-color: #bce8f1;">\n';
                html +='<div class="card-body panel-heading"><div class="row"><div class="col-lg-2"><a href="javascript:void(0)" data-toggle="modal" data-target="#largeModal'+ getModalHeaderCounter +'">\n';
                html +='<img class="img-thumbnail img-fluid" style="cursor: pointer;" src="../../assets/images/gallery/'+ content.event_imgName +'" alt="mfmsouth-church-events"></a>\n';
                html +='</div><div class="col-lg-10" style="padding-top: 10px;"><span>Event Name:<a  onclick="insertText(this, \'Name\')"> '+ content.event_name +'</a></span> &nbsp;\n';
                html +='<span>Start Dtae:<a  href="javascript:void(0)" onclick="insertText(this, \'Start Date\')"> '+ content.start_date +'</a></span>&nbsp;';
                html +='<span>End Date:<a  href="javascript:void(0)" onclick="insertText(this, \'End Date\')"> '+ content.end_date +'</a></span></div>\n';
                html +='<a class="edit" href="javascript:void(0)" onclick="_onEditItem(\''+ content._id +'\')">Edit</a>\n';
                html +='<button type="button"onclick="_onDeleteItem(\''+ content._id +'\')"  class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></div></div>\n';
                html +='<!--=======================================/modal=============================-->\n';
                html +='<!-- large modal -->\n';

                html2 += '<img src="../../assets/images/gallery/' + content.event_imgName + '" alt="mfmsouth-church-events" style="width:100%">\n';
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

        if(loaded_on)
            loadScript();

        loaded_on = false;

        prepare_isDeleteListCards();
    });
}
jQuery(($) => {
    loadData()
});
//==================================pull saved event datas==========================================

//=======================================events form validation================================================
function getTotalMinutes(time) {
    let hms = time;   // your input string
    let a = hms.split(':'); // split it at the colons

    // Hours are worth 60 minutes.
    let minutes = (+a[0]) * 60 + (+a[1]);
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

    if (new Date(start_date).getTime() < new Date().getTime()  && !isToday(new Date(start_date))){
        alert('the event you are creating would be a past event as the supplied start date is a previous date');
    }
    if (new Date(end_date).getTime() < new Date(start_date).getTime()){
        alert('the start date cannot be greater than the end date');
        return false;
    }
    if (getTotalMinutes(end_time) < getTotalMinutes(start_time)){
        alert('the start time cannot be greater than the end time');
        return false;
    }
    return true;
}
//======================form validation end=======================================
//================start perform submit, edit, update delete functions================
let __id = null, event_img = null, event_imgName = null, editResponse = {}, event_recurClone = [];

$(document).on("click","#event_submit",function(evt){
    evt.preventDefault();debugger;
    start_time  = document.getElementById("start_time").value;
    end_time = document.getElementById("end_time").value;

    if (canSubmit() && validateAllInputs()) {
        $("#event_form").submit(); //Trigger the Submit Here

        setTimeout(()=> {
            getEvents_recur =[];
            loadData();
        }, 2000)
    } else {
        alert("the forms info is not valid");
    }
});

function updateCalendar(_event_recur) {
    let events = [...getEvents_recur, ..._event_recur];
    getEvents_recur.push(..._event_recur);
    let settings = {};
    let element = document.getElementById('caleandar');
    caleandar(element, events, settings);
}

function doJoin(val){
    val = val.split(',');
    val = val[1]+ '/' + val[2] + '/' + val[0];
    return val;
}

function getTimeAmorPm(time) {debugger;
    let hms = time + ":00";
    let dt = new Date("1970-01-01 " + hms);

    let hours = dt.getHours() ; // gives the value in 24 hours format
    let AmOrPm = hours >= 12 ? 'pm' : 'am';
    hours = (hours % 12) || 12;
    let minutes = dt.getMinutes() === 0 ? dt.getMinutes()+"0" : dt.getMinutes();
    let finalTime = hours + ":" + minutes + " " + AmOrPm;
    return finalTime;
}

// Handle the sumbit here.
$("#event_form").submit(function(evt){
    evt.preventDefault();
    if (__id === null) {//save

        let url = "/events/create";
        let $form = $("#event_form");
        let formData = JSON.parse(JSON.stringify(getFormData($form)));
debugger;
        if (formData.recur === "Recurring") {
            formData.event_recur = getEvents;
            formData.recur = "";
            formData.start_date = document.getElementById("start_date").value;
            formData.end_date = document.getElementById("end_date").value;
        }else {
            let event_start_date  = document.getElementById("start_date").value.split("/");
            createdEvents.Date = event_start_date[2] + ',' + event_start_date[0]+ ',' + event_start_date[1];
            // createdEvents.Date = createdEvents.Date.join(',');
            createdEvents.Title = formData.event_name;
            createdEvents.Time = getTimeAmorPm(document.getElementById("start_time").value) + "-" + getTimeAmorPm(document.getElementById("end_time").value);
            getEvents.push(createdEvents);
            createdEvents = {};
            formData.event_recur = getEvents;
        }
        getEvents = [];

        //the array of dates loop should switch in after the first formdata is stored and the neww data should replace the old formdata
        // let formData = $("#event_form").serialize();
        //i showuld you my brain here to stroer the rest of the occurences
        $(this).ajaxSubmit({
            url: url,
            method: "POST",
            data: formData,
            "content-type": 'application/json',
            dataType: "json",
            success: doUpdate
        });

        alert('events saved successfully!');
    }
    else {//update
        // check iff recurrence is checked
        debugger;
        event_recurClone.push(...getEvents);
        doUpdate(editResponse, event_recurClone);
        getEvents = [];

        alert('events updated successfully!');
        _id = null;
        // document.getElementById('ImgForm_submit').innerText = "Submit Form"
    }
});

function doUpdate (response, clone_eventRecur) {
    let isArray = (data) => {
        return (Object.prototype.toString.call(data) === "[object Array]");
    };

    // let f = isArray(clone_eventRecur);
    let $form = $("#event_form");
    let formData = JSON.parse(JSON.stringify(getFormData($form)));

    let event_name = formData.event_name;
    let event_desc = formData.event_desc;
    let start_date = formData.start_date;
    let end_date = formData.end_date;
    let start_time = formData.start_time;
    let end_time = formData.end_time;
    event_img = response.event_imgPath;
    event_imgName = response.event_imgName;

    if (isArray(clone_eventRecur))
        clone_eventRecur.forEach(function(value) {
            value._id = response._id;
        });
    else
        response.event_recur.forEach(function(value) {
            value._id = response._id;
        });

    let event_recur = isArray(clone_eventRecur) ? clone_eventRecur : response.event_recur;

    // let data = {
        response.event_name = event_name;
        response.event_desc = event_desc;
        response.event_imgName = event_imgName;
        response.event_imgPath = event_img;
        response.start_date =  start_date;
        response.end_date = end_date;
        response.start_time = start_time;
        response.end_time = end_time;
        response.event_recur= event_recur;
    // };

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "/events/"+ response._id +"/update",
        "method": "PUT",
        "headers": {
            "Content-Type": "application/json",
            "cache-control": "no-cache",
            "Postman-Token": "43540433-8036-4e05-978f-f2804ca9877d"
        },
        "processData": false,
        data: JSON.stringify(response)

        ,
        contentType: 'application/json',
        // dataType: "json",
        success: function(response){
            // alert(response);
        }
    };

    $.ajax(settings).done(function (response) {
        if(__id === null)
            updateCalendar(response.event_recur);
        else {
            let edit_GetEvents_recur = event_recurClone;
            updateCalendar(edit_GetEvents_recur);
        }
    });
}
//end submit

//perform edit functions
function _onEditItem(id) {
    __id = id;
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "/events/" + id,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "Postman-Token": "d8a72744-3f78-45eb-9967-05d281a007b9"
        }
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

        if (response.event_recur.length > 1 && !document.getElementById('recur').checked) {
            document.getElementById('recur').click();
        }
debugger;
        editResponse = response;//edit response to pass id to event_recureclone

        event_recurClone = [];
        event_recurClone.push(...getEvents_recur);
        let counterDel = 0

        getEvents_recur.forEach(function (eventVal, index) {
            if (eventVal._id === response._id){
                event_recurClone.splice(index - counterDel, 1);
                counterDel++;
            }
        });
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

        document.getElementById('recur').click();debugger;
        document.getElementById("event_form").reset();
        alert('Deleted successfully!');

        event_recurClone = [];
        event_recurClone.push(...getEvents_recur);
        let counterDel = 0;

        debugger;
        getEvents_recur.forEach(function (eventVal, index) {
            if (eventVal._id === response._id){
                event_recurClone.splice(index - counterDel, 1);
                counterDel++;
            }
        });

        // for(let i = 0; i < getEvents_recur.length; i++) {
        //     if(getEvents_recur[i]._id === response._id) {
        //         getEvents_recur.splice(0, 1);
        //     }
        // }
        let del_GetEvents_recur = event_recurClone;
        getEvents_recur = [];

        updateCalendar(del_GetEvents_recur);
        _id = null;
        __id = null;
    });
}

//================start perform submit, edit, update delete functions================
// ====================================Date addon For Events========================================

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


