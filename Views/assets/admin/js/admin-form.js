//===============================Set Gallery Images====================================
var galleryCountId = "";

$(document).ready(function () {
    $.ajax({
        async: true,
        crossDomain: true,
        url: "/gallerycount/find",
        method: "GET"
    }).done(function (response) {
        console.log(response[0]._id);
        galleryCountId = response[0]._id;
    });
});

function setGalleryImages($this, quantity){debugger;
    let url ="";
    let method ="";

    if(!galleryCountId) {
        url = "/gallerycount/create";
        method = "POST";
    }else {
        url = "/gallerycount/" + galleryCountId + "/update";
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
        data : {quantity: parseInt(quantity)}
    }).done(function (response) {
        if (!galleryCountId) galleryCountId = response;
        alert("Saved");
    }).fail(function(data){
        // alert("it must be an image");
    });
}
//================================End Set Gallery Images===================================
//================================filter searches===================================
let selText = "Title";
let searchInput = "";
let dateSearchInput = "";
//insert a tag search when you click text
function insertText($this, ops){

    // let uniqueSearchInput = document.getElementById("search");
    // let elAncestors = [];
    // while (uniqueSearchInput) {
    //     elAncestors.unshift(uniqueSearchInput);
    //     uniqueSearchInput = uniqueSearchInput.parentNode;
    // }
    if ($($this).parents('ul').hasClass('img-gallery-list')) {
        document.getElementById("search").value = $this.innerText.trim();
        debugger;
        let child = null;
        if (ops === 'Title') {
            child = document.getElementById("img_gallery_dropdown").childNodes[1];
            selText = child.innerText;
            child.click();
        } else if (ops === 'Album name') {
            child = document.getElementById("img_gallery_dropdown").childNodes[3];
            selText = child.innerText;
            child.click();
        } else if (ops === 'Date Created') {
            child = document.getElementById("img_gallery_dropdown").childNodes[5];
            selText = child.innerText;
            child.click();
        }
        doImageFiltering();
    } else if ($($this).parents('ul').hasClass('event-list')) {//for events
        document.getElementById("event_search").value = $this.innerText.trim();
        let child = null;
        if (ops === 'Name') {
            child = document.getElementById("event_dropdown").childNodes[1];
            selText = child.innerText;
            child.click();
        } else if (ops === 'Start Date') {
            child = document.getElementById("event_dropdown").childNodes[3];
            selText = child.innerText;
            child.click();
        } else if (ops === 'End Date') {
            child = document.getElementById("event_dropdown").childNodes[5];
            selText = child.innerText;
            child.click();
        }
        doEventFiltering();
    }
}
//==================================datetime picker for searches=========================================
$('#datepicker').datepicker({
    uiLibrary: 'bootstrap4'
});
//=======================================actual user select for searches========================================
var $dropdown_this = "";//do determine if this dropdown is for the image or the events
$(".dropdown-menu a").click(function(){
    debugger;

       if ($dropdown_this !== "") {
           g1 = $dropdown_this.parent().parent().parent().parent().attr('id');
           g2 = $(this).parent().parent().parent().parent().attr('id');

           if (g1 !== g2) {
               searchInput = "";
               dateSearchInput = "";
           }
       }

    $dropdown_this = $(this);


    selText = $(this).text();
    // let specific_searchInput = null;
    if($(this).parents('div#img-gallery-search_area').length) {
        $(this).parents('#img-gallery-search_area').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
    }
    if($(this).parents('div#event-search_area').length) {
        $(this).parents('div#event-search_area').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
    }
    if(selText === "Date Created" || selText === "Start Date" || selText === "End Date") {
        // input = document.getElementById("datepicker");
        if (searchInput === "") {

            dateSearchInput = document.createElement("input");

            if($(this).parents('div#img-gallery-search_area').length) {
                searchInput = document.getElementById("search");

                dateSearchInput.setAttribute("id", "search");
                dateSearchInput.setAttribute("placeholder", "search by date");
                dateSearchInput.setAttribute("onchange", "doImageFiltering()");
            }
            if($(this).parents('div#event-search_area').length){
                searchInput = document.getElementById("event_search");

                dateSearchInput.setAttribute("id", "event_search");
                dateSearchInput.setAttribute("placeholder", "search by date");
                dateSearchInput.setAttribute("onchange", "doEventFiltering()");
            }

            $(dateSearchInput).datepicker({
                uiLibrary: 'bootstrap4'
            });

            searchInput.replaceWith(dateSearchInput);
            dateSearchInput.value = searchInput.value;
        }
    }
    else if(selText === "Title" || selText === "Name") {
        if (dateSearchInput !== "") {
            if (selText === "Name")
                searchInput.setAttribute("placeholder", "search by name");
            else searchInput.setAttribute("placeholder", "search by title");

            dateSearchInput.replaceWith(searchInput);
            searchInput.value = dateSearchInput.value;
            dateSearchInput = "";
            searchInput = "";
        } else
            document.getElementById("search").setAttribute("placeholder", "search by title");
    }
    else if(selText === "Album name") {
        if (dateSearchInput !== "") {
            searchInput.setAttribute("placeholder", "search by album name");

            dateSearchInput.replaceWith(searchInput);
            searchInput.value = dateSearchInput.value;
            dateSearchInput = "";
            searchInput = "";
        } else
            document.getElementById("search").setAttribute("placeholder", "search by album name");
    }

});
//============================================do Actual filter search==================================================
function  doEventFiltering() {
    if(selText === "Title") selText = "Name";

    // Declare variables
    let input, filter, ul, li, i, txtValue;

    input = document.getElementById("event_search");

    filter = input.value.toUpperCase();
    ul = document.getElementById("draggablePanelList1");
    // tr = table.getElementsByTagName("tr");
    let attribute = 'data-event_name';

    if(selText === "Name") {
        li = ul.querySelectorAll('[data-event_name]');
        attribute = 'data-event_name';
    }
    else if(selText === "Start Date"){
        li = ul.querySelectorAll('[data-start_date]');
        attribute = 'data-start_date';
    }
    else{
        li = ul.querySelectorAll('[data-end_date]');
        attribute = 'data-end_date';
    }

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        // td = tr[i].getElementsByTagName("td")[0];
        if (li) {
            txtValue = li[i].getAttribute(attribute);
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }
}

function doImageFiltering() {
    if(selText === "Name") selText = "Title";

    // Declare variables
    let input, filter, ul, li, i, txtValue;

    input = document.getElementById("search");

    filter = input.value.toUpperCase();
    ul = document.getElementById("draggablePanelList");
    // tr = table.getElementsByTagName("tr");
    let attribute = 'data-title';

    if(selText === "Title") {
        li = ul.querySelectorAll('[data-title]');
        attribute = 'data-title';
    }
    else if(selText === "Album name"){
        li = ul.querySelectorAll('[data-album_name]');
        attribute = 'data-album_name';
    }
    else{
        li = ul.querySelectorAll('[data-date]');
        attribute = 'data-date';
    }

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        // td = tr[i].getElementsByTagName("td")[0];
        if (li) {
            txtValue = li[i].getAttribute(attribute);
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }
}

//==================================pull saved image-gallery datas==========================================
jQuery(($) => {
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
                html +='<img class="img-thumbnail img-fluid" style="cursor: pointer;" src="../../assets/images/gallery/'+ content.imgName +'" alt="mfmsouth-image-gallery"></a>\n';
                html +='</div><div class="col-lg-10" style="padding-top: 10px;"><span>Title:<a  onclick="insertText(this, \'Title\')"> '+ content.title +'</a></span> &nbsp;\n';
                html +='<span>Album name:<a  href="javascript:void(0)" onclick="insertText(this, \'Album name\')"> '+ content.albums[0].u_name +'</a></span>&nbsp;';
                html +='<span>Date Created:<a  href="javascript:void(0)" onclick="insertText(this, \'Date Created\')"> '+ dateCreatedModified +'</a></span></div>\n';
                html +='<a class="edit" href="javascript:void(0)" onclick="onEditItem(\''+ content._id +'\')">Edit</a>\n';
                html +='<button type="button"onclick="onDeleteItem(\''+ content._id +'\')"  class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></div></div>\n';
                html +='<!--=======================================/modal=============================-->\n';
                html +='<!-- large modal -->\n';
                debugger;
                html2 += '<img src="../../assets/images/gallery/' + content.imgName + '" alt="mfmsouth-church-events" style="width:100%">\n';
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
});

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

//================start perform submit, edit, update delete functions================
let _id = null, img = null, imgName = null;
//for save and update function
$("#img_gallery_form").submit(function (event) {
    debugger
    if (validateForm() === false) {
        alert("the forms info is not valid");
        return false;
    }

    let title= document.getElementById('title').value;
    let albums = { u_name : document.getElementById('album_name').value, u_title : document.getElementById('album_title').value};
    event.preventDefault();
    if (_id === null)//save
        $(this).ajaxSubmit({
            url: "/photoalbums/create",
            data: {
                title: title,
                albums: albums
            },
            contentType: 'application/json',
            success: function(response){
                console.log('image uploaded and form submitted');
            }
        });
    else {//update

        let title = document.getElementById('title').value;
        let albums_name = document.getElementById('album_name').value;
        let album_title = document.getElementById('album_title').value;

        let data = {
            "title": title,
            "img": img.toString(),
            "imgName": imgName,
            "albums": [
                {
                    "u_name": albums_name,
                    "u_title": album_title
                }
            ]
        };
        console.log(data);

        let settings = {
            url: "/photoalbums/"+ _id +"/update",
            method: "PUT",
            data: data,
            contentType: 'application/json',
            success: function(response){
                console.log(response);
            }
        };

        $(this).ajaxSubmit(
            settings
        );

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
    });
    document.getElementById('ImgForm_submit').innerText = "Update Form"
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
    });
}
//================End perform submit, edit, update delete functions================
