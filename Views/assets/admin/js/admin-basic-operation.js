var sliderType = "";
var _bibleVerseId = "";
// get the verse id on load if it exists
$(document).ready(function () {
    $.ajax({
        async: true,
        crossDomain: true,
        url: "/verse/find",
        method: "GET"
    }).done(function (response) {
       if(response[0])
        _bibleVerseId = response[0]._id;
    });

    //===========for slide date pickers========
    $('#slider-1-date').datepicker();
    $('#slider-2-date').datepicker();
    $('#slider-3-date').datepicker();
    $('#slider-4-date').datepicker();
});



$(document).on("click","button",function(evt) {//#sermon_submit

    evt.preventDefault();

    if(this.id === "ImgForm_submit") {
        $("#img_gallery_form").submit(); //Trigger the Submit Here
    }

    if(this.id === "sermonFile_submit") {
        $("#sermonFile_form").submit(); //Trigger the Submit Here
    }
    if(this.id === "audio_submit") {
        $("#audio_form").submit(); //Trigger the Submit Here
    }
    if(this.id === "verse_submit") {
        $("#verse_form").submit(); //Trigger the Submit Here
    }
    if(this.id === "slider-1-submit") {
        sliderType = "slider1";
        $("#slider_1_text_form").submit(); //Trigger the Submit Here
    }
    if(this.id === "slider-2-submit") {
        sliderType = "slider2";
        $("#slider_2_text_form").submit(); //Trigger the Submit Here
    }
    if(this.id === "slider-3-submit") {
        sliderType = "slider3";
        $("#slider_3_text_form").submit(); //Trigger the Submit Here
    }
    if(this.id === "slider-4-submit") {
        sliderType = "slider4";
        $("#slider_4_text_form").submit(); //Trigger the Submit Here
    }
});

$("#verse_form").submit(function(evt) {
    evt.preventDefault();
    let url ="";
    let method ="";

    let $form = $("#verse_form");

    if ($form[0]["chapter"].value === null || $form[0]["chapter"].value === "", $form[0]["verse"].value === null || $form[0]["verse"].value === "") {
        alert("Please Fill All Required Field");
        return false;
    }else {
        let formData = JSON.parse(JSON.stringify(getFormData($form)));

        if (!_bibleVerseId) {
            url = "/verse/create";
            method = "POST";
        } else {
            url = "/verse/" + _bibleVerseId + "/update";
            method = "PUT";
        }

        $.ajax({
            async: true,
            crossDomain: true,
            url: url,
            method: method,
            headers: {
                contentType: "application/json",
                "cache-control": "no-cache",
                "postman-token": "5752cc56-4e59-9487-eba0-d5b701685aed"
            },
            data: formData
        }).done(function (response) {
            if (!_bibleVerseId) _bibleVerseId = response;
            alert("Saved");
            $form.find("input[type=text], textarea").val("");
        }).fail(function (data) {
            // alert("it must be an image");
        });

    }
});

$("#sermonFile_form").submit(function(evt) {
    function doSermonUpdate(response){
        console.log(response);
        alert("Saved: " + response);
        $form.find("input[type=text], textarea").val("");
    }

    evt.preventDefault();
    let url = "/files/create";

    let $form = $("#sermonFile_form");
    debugger;
    if ($form[0]["filename"].value === null || $form[0]["filename"].value === "", $form[0]["pdfFile"].files.length === 0) {
        alert("Please Fill All Required Field");
        return false;
    }else {
        let formData = JSON.parse(JSON.stringify(getFormData($form)));
        delete formData.sermonFile;

        $(this).ajaxSubmit({
            url: url,
            method: "POST",
            data: formData,
            contentType: 'application/json',
            dataType: "json",
            success: doSermonUpdate
        });
    }
});
// ###########################find#########################################
let boolDataExist = false;
$.ajax({
    url: '/files/find',
    dataType: "json",
    success: function (data) {
        let html = "<table>\n" +
            "  <thead>\n" +
            "    <tr>\n" +
            "      <th scope=\"col\">Data</th>\n" +
            "      <th scope=\"col\">Date Created</th>\n" +
            "      <th scope=\"col\">Link</th>\n" +
            "      <th scope=\"col\">Remove</th>\n" +
            "    </tr>\n" +
            "  </thead>\n" +
            "  <tbody>\n";
        data.forEach((data, k) => {
            boolDataExist = true;
            html +=
                "<tr>" +
                '<td data-label="Data">' +
                '<p>' + data.filename + '</p>' +
                '</td>' +
                '<td data-label="Date Created">' + data.uploadDate + '</td>\n' +
                '      <td data-label="Link"><a target="_blank"  href="/files/download/' + data._id + '">Download</a></td>\n' +
                '      <td data-label="Remove"><a href="javascript:void(0)" onclick="onDelete(\'files/delete/' + data._id + '\')">Delete</a></td>' +
                '</tr>';
        });

        html +=
            '  </tbody>\n' +
            '</table>\n'
        if (boolDataExist === true) document.getElementById("pdf_files").innerHTML = html;
        boolDataExist = false;
    }
});

$("#audio_form").submit(function(evt) {
    function doAudioUpdate(response){
        console.log(response);
        alert("Saved: " + response);
        $form.find("input[type=text], textarea").val("");
    }

    evt.preventDefault();
    let url= "/tracks/create";
    debugger;

    let $form = $("#audio_form");
    if ($form[0]["speaker"].value === null || $form[0]["speaker"].value === "", $form[0]["name"].value === null || $form[0]["name"].value === "",
            $form[0]["track"].files.length === 0, $form[0]["duration"].value === null || $form[0]["duration"].value === "") {
        alert("Please Fill All Required Field");
        return false;
    }else {
        let formData = JSON.parse(JSON.stringify(getFormData($form)));
        delete formData.sermonAudio;

        $(this).ajaxSubmit({
            url: url,
            method: "POST",
            data: formData,
            contentType: 'application/json',
            dataType: "json",
            success: doAudioUpdate
        });
    }
});
// ############################find########################################

$.ajax({
    url: '/tracks/find',
    dataType: "json",
    success: function (data) {
        let html = "<table>\n" +
            "  <caption>Statement Summary</caption>\n" +
            "  <thead>\n" +
            "    <tr>\n" +
            "      <th scope=\"col\">Data</th>\n" +
            "      <th scope=\"col\">Date Created</th>\n" +
            "      <th scope=\"col\">Link</th>\n" +
            "      <th scope=\"col\">Remove</th>\n" +
            "    </tr>\n" +
            "  </thead>\n" +
            "  <tbody>\n";
        data.forEach((data, k) => {
            boolDataExist = true;
            html +=
                "<tr>"+
                '<td data-label="Data">' +
                '<a  href="javascript:void(0)" onclick="_onClickItem(\''+ data._id +'\')">' + data.metadata.speaker+' - ' + data.filename + '(' +data.metadata.duration + 'hr) </a>' +
                '</td>'+
            '<td data-label="Date Created">'+data.uploadDate+'</td>\n' +
                '      <td data-label="Link"><a target="_blank"  href="/tracks/download/'+ data._id +'">Download</a></td>\n' +
                '      <td data-label="Remove"><a href="javascript:void(0)" onclick="onDelete(\'tracks/delete/'+ data._id +'\')">Delete</a></td>'+
                '</tr>';
        });

        html+=
            '  </tbody>\n' +
            '</table>\n' +
            '<div id="audio" hidden="hidden">\n' +
            '                                <audio id="myAudio" controls>\n' +
            '                                    <source src="" type="audio/mp3">\n' +
            '                                    Your browser does not support the audio element.\n' +
            '                                </audio>\n' +
            '                            </div>'

        if (boolDataExist === true) document.getElementById("nav-audio-list").innerHTML = html;

        boolDataExist = false;
    }
});

function _onClickItem(trackId){
    debugger;
    let audioContainer = document.getElementById("audio");
    audioContainer.removeAttribute("hidden");
    // document.getElementById("audio").innerHTML =
    // '<video controls="" autoplay="" name="media"><source src="/tracks/' + trackId + '" type="audio/mp3"></video>';
    let url = "/tracks/" + trackId;
    // let video = document.getElementById("myVideo");
    let audio = document.getElementById("myAudio");
    // video.setAttribute("src", url);
    // video.load();
    audio.setAttribute("src", url);
    audio.load();
    audio.play();
}

function onDelete(url ) {
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
        }
    });

    xhr.open("DELETE", url);
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("postman-token", "d6b19a54-d39e-bddd-1f61-985eb1f312c9");

    xhr.send(data);
}

//=====================The Slides on the Index==============================
function findAllSlides(callback) {
    let url= "/slides/find";
    $(this).ajaxSubmit({
        url: url,
        method: "GET",
        contentType: 'application/json',
        dataType: "json",
        success: callback
    });
}

function saveSlides($this) {
    let url= "/slides/create";
    let formData = $this.serializeArray();
    debugger;
    $this.ajaxSubmit({
        url: url,
        method: "POST",
        data: JSON.stringify(formData),
        contentType: 'application/json',
        dataType: "json",
        success: function (response) {
            alert("Saved: " + response);
        }
    });
}

var slides = {};

function checkExistence($this, evt, button){
    let bool_exist = false;
    findAllSlides(function (response) {
        "use strict";
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

function doSliderUpdate($this){
    "use strict";
    debugger;
    var data = new FormData();
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

    let rdata = JSON.stringify(data);
    xhr.send(data);
}

$(`#slider_1_text_form, #slider_2_text_form, #slider_3_text_form, #slider_4_text_form`).submit(function(evt) {
    evt.preventDefault();
    debugger;
    let button = $('#'+evt.target.id).find($(`button[id^='slider-'][id$='-submit']`));
    sliderType = $(`form#${evt.target.id} :input[name ="sliderType"]`).val();

    if(button.text() === "Update"){
        doSliderUpdate($(this))
        button.html("Submit")
    }else {
        checkExistence($(this), evt, button);
    }
});
