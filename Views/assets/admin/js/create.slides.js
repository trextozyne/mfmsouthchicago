// let tab = document.getElementById("nav-add-text_on_slider-tab");
let aTab = document.getElementsByTagName("a");
Array.from(aTab).forEach((a)=>{
    a.addEventListener("click", (event)=>{
        debugger;
        if(event.target.id === "nav-add-text_on_slider-tab")
            document.getElementById("slideSelector").removeAttribute("hidden");
        else
            document.getElementById("slideSelector").setAttribute("hidden", "hidden");
    });
})


//=====================The Slides on the Index==============================
function emptySlidesDBData(slidesData) {
    debugger;
    "use strict";
    const dataList = Object.values(slidesData);
    for (const data in dataList) {
        deleteSlidesDBData(slidesData[data]._id, function (response) { alert(response)})
    }
}

let slidesDataClone = [];
function removeSpecificSlidesDBData(slidesData, removeSlideTotal) {
debugger;
    slidesDataClone = slidesData;
    slidesData.forEach(function (slidesVal, index) {
        if (removeSlideTotal > 0){
            slidesDataClone.splice((removeSlideTotal-1), 1);
            removeSlideTotal--;
        }
    });

    "use strict";
    const dataList = Object.values(slidesDataClone);
    for (const data in dataList) {
        deleteSlidesDBData(slidesDataClone[data]._id, function (response) { alert(response)})
    }
}

function deleteSlidesDBData(id, callback){
    let url= `/slides/${id}/delete`;

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "DELETE"
    };

    $.ajax(settings).done(callback);
}

function findAllSlides(callback) {
    let url= "/slides/find";

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET"
    };

    $.ajax(settings).done(callback);
}

function saveSlides($this) {
    let url= "/slides/create";
    let formData = $this.serializeArray();
    debugger;

    let data = new FormData();

    formData.forEach(function (fData, index) {
        switch (fData.name) {
            case 'sliderType':
                data.append("sliderType", fData.value);
                break;
            case 'slider_event_date':
                data.append("slider_event_date", fData.value);
                break;
            case 'slider_content1':
                data.append("slider_content1", fData.value);
                break;
            case 'slider_content2':
                data.append("slider_content2", fData.value);
                break;
            case 'sliderScheduleType':
                data.append("sliderScheduleType", fData.value);
                break;
        }
    });

    data.append("bg-img", $(`form#${$this.attr("id")} :input[name='bg-img']`)[0].files[0]);
    data.append("img-1", $(`form#${$this.attr("id")} :input[name='img-1']`)[0].files[0]);
    if(typeof $(`form#${$this.attr("id")} :input[name='img-2']`)[0] !== "undefined")
        data.append("img-2", $(`form#${$this.attr("id")} :input[name='img-2']`)[0].files[0]);

    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
        }
    });

    xhr.open("POST", url);
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("postman-token", "fb4e4d0c-26b1-ef6c-3beb-5f791abc83b0");

    // let rdata = JSON.stringify(data);
    xhr.send(data);
}

var slides = {};

function checkExistence($this, evt, button){
    let bool_exist = false;
    findAllSlides(function (response) {
        "use strict";
        debugger;
        const dataList = Object.values(response);
        for (const data in dataList) {
            if (sliderType.trim() === response[data].sliderType) {
                bool_exist = true;
                if (confirm('This data already exist in database, would you like to proceed to updating it?') && button.text() !== "Update") {
                    let formInput = $(`form#${evt.target.id} :input[id^='slider-'][id*='-content'], 
                                form#${evt.target.id} :input[id^='slider-'][id$='-date']`);//
                    Object.keys(response[data]).forEach(function (key) {
                        formInput.each(function (index, inputEle) {
                            if (key.trim() === $(inputEle).attr("name").trim()) {
                                $(inputEle).val("");
                                $(inputEle).val(response[data][key]);
                            }
                            slides[key] = response[data][key];
                        });
                    });

                    button.html('Update');
                }
                break;
            }
        }

        if((response.length === 0 || button.text() === "Submit") && bool_exist === false)
            saveSlides($this);
    });
}


let forms = null;
function doSliderUpdate($this){
    "use strict";
    debugger;
    let data = new FormData();
    const entries = Object.entries(slides);
    for (const [key, slideData] of entries) {
        switch (key) {
            case 'sliderScheduleType':
                data.append("sliderScheduleType", $(`form#${$this.attr("id")} :input[name ="sliderScheduleType"]`)[0].value);
                break
            case 'sliderType':
                data.append("sliderType", $(`form#${$this.attr("id")} :input[name ="sliderType"]`)[0].value);
                break
            case 'slider_content1':
                if($(`form#${$this.attr("id")} :input[id^='slider-'][id*='-content']`)[0].value)
                    data.append("slider_content1", $(`form#${$this.attr("id")} :input[id^='slider-'][id*='-content']`)[0].value);
                else
                    data.append("slider_content1", slideData);
                break
            case 'slider_content2':
                if($(`form#${$this.attr("id")} :input[id^='slider-'][id*='-content']`)[0].value)
                    data.append("slider_content2", $(`form#${$this.attr("id")} :input[id^='slider-'][id*='-content']`)[1].value);
                else
                    data.append("slider_content1", slideData);
                break;
            case 'slider_event_date':
                if($(`form#${$this.attr("id")} :input[id^='slider-'][id*='-content']`)[0].value)
                    data.append("slider_event_date", $(`form#${$this.attr("id")} :input[id^='slider-'][id$='-date']`)[0].value);
                else
                    data.append("slider_content1", slideData);
                break;
            default:
                data.append(key, slideData);
        }
    }
    data.append("bg-img", $(`form#${$this.attr("id")} :input[name='bg-img']`)[0].files[0]);
    data.append("img-1", $(`form#${$this.attr("id")} :input[name='img-1']`)[0].files[0]);
    if(typeof $(`form#${$this.attr("id")} :input[name='img-2']`)[0] !== "undefined")
        data.append("img-2", $(`form#${$this.attr("id")} :input[name='img-2']`)[0].files[0]);

    let url = "/slides/" + slides._id + "/update";
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
        }
    });

    xhr.open("PUT", url);
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("postman-token", "fb4e4d0c-26b1-ef6c-3beb-5f791abc83b0");

    // let rdata = JSON.stringify(data);
    xhr.send(data);
}

$(`body`).on("submit", forms).submit(function(evt) {
    evt.preventDefault();
    debugger;
    let button = $('#'+evt.target.id).find($(`button[id^='slider-'][id$='-submit']`));
    sliderType = $(`form#${evt.target.id} :input[name ="sliderType"]`).val();

    if(button.text() === "Update"){
        doSliderUpdate($(evt.target));
        button.html("Submit")
    }else {
        checkExistence($(evt.target), evt, button);
    }
});

(()=> {
    //===========for slide date pickers========
    // $(`#slider-1-date`).datepicker();
    // $('#slider-2-date').datepicker();
    // $('#slider-3-date').datepicker();
    // $('#slider-4-date').datepicker();
    // $('body').on('focus',".datepicker", function(){
    //     //     $(this).datepicker();
    //     // });​
})();

$('body').on("click",`[id^=slider-][id $=-submit]`,function(evt) {//#sermon_submit
debugger
    evt.preventDefault();
    let id = this.id.match(/\d+/);
    sliderType = `slider${id[0]}`;
    forms = `slider_${id[0]}_text_form`;
    $(`body #slider_${id[0]}_text_form`).submit(); //Trigger the Submit Here
});


let count = 1;
let slideSaved = 0;
let slidesDBData = null;
function createSlidesMulti($this) {
    debugger;
    findAllSlides(function (response) {
        slidesDBData = response;
        slideSaved = response.length;
    });

    let i = parseInt($this.value);

    let slidesContainer = document.getElementById("nav-add-text_on_slider");
    let slideAddedDivs = slidesContainer.querySelectorAll('div.borderpad').length;

    if(slideSaved > i && $this.nodeName === "SELECT") {
        if (confirm(`Warning!!!, you are about to delete all slides in database. "Cancel" to try another option or "OK" to proceed`)) {
            slidesContainer.innerHTML = `<h2 style="text-align: center; text-transform: capitalize">use '"|", ","' for sepreation and new line techniques with your text for the slide text display formates</h2>`;

            emptySlidesDBData(slidesDBData);
        } else if (confirm(`Warning!!!, you are about to reduce the amount of slides in the database by ${slideSaved-i}`)) {
            slidesContainer.innerHTML = `<h2 style="text-align: center; text-transform: capitalize">use '"|", ","' for sepreation and new line techniques with your text for the slide text display formates</h2>`;

            removeSpecificSlidesDBData(slidesDBData, (slideSaved-i))
        }else if (confirm(`Perhaps you just want to add ${i} more to the existing ones.`)) {
            count = slideAddedDivs + 1;
            i += slideAddedDivs;
        } else {
            return false;
        }
    }else if(slideSaved <= i && $this.nodeName === "SELECT") {
        if (confirm(`Warning!!!, you are about to delete all slides in database. "Cancel" to try another option or "OK" to proceed`)) {
            slidesContainer.innerHTML = `<h2 style="text-align: center; text-transform: capitalize">use '"|", ","' for sepreation and new line techniques with your text for the slide text display formates</h2>`;

            emptySlidesDBData(slidesDBData);
        }else if (confirm(`Perhaps you just want to add ${i} more to the existing ones.`)) {
            count = slideAddedDivs + 1;
            i += slideAddedDivs;
        } else {
            return false;
        }
    }

    let row = document.createElement('div');
    row.classList.add('row');

    while (count < i + 1) {
        row.innerHTML += `
            <!--Grid column-->
                                        <div class="col-md-6 borderpad">
                                            <form method="post" id="slider_${count}_text_form" enctype="multipart/form-data">
                                                <input type="text" name="sliderType" value="slider${count}" hidden>
                                                <!--BG-Image-->
                                                <div class="input-group">
                                                    <label for="bg-img-${count}">Add background image</label>
                                                    <div class="input-group input-file">
                                                        <input type='file' name='bg-img' id='bg-img-${count}' class='input-ghost'  style='visibility:hidden; height:0'  enctype="multipart/form-data">
                                                        <span class="input-group-btn">
                                                                    <button class="btn btn-default btn-choose" type="button">Choose</button>
                                                                </span>
                                                        <input type="text" class="form-control col-lg-6" id="bg-img-${count}-name" name="bg-img-${count}-name" placeholder='Choose a file...' />
                                                        <span class="input-group-btn">
                                                                    <button class="btn btn-warning btn-reset" type="button">Reset</button>
                                                                </span>
                                                        <img src="" alt="">
                                                    </div>
                                                </div>
                                                <!--Internal Image ${count}-->
                                                <div class="input-group">
                                                    <label for="img-${count}">Add Slider ${count} image 1</label>
                                                    <div class="input-group input-file">
                                                        <input type='file' name='img-1' class='input-ghost'  style='visibility:hidden; height:0'  enctype="multipart/form-data">
                                                        <span class="input-group-btn">
                                                                    <button class="btn btn-default btn-choose" type="button">Choose</button>
                                                                </span>
                                                        <input type="text" class="form-control col-lg-6" name="img-name-1" placeholder='Choose a file...' />
                                                        <span class="input-group-btn">
                                                                    <button class="btn btn-warning btn-reset" type="button">Reset</button>
                                                                </span>
                                                        <img src="" alt="">
                                                    </div>
                                                </div>
                                                <!--Internal Image 2-->
                                                <div class="input-group">
                                                    <label for="img-2">Add Slider ${count} image 2</label>
                                                    <div class="input-group input-file">
                                                        <input type='file' name='img-2' class='input-ghost'  style='visibility:hidden; height:0'  enctype="multipart/form-data">
                                                        <span class="input-group-btn">
                                                                    <button class="btn btn-default btn-choose" type="button">Choose</button>
                                                                </span>
                                                        <input type="text" class="form-control col-lg-6" name="img-name-2" placeholder='Choose a file...' />
                                                        
                                                        <span class="input-group-btn">
                                                                    <button class="btn btn-warning btn-reset" type="button">Reset</button>
                                                                </span>
                                                        <img src="" alt="">
                                                    </div>
                                                </div>
                                                <!--date-->
                                                <div class="input-group">
                                                    <label for="slider-${count}-date">Add Date Slider ${count}</label>
                                                    <div class="input-group">
                                                        <input type="text" class="form-control datepicker" name="slider_event_date" id="slider-${count}-date" placeholder="Slider ${count} date">
                                                    </div>
                                                </div>
                                                <!---schecule type--->
                                                <div class="input-group" style="margin-bottom: 5px">
                                                    <label for="sliderScheduleType${count}">Select schedule type</label>
                                                    <div class="input-group">
                                                        <select id="sliderScheduleType${count}" name="sliderScheduleType">
                                                            <option value="0">One day event</option>
                                                            <option value="1">Weekly</option>
                                                            <option value="2">First (specific) day</option>
                                                            <option value="3">2 Weeks</option>
                                                            <option value="4">3 Weeks</option>
                                                            <option value="5">4 weeks</option>
                                                            <option value="6">Last day(specific)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <!--content 1-->
                                                <div class="input-group">
                                                    <label for="slider-${count}-content-1">Add Slider ${count} content 1</label>
                                                    <div class="input-group">
                                                        <input type="text" class="form-control col-lg-8" name="slider_content1" id="slider-${count}-content-1" placeholder="Slider ${count} Content 1">
                                                     </div>
                                                </div>
                                                <!--content 2-->
                                                <div class="input-group">
                                                    <label for="slider-${count}-content-2">Add Slider ${count} content 2</label>
                                                    <div class="input-group">
                                                        <input type="text" class="form-control col-lg-8" name="slider_content2" id="slider-${count}-content-2" placeholder="Slider ${count} Content 2">
                                                        <span class="input-group-btn">
                                                                      <button class="btn btn-default" id="slider-${count}-submit" type="button">Submit</button>
                                                                  </span>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
    `;

        if (count === i && count !== 1) {
            slidesContainer.appendChild(row);
        }

        if(count % 2 === 0 && i !== count){
            slidesContainer.appendChild(row);
            row = document.createElement('div');
            row.classList.add('row');
        }

        let slideDate = `#slider-${count}-date`;
        // $(slideDate).datepicker();

        count++;
    }

    debugger;
    let dateArr = $(`body [id^=slider-][id $=-date]`);
    $.each(dateArr, (i, val)=>{
        $(val).datepicker();
    });

    bs_input_file();

    count = 1;
}

findAllSlides((response)=>{
    let $this = {
                    "value": response.length.toString(),
                    "nodeName": "NONE"
                };
    createSlidesMulti($this);
});





