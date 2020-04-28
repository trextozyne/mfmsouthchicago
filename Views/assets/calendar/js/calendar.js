
let getEvents_recur = [];

// preloader
$(window).load(function(){
    $('.loading').delay(2000).fadeOut(500);
});

function doJoin(val){
    debugger;
    val = val.split(',');
    val = val[1]+ '/' + val[2] + '/' + val[0];
    return val;
}

function loadScript() {

    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '../event-calendar-module/js/caleandar.js';
    document.body.appendChild(script);
    setTimeout(()=> {
        script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.src = '../event-calendar-module/js/demo.js';

        document.body.appendChild(script2);
    }, 2000);
    console.log('loadScript');
}

function loadData() {
    debugger;
    let uri = '/events/find';
    $.ajax({
        url: uri,
        dataType: "json",
        success: function (data) {
            $.each(data, function (key, content) {
                debugger;
                content.event_recur = JSON.parse(content.event_recur);
                getEvents_recur = [...getEvents_recur,...content.event_recur];
            });
        }
    });
}

$(document).ready(function () {
    debugger;
    loadData();
    loadScript();
    if(window.innerWidth > window.innerHeight) {
        document.getElementsByClassName("Calendar")[0].removeAttribute("hidden");
        document.getElementsByClassName("Information")[0].setAttribute("hidden", "hidden")
    }else {
        document.getElementsByClassName("Information")[0].removeAttribute("hidden");
        document.getElementsByClassName("Calendar")[0].setAttribute("hidden", "hidden");
    }
});

window.onresize = function (event) {
    applyOrientation();
};

function applyOrientation() {
    if (window.innerHeight < window.innerWidth) {
        document.getElementsByClassName("Calendar")[0].removeAttribute("hidden");
        document.getElementsByClassName("Information")[0].setAttribute("hidden", "hidden")
    } else {
        if (window.innerHeight < window.innerWidth) {
            document.getElementsByClassName("Calendar")[0].removeAttribute("hidden");
            document.getElementsByClassName("Information")[0].setAttribute("hidden", "hidden")
        } else {
            document.getElementsByClassName("Information")[0].removeAttribute("hidden");
            document.getElementsByClassName("Calendar")[0].setAttribute("hidden", "hidden");
        }
    }
}