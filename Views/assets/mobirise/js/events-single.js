
//sort the returned data by date in ascending order
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

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}


$(document).ready(function () {
    let _id = getUrlParam('id','Empty');
    let _date = getUrlParam('date','Empty');
    loadEventData(_id, _date)
});

function longDate(date) {
    let d_date = new Date(date);
    let nowDate = d_date.toDateString();
    let arr_Dates = nowDate.split(" ");
    let counter = 0;

    function checker(value) {
        debugger;
        let match = [arr_Dates[counter]];
        return match.every(function(v) {
            return value.indexOf(v) == 0;
        });
    }

    days = days.filter(checker);
    counter++;
    months = months.filter(checker);
    return days[0] + ' ' + months[0] + ' ' + arr_Dates[2] + ', ' + arr_Dates[3];
}

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var days =["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function loadEventData(__id, __date) {
    debugger;
    let uri = "/events/" + __id;
    $.ajax({
        url: uri,
        "method": "GET",
        dataType: "json",
        success: function (data) {
            debugger;
            document.getElementsByTagName("title")[0].innerHTML = data.event_name;
            document.getElementsByClassName("event-title")[0].innerHTML = data.event_name;
            document.getElementsByClassName("event-description")[0].innerHTML = data.event_desc;
            document.getElementsByClassName("event-image")[0].children[0].src = data.event_imgName;
            document.getElementsByClassName("event-day")[0].innerHTML = longDate(__date);
            document.getElementsByClassName("event-time-start")[0].innerHTML = getTimeAmorPm(data.start_time);
            document.getElementsByClassName("event-time-end")[0].innerHTML = getTimeAmorPm(data.end_time);
        }
    });
}