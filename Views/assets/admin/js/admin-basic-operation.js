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
});



$(document).on("click","button",function(evt) {//#sermon_submit

    evt.preventDefault();

    if(this.id === "sermonFile_submit") {
        $("#sermonFile_form").submit(); //Trigger the Submit Here
    }
    if(this.id === "audio_submit") {
        $("#audio_form").submit(); //Trigger the Submit Here
    }
    if(this.id === "verse_submit") {
        $("#verse_form").submit(); //Trigger the Submit Here
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

            toggleClasses();
            showModal();
            showModalChildren();
        }).fail(function (data) {
            // alert("it must be an image");
        });

    }
});


$("#sermonFile_form").submit(function(evt) {
    evt.preventDefault();
    let url = "/files/create";

    let $form = $("#sermonFile_form");

    let data = new FormData($form[0]);
    //debugger;
    if ($form[0]["filename"].value === null || $form[0]["filename"].value === "", $form[0]["pdfFile"].files.length === 0) {
        alert("Please Fill All Required Field");
        return false;
    }else {
        // let formData = JSON.parse(JSON.stringify(getFormData($form)));
        // delete formData.sermonFile;
        data.append("pdfFile", $form[0]["pdfFile"].files[0]);

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);

                toggleClasses();
                showModal();
                showModalChildren();
            }
        });

        xhr.open("POST", url);
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("postman-token", "fb4e4d0c-26b1-ef6c-3beb-5f791abc83b0");

        xhr.send(data);
    }
});
// ###########################find#########################################
let boolDataExist = false;
$.ajax({
    url: '/files/find',
    dataType: "json",
    success: function (data) {
        let html = "<table class=\"fixed_header\">\n" +
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

    evt.preventDefault();
    let url= "/tracks/create";
    //debugger;

    let $form = $("#audio_form");

    let data = new FormData($form[0]);

    if ($form[0]["speaker"].value === null || $form[0]["speaker"].value === "", $form[0]["name"].value === null || $form[0]["name"].value === "" ||
            $form[0]["track"].files.length === 0 || $form[0]["duration"].value === null || $form[0]["duration"].value === "") {
        alert("Please Fill All Required Field");
        return false;
    }else {
        // let formData = JSON.parse(JSON.stringify(getFormData($form)));
        // delete formData.sermonAudio;

        data.append("track", $form[0]["track"].files[0]);

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);

                toggleClasses();
                showModal();
                showModalChildren();
            }
        });

        xhr.open("POST", url);
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("postman-token", "fb4e4d0c-26b1-ef6c-3beb-5f791abc83b0");

        xhr.send(data);
    }
});
// ############################find########################################

$.ajax({
    url: '/tracks/find',
    dataType: "json",
    success: function (data) {
        let html =
            "  <p style=\"text-align: center;\">Statement Summary</p>\n" +
            "<table class=\"fixed_header\">\n" +
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
                '<a  href="javascript:void(0)" onclick="_onClickItem(\''+ data._id +'\')">' + data.metadata.speaker+' - ' + data.filename + '(' +data.metadata.duration + 'minutes) </a>' +
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
    //debugger;
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

            toggleClasses();
            showModal();
            showModalChildren();
        }
    });

    xhr.open("DELETE", url);
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("postman-token", "d6b19a54-d39e-bddd-1f61-985eb1f312c9");

    xhr.send(data);
}

