

//==================================pull saved image-gallery datas==========================================

jQuery(($) => {
    debugger;
    loadSavedData();
});

function loadSavedData () {
    let uri = '/photoalbums/find';
    $.ajax({
        url: uri,
        dataType: "json",
        success: function(data) {
            let html = '', html2='';
            let getModal = "";
            let getModalDialog, getModalContent, getModalHeader;

            let getModalHeaderCounter = document.querySelectorAll('*[id^="largeModal"]').length;
            $.each(data, function(key, content) {
                let dateCreated = content.updatedAt;
                let dateCreatedModified = dateCreated.substring(5,7)+'/'+ dateCreated.substring(8,10)+'/'+ dateCreated.substring(0,4);
                html += '<li data-title="'+ content.title +'" data-album_name="'+ content.albums[0].u_name +'" data-date="'+ dateCreatedModified +'" class="card" style="background-color: #d9edf7; border-color: #bce8f1;">\n';
                html +='<div class="card-body panel-heading"><div class="row"><div class="col-lg-2"><a href="javascript:void(0)" data-toggle="modal" data-target="#largeModal'+ getModalHeaderCounter +'">\n';
                html +='<img class="img-thumbnail img-fluid" style="cursor: pointer;" src="'+ content.img +'" alt="mfmsouth-image-gallery"></a>\n';
                html +='</div><div class="col-lg-10" style="padding-top: 10px;"><span>Title:<a  onclick="insertText(this, \'Title\')"> '+ content.title +'</a></span> &nbsp;\n';
                html +='<span>Album name:<a  href="javascript:void(0)" onclick="insertText(this, \'Album name\')"> '+ content.albums[0].u_name +'</a></span>&nbsp;';
                html +='<span>Date Created:<a  href="javascript:void(0)" onclick="insertText(this, \'Date Created\')"> '+ dateCreatedModified +'</a></span></div>\n';
                html +='<a class="edit" href="javascript:void(0)" onclick="onEditItem(\''+ content._id +'\')">Edit</a>\n';
                html +='<button type="button"onclick="onDeleteItem(\''+ content._id +'\')"  class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></div></div>\n';
                html +='<!--=======================================/modal=============================-->\n';
                html +='<!-- large modal -->\n';
                debugger;
                html2 += '<img src="' + content.img + '" alt="mfmsouth-church-events" style="width:100%">\n';
                html2 += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>\n';
                html2 += '</button>';

                getModal = document.createElement('div');
                getModal.id = "largeModal"+getModalHeaderCounter;
                getModal.className += "modal fade";
                getModal.setAttribute("tabindex", "-1");
                getModal.setAttribute("role", "dialog");
                getModal.setAttribute("aria-labelledby", "basicModal");
                getModal.setAttribute("aria-hidden", "true");

                getModalDialog = document.createElement('div');
                getModalDialog.className += "modal-dialog modal-lg";
                getModal.appendChild(getModalDialog);

                getModalContent = document.createElement('div');
                getModalContent.className += "modal-content";
                getModalDialog.appendChild(getModalContent);

                getModalHeader = document.createElement('div');
                getModalHeader.className += "modal-header";
                getModalContent.appendChild(getModalHeader);

                getModalHeader.innerHTML = html2;

                document.getElementsByTagName("body")[0].appendChild(getModal);
                getModalHeaderCounter += 1;
                html2 = "";
                html += "</li>";
            });
            debugger;
            document.getElementById("draggablePanelList").innerHTML = html;
        }
    })
};

//=======================================form validation================================================
function validateForm() {
    let title = document.forms["img_gallery_form"]["title"].value;
    let album_name = document.forms["img_gallery_form"]["album_name"].value;
    let album_title = document.forms["img_gallery_form"]["album_title"].value;
    let fileInput = document.forms["img_gallery_form"]["fileInput"];

    if (title === "") {
        alert("Please: Whats the name of this events i.e Holy Ghost crossover night");
        return false;
    }
    if (album_name === "") {
        alert("Please: give album a name");
        return false;
    }
    if (album_title === "") {
        alert("Please: Give album a tile");
        return false;
    }
    if(_id === null) {
        if (fileInput.files.length === 0) {
            alert("Please: Select an image to save");
            return false;
        }
    }
    return true;
}

//pass data to node
let myBlob=null;


$(document).on("click","button",function(evt) {//#sermon_submit
    if(this.id === "ImgForm_submit") {
        $("#img_gallery_form").submit(); //Trigger the Submit Here
    }
})
//================start perform submit, edit, update delete functions================
let _id = null, img = null, imgName = null;
//for save and update function
$("#img_gallery_form").submit(function (event) {
    debugger;
    if (validateForm() === false) {
        alert("the forms info is not valid");
        return false;
    }

    event.preventDefault();

    let fData = new FormData($('form#img_gallery_form')[0]);

    if (_id === null) {//save
        debugger;
        let url = "/photoalbums/create";

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                loadSavedData();

                toggleClasses();
                showModal();
                showModalChildren();
            }
        });

        xhr.open("POST", url);
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("postman-token", "fb4e4d0c-26b1-ef6c-3beb-5f791abc83b0");

        xhr.send(fData);
    }
    else {//update
        let url = "/photoalbums/"+ _id +"/update";

        fData.append("img",img);
        fData.append("imgName",imgName);

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                loadSavedData();

                toggleClasses();
                showModal();
                showModalChildren();
            }
        });

        xhr.open("PUT", url);
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("postman-token", "fb4e4d0c-26b1-ef6c-3beb-5f791abc83b0");

        xhr.send(fData);

        _id = null;
        // document.getElementById('ImgForm_submit').innerText = "Submit Form"
    }
    return false;
});



//perform edit functions
function onEditItem(id) {
    _id = id;
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "/photoalbums/" + _id,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "Postman-Token": "d8a72744-3f78-45eb-9967-05d281a007b9"
        }
    };

    $.ajax(settings).done(function (response) {
        document.getElementById('title').value = response.title;
        document.getElementById('album_name').value = response.albums[0].u_name;
        document.getElementById('album_title').value = response.albums[0].u_title;
        img = response.img;
        imgName = response.imgName;

        toggleClasses();
        showModal();
        showModalChildren();
    });
    document.getElementById('ImgForm_submit').innerText = "Update Form";
    $("a#nav-add-image-tab").click();
}

//perform delete functions

function onDeleteItem(id){debugger;
    _id = id;
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "/photoalbums/" + _id + "/delete",
        "method": "DELETE",
        "headers": {
            "cache-control": "no-cache",
            "Postman-Token": "d8a72744-3f78-45eb-9967-05d281a007b9"
        }
    };

    $.ajax(settings).done(function (response) {
        _id = "";
        // document.getElementById("ImgForm_submit").reset();
        alert(response);
        loadSavedData();

        toggleClasses();
        showModal();
        showModalChildren();
    });
}
//================End perform submit, edit, update delete functions================