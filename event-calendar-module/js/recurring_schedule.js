
//====================Click function for show the Modal====================
let month, day, year, yourDay, yourDay2= "";
let createdEvents = {}, getEvents = [];
$("body").on("click",".cld-day.prevMonth", function() {
    alert("previous month")
    $(".cld-rwd").click();
});

$("body").on("click",".cld-day.nextMonth", function() {
    alert("next month")
    $(".cld-fwd").click();
});

$("body").on("click",".cld-day.currMonth", function() {
    if (window.location.href.indexOf("/admin") > -1) {
        $(".mask").addClass("active");
        month = $(this).find('p').data("month");
        month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month.substr(0, 3)) / 3 + 1;
        day = $(this).find('p').data("day");
        year = parseInt($(this).find('p').data("year"));
        $(".modalcalendar").find("#start_date").val(month + '/' + day + '/' + year);
        $(".modalcalendar").find("#end_date").val(month + '/' + day + '/' + year);
        day = ("0" + day).slice(-2);
        yourDay = year + '-' + ("0" + (month)).slice(-2) + '-' + day;
        yourDay2 = year + '-' + ("0" + (12)).slice(-2) + '-' + "31";

        $(".modalcalendar").find("#scheduleStart").val(yourDay);
        $(".modalcalendar").find("#scheduleendson").val(yourDay2);
    }else if (window.location.href.indexOf("/plan-a-visit") > -1) {
        let ahref = $(this).find("a").attr("href");
        if (ahref)
            window.open(ahref);
    }
});

// Function for close the Modal

function closeModal(){
    $(".mask").removeClass("active");
}

// Call the closeModal function on the clicks/keyboard

$(".close, .mask").on("click", function(){
        closeModal();
});

$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        closeModal();
    }
});

// =======================for recurring schedule=============================
let content = document.getElementById('content');
let toggleBtn = document.getElementById('recur');

if(toggleBtn)
    toggleBtn.onclick = function() {
        if (content.classList.contains('open')) {
            content.classList.remove('open');
            toggleBtn.textContent = "Show more";
        } else {
            content.classList.add('open');
            toggleBtn.textContent = "Show less";
        }

    };


//get the months interval between said periods
function monthDiff(m1, m2) {
    let months;
    months = (m2.getFullYear() - m1.getFullYear()) * 12;
    months -= m1.getMonth() + 1;
    if(m1.getDate() < m2.getDate())
        months += m2.getMonth() + 1;
    else
        months += m2.getMonth();
    return months <= 0 ? 0 : months;
}

//--for the radio button inputs ---
let getInput="";
let radioEl="";
let textEl="";
function toggle($this){
    radioEl = document.getElementById($this.id);

    if(radioEl.checked && radioEl.id !== "neverends"){
        textEl = radioEl.nextSibling.nextSibling;
        textEl.disabled = !textEl.disabled;
    }
    if(getInput !== "" && !getInput.checked){
        textEl = getInput.nextSibling.nextSibling;
        textEl.disabled = !textEl.disabled;
    }
    getInput = $this;

    if(radioEl.id === "neverends")
        getInput = "";

}
//--for the radio button inputs ---

// Get all options within <select id='scheduleType'>...</select>
let selectOp;
if(document.getElementById("scheduleType")) {
    selectOp = document.getElementById("scheduleType").getElementsByTagName("option");

    for (let i = 0; i < selectOp.length; i++) {
        // lowercase comparison for case-insensitivity
        if (selectOp[i].outerText.toLowerCase() === "select how") {
            selectOp[i].disabled = true;
        }
    }
}
// Get all options within <select id='scheduleType'>...</select>

function validateAllInputs(){
    let divElem = document.getElementById("content");
    let inputElements = divElem.querySelectorAll("input, select, checkbox, textarea");
    let inputValid = false, selectValid = false, checkboxValid = false, radioValid = false;
    let startPeriod = "";
    let convertedDate = "";
    let year, month, dayOfWeek, interval, userSpecificWeek, everyWeek = false, userSpecificDay = 0;
    let arrayOfDates = [];

    if(document.getElementById("recur").checked) {
        debugger;
        for (let item of inputElements) {
            if (item.type === "date" && inputValid !== true && item.value !== "") {
                startPeriod = item.value + " 00:00";
                let myDate = new Date(startPeriod);
                convertedDate = convertDateArray(convertDate(myDate));
                year = convertedDate[0], month = convertedDate[1], dayOfWeek = convertedDate[2];
                inputValid = true;
            }
            if (item.type === "select-one" && item.selectedIndex !== 0) {//
                userSpecificWeek = parseInt(item.value);
                userSpecificWeek === 0 ? everyWeek = true : everyWeek = false;
                selectValid = true;
            }
            if (item.type === "checkbox" && item.checked === true) {
                arrayOfDates.push(item.value);
                checkboxValid = true;
            }
            if (item.type === "radio" && radioValid !== true && item.checked === true) {
                if (item.parentNode.textContent.toLowerCase().trim() === "never") {
                    alert("Never Ends require some work, choose another option");
                    return;
                }
                if (item.id === "occurrences")
                    interval = item.nextSibling.nextSibling.value;
                if (item.id === "specificDate")
                    interval = monthDiff(new Date(startPeriod), new Date(item.nextSibling.nextSibling.value));
                // alert(interval)
                radioValid = true;
            }
        }
        if (inputValid === false || selectValid === false || checkboxValid === false || radioValid === false) {
            alert("form not valid");
            return false;
        } else {
            if (userSpecificWeek !== 5)
                arrayOfDates.forEach(function (userSpecifiedDays, j) {
                    weekCount(year, month, dayOfWeek, interval, userSpecificWeek, userSpecifiedDays, everyWeek);
                });
            else
                arrayOfDates.forEach(function (userSpecifiedDays, j) {
                    lastSpecificDayofMnth(year, month, dayOfWeek, userSpecifiedDays, interval);
                });

            inputValid = selectValid = checkboxValid = radioValid = false;
            return true;
        }
    }else return true;

}

//====validate the input only numbers and '/'
/**
 * @return {boolean}
 */
function Validate(event) {
    event.preventDefault();
    return false;
}

function getText($this){
    let value = $this.value === "" ? 'being empty' : $this.value;
    if (confirm('Are you sure this date '+ value +' is what you want?')) {
        if($this.value === ""){
            alert("This field cant be empty");
            return;
        }
        alert($this.value);
    }

}

//---This event scheduler gives you the 1st, 2nd, 3rd or 4th specified day of the month, also gets the number of
//weeks a month has
// --https://codepen.io/Trex_FreeCampCoder/pen/YBvXQG?editors=1010 Thus event schecduler gives the last wjatever specified day of the month----
function convertDate(date) {
    let yyyy = date.getFullYear().toString();
    let mm = (date.getMonth() + 1).toString();
    let dd = date.getDate().toString();

    let mmChars = mm.split("");
    let ddChars = dd.split("");
    // debugger;

    return (yyyy + "-" + (mmChars[1] ? mm : "0" + mmChars[0]) + "-" + (ddChars[1] ? dd : "0" + ddChars[0]));
}

let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
function convertDateArray(convertedDate) {
    return convertedDate.split("-")
}

// ===================best way to determine if its today============================
const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
};

function weekCount(year, month_number, dayOfWeek, interval, userSpecificWeek, userSpecificDay, everyWk) {
    //get formdata
    let $form = $("#event_form");
    let formData = JSON.parse(JSON.stringify(getFormData($form)));
    let boolSetFormDataDateInput = false;

    // month_number is in the range 1..12
    month_number = parseInt(month_number);
    let firstSpecificDay = false; //if day of month starts after specified date i.e friday
    let firstSpecificDayWkCount = 0; //if day of month starts after specified date i.e friday
    let startPeriod = new Date(year, month_number, dayOfWeek);//get the start period
    let endPeriod = new Date(year, month_number, dayOfWeek).setMonth(new Date(year, month_number, dayOfWeek).getMonth() + (interval+1)); //get the end period after user specifies interval
    while (startPeriod < endPeriod) {
        // Get the first day of week week day (0: Sunday, 1: Monday, ...)

        // month_number = startPeriod.getMonth();
        month_number = startPeriod.getMonth()-1;
        year = startPeriod.getFullYear();
        let firstDayOfWeek = dayOfWeek || 0;

        // let firstOfMonth = new Date(month_number === 0 ? parseInt(year)+1 : year, month_number - 1 , 1);
        let firstOfMonth = new Date(year, month_number , 1);
        
        let lastOfMonth = new Date(year, month_number+1, 0);
        let numberOfDaysInMonth = lastOfMonth.getDate();
        let first = firstOfMonth.getDate();
debugger;
        // alert(first);

        //initialize first week
        let weekNumber = 1;
        while (first - 1 < numberOfDaysInMonth) {
            if (firstOfMonth.getDate() === 1)
                if (firstOfMonth.getDay() > days.indexOf(userSpecificDay)) {
                    firstSpecificDay = true; //day of month starts after specified date i.e friday
                    //decrement if day of month starts after specified date i.e friday
                    firstSpecificDayWkCount--;
                }

            if (days[firstOfMonth.getDay()] === "Sunday" && firstOfMonth.getDate() !== 1) {
                //get new week every new sunday according the local date format
                weekNumber++;
                //if day of month starts after specified date i.e friday then the 3rd friday in my case would be in the 4th week
                //same for all cases
                debugger;
                if (firstSpecificDay === true && weekNumber === userSpecificWeek + 1) {
                    firstSpecificDayWkCount += weekNumber;
                }
            }
            if (firstSpecificDayWkCount === userSpecificWeek && days[firstOfMonth.getDay()] === userSpecificDay && firstSpecificDay === true && !everyWk) {
               
               if (firstOfMonth > new Date() || isToday(firstOfMonth)) {
                    createdEvents.Date = [+firstOfMonth.getFullYear(), +(firstOfMonth.getMonth() + 1), firstOfMonth.getDate()];
                    createdEvents.Date = createdEvents.Date.join(',');
                    createdEvents.Time = getTimeAmorPm(start_time) + "-" + getTimeAmorPm(document.getElementById("end_time").value);
                    createdEvents.Title = formData.event_name;
                }
                firstSpecificDay = false;
                firstSpecificDayWkCount = 0;

                if(!boolSetFormDataDateInput)
                    document.getElementById("start_date").value = document.getElementById("end_date").value
                        = (firstOfMonth.getMonth()+1) + '/' + firstOfMonth.getDate() + '/' + firstOfMonth.getFullYear();
                boolSetFormDataDateInput = true;
            } else if (weekNumber === userSpecificWeek && days[firstOfMonth.getDay()] === userSpecificDay && firstSpecificDay === false && !everyWk) {
                
                if (firstOfMonth >= new Date() || isToday(firstOfMonth)) {
                    createdEvents.Date = [+firstOfMonth.getFullYear(), +(firstOfMonth.getMonth() + 1), firstOfMonth.getDate()];
                    createdEvents.Date = createdEvents.Date.join(',');
                    createdEvents.Time = getTimeAmorPm(start_time) + "-" + getTimeAmorPm(end_time);
                    createdEvents.Title = formData.event_name
                }

                if(!boolSetFormDataDateInput)
                    document.getElementById("start_date").value = document.getElementById("end_date").value
                        = (firstOfMonth.getMonth()+1) + '/' + firstOfMonth.getDate() + '/' + firstOfMonth.getFullYear();
                boolSetFormDataDateInput = true;
            }else if(everyWk && days[firstOfMonth.getDay()] === userSpecificDay && (firstSpecificDay || !firstSpecificDay)){
               if (firstOfMonth >= new Date() || isToday(firstOfMonth)) {
                   
                    createdEvents.Date = [+firstOfMonth.getFullYear(), +(firstOfMonth.getMonth() + 1), firstOfMonth.getDate()];
                    createdEvents.Date = createdEvents.Date.join(',');
                    createdEvents.Time = getTimeAmorPm(start_time) + "-" + getTimeAmorPm(end_time);
                    createdEvents.Title = formData.event_name;
                    getEvents.push(createdEvents);
                    createdEvents = {};
                }
                firstSpecificDay = false;
                firstSpecificDayWkCount = 0;

            }


            // add a day
            firstOfMonth.setDate(firstOfMonth.getDate() + 1);
            first++;
        }

        // createdEvents.Date.replace(/"([^"]+(?="))"/g, '$1');

        if(!everyWk && Object.keys(createdEvents).length !== 0 && createdEvents.constructor === Object) getEvents.push(createdEvents);
        createdEvents = {};
        startPeriod.setMonth(startPeriod.getMonth() + 1);
        firstSpecificDay = false;
    }
    boolSetFormDataDateInput = false;
}


//===last any day of month
function lastSpecificDayofMnth(year, month_number, dayOfWeek, userSpecificDay, interval) {
    //get formdata
    let $form = $("#event_form");
    let formData = JSON.parse(JSON.stringify(getFormData($form)));
    let boolSetFormDataDateInput = false;

    let startPeriod = new Date(year, month_number, dayOfWeek);//get the start period
    let endPeriod = new Date(year, month_number, dayOfWeek).setMonth(new Date(year, month_number, dayOfWeek).getMonth() + (interval+1)); //get the end period after user specifies interval
    while (startPeriod < endPeriod) {

        month_number = startPeriod.getMonth()-1;
        year = startPeriod.getFullYear();

        // let firstOfMonth = new Date(year, month_number-1, 1);
        // let lastOfMonth = new Date(year, month_number === 0 ? 12 : month_number,  0);
        let lastOfMonth = new Date(year, month_number+1,  0);
        let lastDayInMonth = lastOfMonth.getDay();
        // alert(lastOfMonth);

        // if(month_number !== 0)

        let counter = 0;
        let userSpecfiedDate  = null;


        if(lastDayInMonth === days.indexOf(userSpecificDay))
            userSpecfiedDate = [lastOfMonth.getMonth()+1, lastOfMonth.getDate(), lastOfMonth.getFullYear()];
        else if(lastDayInMonth < days.indexOf(userSpecificDay)){
            for(let i = days.indexOf("Sunday"); i < lastDayInMonth; i++){
                counter += 1;
            }
            for(let i = days.indexOf(userSpecificDay); i <= days.indexOf("Saturday"); i++){
                counter += 1;
            }
            userSpecfiedDate = [lastOfMonth.getMonth()+1, (lastOfMonth.getDate()-counter), lastOfMonth.getFullYear()];
        }else{
            for(let i = days.indexOf(userSpecificDay); i < lastDayInMonth; i++){
                counter += 1;
            }
            userSpecfiedDate = [lastOfMonth.getMonth()+1, (lastOfMonth.getDate()-counter), lastOfMonth.getFullYear()];
        }
        // userSpecfiedDate = userSpecfiedDate.join('/');
        // alert(userSpecfiedDate);

        if(!boolSetFormDataDateInput)
            document.getElementById("start_date").value = document.getElementById("end_date").value
                = (startPeriod.getMonth()+1) + '/' + startPeriod.getDate() + '/' + startPeriod.getFullYear();
        boolSetFormDataDateInput = true;

        if (lastOfMonth >= new Date()) {
            createdEvents.Date = [+userSpecfiedDate[2], +userSpecfiedDate[0], userSpecfiedDate[1]];
            createdEvents.Date = createdEvents.Date.join(',');
            createdEvents.Time = getTimeAmorPm(start_time) + "-" + getTimeAmorPm(end_time);
            createdEvents.Title = formData.event_name;

            createdEvents.Date.replace(/"([^"]+(?="))"/g, '$1');
            getEvents.push(createdEvents);
            createdEvents = {};
        }

        startPeriod.setMonth(startPeriod.getMonth() + 1);
        firstSpecificDay = false;
    }
    boolSetFormDataDateInput = false;
}
