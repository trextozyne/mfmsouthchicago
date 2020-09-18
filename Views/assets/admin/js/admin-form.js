//===============================Set Gallery Images====================================
var galleryCountId = "";

$(document).ready(function () {
    $.ajax({
        async: true,
        crossDomain: true,
        url: "/gallerycount/find",
        method: "GET"
    }).done(function (response) {
        if(response.length > 0) {
            console.log(response[0]._id);
            galleryCountId = response[0]._id;
        }else{
            setGalleryImages("", 25);
        }
    });
});

function setGalleryImages($this, quantity){
    debugger;
    $this.parentElement.parentElement.children[0].innerText = $this.innerText;
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

        toggleClasses();
        showModal();
        showModalChildren();
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
        //debugger;
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
    //debugger;

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
