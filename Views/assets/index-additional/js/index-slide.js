
function formatDate(date) {
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

function findAllSlides(callback) {
    let url= "/slides/find";
    $.ajax({
        url: url,
        method: "GET",
        contentType: 'application/json',
        dataType: "json",
        success: callback
    });
}

$(document).ready(function() {
    let slide = "<input type=\"radio\" name=\"slider\" class=\"slide-radio1\" checked id=\"slider_1\">\n          <input type=\"radio\" name=\"slider\" class=\"slide-radio2\" id=\"slider_2\">\n          <input type=\"radio\" name=\"slider\" class=\"slide-radio3\" id=\"slider_3\">\n          <input type=\"radio\" name=\"slider\" class=\"slide-radio4\" id=\"slider_4\">\n\n          <!-- Slider Pagination -->\n          <div class=\"slider-pagination\">\n              <label for=\"slider_1\" class=\"page1\"></label>\n              <label for=\"slider_2\" class=\"page2\"></label>\n              <label for=\"slider_3\" class=\"page3\"></label>\n              <label for=\"slider_4\" class=\"page4\"></label>\n          </div>";
    findAllSlides(function (response) {
        const entries = Object.keys(response);
        for (const key of entries) {
            let h2s = "<h2>";
            response[key].slider_content1.split(/[,]/).forEach((data, index) => {
                h2s += `${data}`;
                if (index !== response[key].slider_content1.match(/.{1,29}/g).length)
                    h2s += `<br>`;
            });
            h2s += "</h2>";

            let h4s = "<h4>";
            response[key].slider_content2.split(/[|]/).forEach((data, index) => {
                h4s += `${data}`;
                if (index !== response[key].slider_content2.match(/.{1,29}/g).length)
                    h4s += `<br>`;
            });
            h4s += "</h4>";
debugger;
            slide += `
                 <!-- Slider #${parseInt(key) + 1} -->
          <div class="slider slide-${parseInt(key) + 1}" style="background: url(assets/images/slide/${response[key].bgImgFilename}) no-repeat 0 0;background-size: cover; box-shadow: inset 0 0 0 2000px rgba(187, 89, 184, 0.37);">
              <img src="assets/images/slide/${response[key].img1Filename}">
              ${response[key].img2Filename !== null ? '<img src="assets/images/slide/' + response[key].img2Filename +'" >' : ''}
              <div class="slider-content">${h2s}${h4s}</div>`;

            slide += `
                 <div class="number-pagination">
                  <span>${parseInt(key) + 1}</span>
              </div>
              <div class="date-pagination">
                  <span>${formatDate(new Date(getNextWeekDay(response[key].slider_event_date, response[key].sliderScheduleType)))}</span>
              </div>
          </div>`;
            // alt="mfmsouth' + response[key].img1Filename + '" alt=${"mfmsouth" + response[key].img1Filename}
        }
        // console.log(slide);
        $(".css-slider-wrapper").html(slide);
    });

    //==========target the dates in the slide change based on their specific days every week==========

    // let dateArray = document.getElementsByClassName('date-pagination');
    // dateArray.forEach((date)=>{
    //     parseDateString(date)
    // });

    // function parseDateString(dateString) {debugger;
    //     let months = {january:0,february:1,march:2,april:3,may:4,june:5,
    //         july:6,august:7,september:8,october:9,november:10,december:11};
    //     dateString = dateString.split(/[\s:]/);
    //
    //     let date = new Date(dateString[2], months[dateString[1].toLowerCase()], dateString[0]);
    //
    //     return date;
    // }

    let days =["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    function getInterval(today, actualDay, sType) {
        let interval = 0;
        let newMonthCount = 0;
        let checkNewMonth = true;
        let startPeriod = new Date(today.getFullYear(), today.getMonth(), 1);//get the start period
        let endPeriod = new Date(today.getFullYear(), today.getMonth() + 2, 0); //get the end period after 1 month, there'll only be a month interval here
        while (startPeriod < endPeriod) {

            // let nextMonth = new Date(year, month_number+1, 0);
            let firstOfNextMonth = new Date(today.getFullYear(), today.getMonth() + newMonthCount, 1);

            let lastOfNextMonth = new Date(today.getFullYear(), today.getMonth() + (newMonthCount + 1), 0);
            let numberOfDaysInMonth = lastOfNextMonth.getDate();
            let first = firstOfNextMonth.getDate();

            let aroundLastWeekofMonth = numberOfDaysInMonth - 7;

            //initialize first week
            let weekNumber = 1;
            while (first - 1 < numberOfDaysInMonth) {
                if (days[firstOfNextMonth.getDay()] === "Sunday" && firstOfNextMonth.getDate() !== 1) {
                    //get new week every new sunday according the local date format
                    weekNumber++;
                }
                if(firstOfNextMonth > today) {

                    if (days[firstOfNextMonth.getDay()] === actualDay) {

                        if (sType === 1) {
                            checkNewMonth = false;
                            return firstOfNextMonth
                        }
                        if (weekNumber === 2 && sType === 3) {
                            checkNewMonth = false;
                        }
                        if (weekNumber === 3 && sType === 4) {
                            checkNewMonth = false;
                            return firstOfNextMonth
                        }
                        if (weekNumber === 4 && sType === 5) {
                            checkNewMonth = false;
                            return firstOfNextMonth
                        }

                    }

                    if (days[firstOfNextMonth.getDay()] === actualDay && (first > 0 && first < 8) && sType === 2) {
                        checkNewMonth = false;
                        return firstOfNextMonth;
                    }

                    if (days[firstOfNextMonth.getDay()] === actualDay && (first > aroundLastWeekofMonth - 1 && first < numberOfDaysInMonth + 1)
                        && sType === 6) {
                        checkNewMonth = false;
                        return firstOfNextMonth;
                    }
                }

                // add a day
                firstOfNextMonth.setDate(firstOfNextMonth.getDate() + 1);
                first++;
            }
            if(checkNewMonth) {
                newMonthCount = 1;
                startPeriod.setMonth(startPeriod.getMonth() + 1);
            }
        }
    }

    function getNextWeekDay(dateString, scheduleType) {
        let today = new Date();
        let myDate = new Date(dateString);

        //return initial date if its just a one day event
        let dd = myDate.getDate();
        let mm = myDate.getMonth() + 1;
        let y = myDate.getFullYear();

        if (scheduleType !== 0) {
            let eventDate = null;
            if (today.getTime() > myDate.getTime()) {
                eventDate = getInterval(today, days[myDate.getDay()], scheduleType);
            }

            dd = eventDate.getDate();
            mm = eventDate.getMonth() + 1;
            y = eventDate.getFullYear();
        }

        return mm + '/' + dd + '/' + y;
    }

});
