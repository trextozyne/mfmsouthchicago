/*
  Author: Jack Ducasse;
  Version: 0.1.0;
  (◠‿◠✿)
*/
var Calendar = function(model, options, date){
    // Default Values
    this.Options = {
        Color: '',
        LinkColor: '',
        NavShow: true,
        NavVertical: false,
        NavLocation: '',
        DateTimeShow: true,
        DateTimeFormat: 'mmm, yyyy',
        DatetimeLocation: '',
        EventClick: '',
        EventTargetWholeDay: false,
        DisabledDays: [],
        ModelChange: model
    };
    // Overwriting default values
    for(var key in options){
        this.Options[key] = typeof options[key]=='string'?options[key].toLowerCase():options[key];
    }

    model?this.Model=model:this.Model={};
    this.Today = new Date();

    this.Selected = this.Today
    this.Today.Month = this.Today.getMonth();
    this.Today.Year = this.Today.getFullYear();
    if(date){this.Selected = date}
    this.Selected.Month = this.Selected.getMonth();
    this.Selected.Year = this.Selected.getFullYear();

    this.Selected.Days = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDate();
    this.Selected.FirstDay = new Date(this.Selected.Year, (this.Selected.Month), 1).getDay();
    this.Selected.LastDay = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDay();

    this.Prev = new Date(this.Selected.Year, (this.Selected.Month - 1), 1);
    if(this.Selected.Month==0){this.Prev = new Date(this.Selected.Year-1, 11, 1);}
    this.Prev.Days = new Date(this.Prev.getFullYear(), (this.Prev.getMonth() + 1), 0).getDate();
};


// ---Random colors for events on calendar-----
// --------------------------------------------------------------
let eventData =[];
let bgColor = [];
function getRandomColor() {
    // var letters = '0123456789ABCDEF';
    // for (var i = 0; i < 6; i++) {
        // color += letters[Math.floor(Math.random() * 16)];
    // }

    let color = '#';
    color += Math.floor(Math.random() * 16777216).toString(16);
    return color;
}
// ---Random colors for events on calendar-----
// --------------------------------------------------------------

function createCalendar(calendar, element, adjuster){
    element.innerHTML = "";
    if(typeof adjuster !== 'undefined'){
        var newDate = new Date(calendar.Selected.Year, calendar.Selected.Month + adjuster, 1);
        calendar = new Calendar(calendar.Model, calendar.Options, newDate);
        element.innerHTML = '';
    }else{
        for(var key in calendar.Options){
            typeof calendar.Options[key] != 'function' && typeof calendar.Options[key] != 'object' && calendar.Options[key]?element.className += " " + key + "-" + calendar.Options[key]:0;
        }
    }
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function AddSidebar(){
        var sidebar = document.createElement('div');
        sidebar.className += 'cld-sidebar';

        var monthList = document.createElement('ul');
        monthList.className += 'cld-monthList';

        let prevMnth = calendar.Selected.Month === 0 ? "" : months[calendar.Selected.Month-1];
        let nxtMnth = calendar.Selected.Month === 11 ? "" : months[calendar.Selected.Month+1];

        for(var i = 0; i < months.length - 3; i++){
            var x = document.createElement('li');
            x.className += 'cld-month';
            var n = i - (4 - calendar.Selected.Month);
            // Account for overflowing month values
            if(n<0){n+=12;}
            else if(n>11){n-=12;}
            // Add Appropriate Class
            if(i==0){
                x.className += ' cld-rwd cld-nav';
                x.addEventListener('click', function(){
                    typeof calendar.Options.ModelChange == 'function'?calendar.Model = calendar.Options.ModelChange():calendar.Model = calendar.Options.ModelChange;
                    createCalendar(calendar, element, -1);});
                x.innerHTML += '<svg height="15" width="15" viewBox="0 0 100 75" fill="rgba(255,255,255,0.5)"><polyline points="0,75 100,75 50,0">' +
                    '</polyline></svg>' +
                    '<div class="left">' + prevMnth + '</div>';
            }
            else if(i==months.length - 4){
                x.className += ' cld-fwd cld-nav';
                x.addEventListener('click', function(){
                    typeof calendar.Options.ModelChange == 'function'?calendar.Model = calendar.Options.ModelChange():calendar.Model = calendar.Options.ModelChange;
                    createCalendar(calendar, element, 1);} );
                x.innerHTML += '<svg height="15" width="15" viewBox="0 0 100 75" fill="rgba(255,255,255,0.5)"><polyline points="0,0 100,0 50,75"></polyline>' +
                    '</svg>' +
                '<div class="right">' + nxtMnth + '</div>';
            }
            else{
                if(i < 4){x.className += ' cld-pre';}
                else if(i > 4){x.className += ' cld-post';}
                else{x.className += ' cld-curr';}

                //prevent losing var adj value (for whatever reason that is happening)
                (function () {
                    var adj = (i-4);
                    //x.addEventListener('click', function(){createCalendar(calendar, element, adj);console.log('kk', adj);} );
                    x.addEventListener('click', function(){
                        typeof calendar.Options.ModelChange == 'function'?calendar.Model = calendar.Options.ModelChange():calendar.Model = calendar.Options.ModelChange;
                        createCalendar(calendar, element, adj);} );
                    x.setAttribute('style', 'opacity:' + (1 - Math.abs(adj)/4));
                    x.innerHTML += months[n].substr(0,3);
                }()); // immediate invocation

                if(n==0){
                    var y = document.createElement('li');
                    y.className += 'cld-year';
                    if(i<5){
                        y.innerHTML += calendar.Selected.Year;
                    }else{
                        y.innerHTML += calendar.Selected.Year + 1;
                    }
                    monthList.appendChild(y);
                }
            }
            monthList.appendChild(x);
        }
        sidebar.appendChild(monthList);
        if(calendar.Options.NavLocation){
            document.getElementById(calendar.Options.NavLocation).innerHTML = "";
            document.getElementById(calendar.Options.NavLocation).appendChild(sidebar);
        }
        else{element.appendChild(sidebar);}
    }

    var mainSection = document.createElement('div');
    mainSection.className += "cld-main";

    var today= null;
    function AddDateTime(){
        var datetime = document.createElement('div');
        datetime.className += "cld-datetime";

        let prevMnth = calendar.Selected.Month === 0 ? "" : months[calendar.Selected.Month-1];
        let nxtMnth = calendar.Selected.Month === 11 ? "" : months[calendar.Selected.Month+1];
        if(calendar.Options.NavShow && !calendar.Options.NavVertical){
            var rwd = document.createElement('div');
            rwd.className += " cld-rwd cld-nav";
            rwd.addEventListener('click', function(){createCalendar(calendar, element, -1);} );
            rwd.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0,0,0,0.5)"><polyline points="0,50 75,0 75,100">' +
                '</polyline></svg>' +
            '<div class="left">' + prevMnth + '</div>';
            datetime.appendChild(rwd);
        }
        today = document.createElement('div');
        today.className += ' today';
        today.innerHTML = months[calendar.Selected.Month] + ", " + calendar.Selected.Year;
        datetime.appendChild(today);
        if(calendar.Options.NavShow && !calendar.Options.NavVertical){
            var fwd = document.createElement('div');
            fwd.className += " cld-fwd cld-nav";
            fwd.addEventListener('click', function(){createCalendar(calendar, element, 1);} );
            fwd.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0,0,0,0.5)"><polyline points="0,0 75,50 0,100">' +
                '</polyline></svg>' +
                '<div class="right">' + nxtMnth + '</div>';
            datetime.appendChild(fwd);
        }
        if(calendar.Options.DatetimeLocation){
            document.getElementById(calendar.Options.DatetimeLocation).innerHTML = "";
            document.getElementById(calendar.Options.DatetimeLocation).appendChild(datetime);
        }
        else{mainSection.appendChild(datetime);}
    }

    var labels = "";
    function AddLabels(){
        labels = document.createElement('table');
        labels.className = 'cld-labels';
        var labelstr = document.createElement("tr");
        labels.appendChild(labelstr);
        var labelsList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for(var i = 0; i < labelsList.length; i++){
            var label = document.createElement('td');
            label.className += "cld-label";
            label.innerHTML = labelsList[i];
            labelstr.appendChild(label);
        }
        mainSection.appendChild(labels);
    }


    let dayCounter = 0;

    function AddDays(){
        // Create Number Element
        function DayNumber(n){
            var div = document.createElement('div');
            var table = document.createElement('table');
            table.className += "table-cld-number";
            div.appendChild(table);
            var thead = document.createElement('thead');
            table.appendChild(thead);
            var tabletr = document.createElement('tr');
            thead.appendChild(tabletr);
            var tabletd = document.createElement('td');
            tabletr.appendChild(tabletd);
            var number = document.createElement('p');
            tabletd.appendChild(number);
            number.setAttribute("data-day", n);
            let month_year_data = today.innerText.split(",");
            number.setAttribute("data-month", month_year_data[0]);
            number.setAttribute("data-year", month_year_data[1]);
            number.className += "cld-number";
            var numberSpan = document.createElement('span');
            numberSpan.className += "cld-number-span";
            numberSpan.innerHTML += n;
            number.appendChild(numberSpan);
            return div;
        }

        var days = "";
        // Previous Month's Days
        for(var i = 0; i < (calendar.Selected.FirstDay); i++){
            if(dayCounter === 0){
                days = document.createElement('tr');
                days.className += "cld-days";
                labels.appendChild(days);
            }

            var day = document.createElement('td');
            day.className += "cld-day prevMonth";
            //Disabled Days
            var d = i%7;
            for(var q = 0; q < calendar.Options.DisabledDays.length; q++){
                if(d==calendar.Options.DisabledDays[q]){
                    day.className += " disableDay";
                }
            }

            var number = DayNumber((calendar.Prev.Days - calendar.Selected.FirstDay) + (i+1));
            day.appendChild(number);

            var rows = document.querySelector("table:not(.table-cld-number)").getElementsByClassName("cld-days").length;
            if(rows < 7)
                days.appendChild(day);

            if(dayCounter !== 7)
                dayCounter+=1;
            if(dayCounter === 7) {
                dayCounter = 0;
            }
        }
        // Current Month's Days
        for(var i = 0; i < calendar.Selected.Days; i++){
            if(dayCounter === 0){
                days = document.createElement('tr');
                days.className += "cld-days";
                labels.appendChild(days);
            }
            var day = document.createElement('td');
            day.className += "cld-day currMonth";
            //Disabled Days
            var d = (i + calendar.Selected.FirstDay)%7;
            for(var q = 0; q < calendar.Options.DisabledDays.length; q++){
                if(d==calendar.Options.DisabledDays[q]){
                    day.className += " disableDay";
                }
            }
            let number = DayNumber(i+1);
            // Check Date against Event Dates
            for(var n = 0; n < calendar.Model.length; n++){
                var evDate = calendar.Model[n].Date.split(",");
                evDate = new Date(evDate[0], parseInt(evDate[1])-1,  evDate[2])

                var toDate = new Date(calendar.Selected.Year, calendar.Selected.Month, (i+1));
                if(evDate.getTime() === toDate.getTime()){
                    number.className += " eventday";
                    var title = document.createElement('span');
                    title.className += "cld-title"

                    // -------------color operation-------------------
                    if(eventData.includes(calendar.Model[n].Title.trim())) {
                        title.style.backgroundColor = bgColor[eventData.indexOf(calendar.Model[n].Title.trim())];
                    }
                    if(!eventData.includes(calendar.Model[n].Title.trim())){
                        bgColor.push(getRandomColor());
                        eventData.push(calendar.Model[n].Title.trim());
                        title.style.backgroundColor = bgColor[eventData.indexOf(calendar.Model[n].Title.trim())];
                    }
                    // -------------color operation-------------------

                    if(typeof calendar.Model[n].Link === 'function' || calendar.Options.EventClick){
                        var a = document.createElement('a');
                        a.setAttribute('href', '#');
                        a.innerHTML += calendar.Model[n].Title;
                        if(calendar.Options.EventClick){
                            // var eventLink = calendar.Model[n].Link + _eventId;
                            var eventLink = calendar.Model[n].Link + _eventId;
                            if(typeof calendar.Model[n].Link !== 'string'){
                                a.addEventListener('click', calendar.Options.EventClick.bind.apply(calendar.Options.EventClick, [null].concat(eventLink)) );
                                if(calendar.Options.EventTargetWholeDay){
                                    day.className += " clickable";
                                    day.addEventListener('click', calendar.Options.EventClick.bind.apply(calendar.Options.EventClick, [null].concat(eventLink)) );
                                }
                            }else{
                                a.addEventListener('click', calendar.Options.EventClick.bind(null, eventLink) );
                                if(calendar.Options.EventTargetWholeDay){
                                    day.className += " clickable";
                                    day.addEventListener('click', calendar.Options.EventClick.bind(null, eventLink) );
                                }
                            }
                        }else{
                            a.addEventListener('click', calendar.Model[n].Link);
                            if(calendar.Options.EventTargetWholeDay){
                                day.className += " clickable";
                                day.addEventListener('click', calendar.Model[n].Link);
                            }
                        }
                        title.appendChild(a);
                    }else{
                        title.innerHTML += '<p ' +
                            'style="color: #fff;text-align: center !important; margin: 0;font-size: 12;">' + calendar.Model[n].Time + '</p>' +
                            // '<a href="' + calendar.Model[n].Link + '">' + calendar.Model[n].Title + '</a>';
                        '<a target="_blank" href="./events-single.html?id=' + calendar.Model[n]._id + '&date=' + doJoin(calendar.Model[n].Date) +'">' + calendar.Model[n].Title + '</a>';
                    }
                    number.appendChild(title);
                }
            }
            day.appendChild(number);

            var rows = document.querySelector("table:not(.table-cld-number)").getElementsByClassName("cld-days").length;
            if(rows < 7)
                days.appendChild(day);
            // If Today..
            if((i+1) === calendar.Today.getDate() && calendar.Selected.Month === calendar.Today.Month && calendar.Selected.Year === calendar.Today.Year){
                day.className += " today";
            }
            // days.appendChild(day);

            if(dayCounter !== 7)
                dayCounter+=1;
            if(dayCounter === 7) {
                dayCounter = 0;
            }
        }
        // Next Month's Days
        // Always same amount of days in calander
        var extraDays = 13;
        if(days.children.length>35){extraDays = 6;}
        else if(days.children.length<29){extraDays = 20;}

        for(var i = 0; i < (extraDays - calendar.Selected.LastDay); i++){
            if(dayCounter === 0){
                days = document.createElement('tr');
                days.className += "cld-days";
                labels.appendChild(days);
            }

            var day = document.createElement('td');
            day.className += "cld-day nextMonth";
            //Disabled Days
            var d = (i + calendar.Selected.LastDay + 1)%7;
            for(var q = 0; q < calendar.Options.DisabledDays.length; q++){
                if(d==calendar.Options.DisabledDays[q]){
                    day.className += " disableDay";
                }
            }

            var number = DayNumber(i+1);
            day.appendChild(number);
            var rows = document.querySelector("table:not(.table-cld-number)").getElementsByClassName("cld-days").length;
            if(rows < 7)
                days.appendChild(day);

            // days.appendChild(day);

            if(dayCounter !== 7)
                dayCounter+=1;
            if(dayCounter === 7) {
                dayCounter = 0;
            }
        }
        // mainSection.appendChild(days);
    }
    if(calendar.Options.Color){
        mainSection.innerHTML += '<style>.cld-main{color:' + calendar.Options.Color + ';}</style>';
    }
    if(calendar.Options.LinkColor){
        mainSection.innerHTML += '<style>.cld-title a{color:' + calendar.Options.LinkColor + ';}</style>';
    }
    element.innerHTML = "";
    element.appendChild(mainSection);

    if(calendar.Options.NavShow && calendar.Options.NavVertical){
        AddSidebar();
    }
    if(calendar.Options.DateTimeShow){
        AddDateTime();
    }
    AddLabels();
    AddDays();
}

function caleandar(el, data, settings){
    var obj = new Calendar(data, settings);
    createCalendar(obj, el);
}
