
    $(document).ready(function () {
        loadEventData();
    });
//=======================pull saved datas==========================
//sort the returned data by date in ascending order
function doJoin(val){
    val = val.split(',');
    val = val[1]+ '/' + val[2] + '/' + val[0];
    return val;
}

//sort the event array it seld and use it for the actual index.html display, its brilliant
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
    let combineAllEvents = [];debugger;
    arrayData[0].event_recur = JSON.parse(arrayData[0].event_recur);
    $.each(arrayData, function (i, value) {
        combineAllEvents = [...combineAllEvents, ...value.event_recur];
    })
    return combineAllEvents;
}

function getShortMonth(_date) {
    let shortName;
    let date = new Date(_date);
    let shortMonthName = new Intl.DateTimeFormat("en-US", {month: "short"}).format;
    shortName = shortMonthName(date);
    return shortName;
}

function getLongMonth(_date) {
    let longName;
    let date = new Date(_date);
    let shortMonthName = new Intl.DateTimeFormat("en-US", {month: "long"}).format;
    longName = shortMonthName(date);
    return longName;
}

function getDayOfWeek(date) {
    var dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}

let fullEventHtml = "";

let eventTitle = '<!--Titles-->\n' +
    '              <div class="title col-12">\n' +
    '                  <h2 class="align-left mbr-fonts-style m-0 display-1" style="font-size: 3rem;">Church Events</h2>\n' +
    '              </div>';

let eventHtmlBodyStart =
    '              <!--Card-1-->\n' +
    '              <div class="card col-12 pb-5 event-card">\n' +
    '                  <div class="card-wrapper media-container-row media-container-row">\n' +
    '                      <div class="card-box">\n' +
    '                          <div class="row">\n';

let eventHtmlBodyEnd =
    '                          </div>\n' +
    '                      </div>\n' +
    '                  </div>\n' +
    '              </div>';

function loadEventData() {
    debugger;
    let uri = '/events/find';
    $.ajax({
        url: uri,
        dataType: "json",
        success: function (data) {
            let combeinedEvents = combineAllEvents(data);
            let sortedData = sortDataByDateAsc(combeinedEvents);
            debugger;

            if (data.length === 1 || data.length === 0)//
                $('#services6-1.row').html("<strong>No Upcoming Events</strong>");

            $.each(sortedData, function (i, value) {
                debugger;

                let start_date = doJoin(value.Date);
                if (new Date(start_date) > new Date())//.setHours(0,0,0,0)
                {
                    let foundData = data.find(o => o._id === value._id);

                    let eventHtmlBodyContent =
                        ' <div class="col-12 col-md-2"><!--Side Date--><div class="mbr-figure side-date">\n' +
                        '                                      <h2>'+ getShortMonth(doJoin(value.Date)) +'</h2>\n' +
                        '                                      <h1>'+new Date(start_date).getDate()+'</h1>\n' +
                        '                                      <h2 id="last-h2">'+ getDayOfWeek(start_date).slice(0, 3) +'</h2>\n' +
                        ' </div></div><div class="col-12 col-md-2"><!--Image--><div class="mbr-figure"><img src="' + foundData.event_imgPath + '" alt="church_event">\n' +
                        '</div></div><div class="col-12 col-md-8"><div class="wrapper"><div class="top-line">' +
                        '                                     <h4 class="card-title mbr-fonts-style display-5">'+ foundData.event_name +'</h4>\n' +
                        ' </div><div class="top-line">\n' +
                        '                                      <p class="mbr-text mbr-fonts-style display-7 main-date">' +
                        '' + new Date(start_date).getDate() +' ' + getLongMonth(doJoin(value.Date)) + ' ' + new Date(start_date).getFullYear() + '</p>\n' +//13 October, 2019
                        '</div> <div class="bottom-line">\n' +
                        '                                      <p class="mbr-text mbr-fonts-style display-7">'+ foundData.event_desc +'</p>\n' +
                        '                                       <a target="_blank" href="./events-single.html?id=' + foundData._id + '&date=' + doJoin(value.Date) + '">\n' +
                        '                                              <p class="mbr-text mbr-fonts-style display-7 read-more">Read More </p>\n' +
                        '                                       </a>\n' +
                        '</div></div></div>\n';

                    fullEventHtml += eventHtmlBodyStart + eventHtmlBodyContent + eventHtmlBodyEnd;
                    // $("#event-row").innerHTML = fullEventHtml;

                }
            });
            document.getElementById("event-row").innerHTML = eventTitle + fullEventHtml;
        }
    });
}