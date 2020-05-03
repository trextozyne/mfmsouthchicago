//
// var TIME = 200;
//
// function handleHover(event) {
//     debugger
//     event.currentTarget.classList.add("open");
//     event.currentTarget.children[0].setAttribute("aria-expanded", true);
// }
//
// function stopHover(event) {
//     event.currentTarget.classList.remove("open");
//     event.currentTarget.children[0].setAttribute("aria-expanded", false);
//     clearInterval(interval);
// }
//
// $(document).on('mouseenter','li.nav-item', function (event) {
//     interval = setInterval(handleHover(event), TIME)
// }).on('mouseleave','li.nav-item',  function(){
//     stopHover(event);
// });
// ===================================NAV hover error fix=================================
    //=======================pull saved datas for verse==========================
    jQuery(($) => {
        let uri = '/verse/find';
        $.ajax({
            url: uri,
            dataType: "json",
            success: function (data) {
                if (data.length !== 0) {
                    $("#bible_verse").html('<h4 style="margin-bottom: 10px;">Bible Verse For The Week</h4>\n' +
                        '                <i style="font-size: larger;">\n' +
                        '                    <b>' + data[0].chapter + ', </b> \n' +
                        '"' + data[0].verse + '"\n' +
                        '                </i>')
                }
            }
        });
    });
//=======================pull saved datas for verse==========================
let html = '<section class="countdown2 cid-rgyVECiIta" id="countdown2-q"><div class="container">' +
    '<h2 class="mbr-section-title pb-3 align-center mbr-fonts-style display-2">Countdown</h2>\n';
let html2 = '';
//=======================pull saved datas==========================
//sort the returned data by date in ascending order
function doJoin(val){
    val = val.split(',');
    val = val[1]+ '/' + val[2] + '/' + val[0];
    return val;
}

//sort the event array iclass="navigation"t seld and use it for the actual index.html display, its brilliant
function sortDataByDateAsc(data) {
    let array = data;

    array.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        a = doJoin(a.Date);
        b = doJoin(b.Date);
        return new Date(a) - new Date(b);
    });
    return array;
}

//combine all events_recur into one
function combineAllEvents(arrayData){
    let combineAllEvents = [];
    $.each(arrayData, function (i, value) {
        value.event_recur = JSON.parse(value.event_recur);
        combineAllEvents = [...combineAllEvents, ...value.event_recur];
    });
    return combineAllEvents;
}

//add days to event start days to get the end date based on the exact interval supplied in first creation
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
jQuery(($) => {
    let uri = '/events/find';

    $.ajax({
        url: uri,
        dataType: "json",
        success: function (data) {
            debugger;

            let combeinedEvents = combineAllEvents(data);
            let sortedData = sortDataByDateAsc(combeinedEvents);

            let  counter = 0;

            if ( data.length === 1 ||data.length === 0)//
                $('#content').html("<strong>No Upcoming Events</strong>");

            $.each(sortedData, function (i, value) {
                if (counter === 3) {
                    return;
                }


                let start_date = doJoin(value.Date);

                if (new Date(start_date) > new Date())//.setHours(0,0,0,0)
                {
                    let foundData = data.find(o => o._id === value._id);
                    //getActualEventBId(value._id)
                    if (counter === 0) {
                        html += '<h3 class="mbr-section-subtitle align-center mbr-fonts-style display-5">' + foundData.event_desc + '</h3></div><div class="container pt-5                                      mt-2">\n';
                        html += '<div class=" countdown-cont align-center p-4"><div class="event-name align-left mbr-white "><h4 class="mbr-fonts-style display-5">' + foundData.event_name + '</h4></div>\n';
                        html += '<div id="due-date" class="countdown align-center py-2" data-due-date="' + start_date + '"></div>\n';
                        html += '<div class="daysCountdown" title="Days"></div><div class="hoursCountdown" title="Hours"></div>\n';
                        html += '<div class="minutesCountdown" title="Minutes"></div><div class="secondsCountdown" title="Seconds"></div>\n';
                        html += '<div class="event-date align-left mbr-white"><h5 class="mbr-fonts-style display-7">On ' + start_date + ' from ' + foundData.start_time + ' - ' + foundData.end_time + '</h5></div></div></div></section>';

                        $(html).insertAfter("#content10-s");
                    } else {

                        html2 += '<div id="tile' + counter + '" class="tile"><div class="wrapper settings-form"><div class="header">INFORMATION<div class="close"><div class="cy"></div>\n' +
                            '<div class="cx"></div></div></div>';
                        html2 += '<form action="" style="width: 100%;"><div><label>EVENT NAME</label><input type="text" value="' + foundData.event_name + '" disabled="disabled"/></div>\n';
                        html2 += '<div class="descr"><label>EVENT DESCRIPTION</label><textarea rows="3" disabled="disabled">' + foundData.event_desc + '</textarea></div>\n';
                        html2 += '<div class="short"><label>START DATE</label><input type="text" value="' + foundData.start_time + ' ' + start_date + '"  disabled="disabled"/></div>';
                        html2 += '<div class="short"><label>END DATE</label><input type="text" value="' + foundData.end_time + ' ' + (start_date +(new Date(foundData.end_date)-new Date(foundData.start_date))) + '"  disabled="disabled"/></div>';

                        html2 += `<button onclick=goto_Event("${foundData._id}"` + `,` + `"${start_date}")>GOTO EVENT</button></form></div>`;
                        html2 += '<div class="circle"></div><div class="wrapper"><div class="header">'+ foundData.event_name +'</div><div class="stats">\n';
                        html2 += '<img src="' + foundData.event_imgPath + '"></div><div class="dates"><div class="start"><strong>STARTS</strong>' + foundData.start_time + '<!--<span><span>-->\n';
                        html2 += '</div><div class="ends"><strong>ENDS</strong>' + foundData.end_time + '</div></div></div></div>'
                        // ${foundData._id} ,
                        if (counter === 2) {
                            html2 += '<div id="clear"></div>';
                        }

                        $('#content').html(html2);
                    }
                    counter++;
                }

            })

            dynamicallyLoadScript("assets/countdown/jquery.countdown.min.js")
        }
    })
});

$("body").on("click", "button", function (e) {
    e.preventDefault();
});

function goto_Event(_id, _date) {

    let url="./events-single.html?id=" + _id + "&date=" + _date;
    window.open(url);
};
//=======================pull saved datas==========================

function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL

    document.body.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}