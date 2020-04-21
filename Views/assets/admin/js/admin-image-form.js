//filter searches
var selText = "Title"
let searchInput = null;
let dateSearchInput = null
//insert a tag search
function insertText($this, ops){
    document.getElementById("search").value = $this.innerText.trim();

    let child = null
    if(ops === 'Title') {
        child = document.getElementById("dropdown").childNodes[1];
        selText = child.innerText;
        child.click();
    }else if(ops === 'Album name') {
        child = document.getElementById("dropdown").childNodes[3];
        selText = child.innerText;
        child.click();
    }else if(ops === 'Date Created') {
        child = document.getElementById("dropdown").childNodes[5];
        selText = child.innerText;
        child.click();
    }
    myFunction();
}
//datetime picker for searches
$('#datepicker').datepicker({
    uiLibrary: 'bootstrap4'
});
//select for searches
$(".dropdown-menu a").click(function(){
    selText = $(this).text();
    $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
    debugger;
    if(selText === "Date Created") {
        // input = document.getElementById("datepicker");
        searchInput = document.getElementById("search");
        dateSearchInput = document.createElement("input");
        dateSearchInput.setAttribute("id", "search");
        dateSearchInput.setAttribute("placeholder", "search by date");
        dateSearchInput.setAttribute("onchange", "myFunction()");
        $(dateSearchInput).datepicker({
            uiLibrary: 'bootstrap4'
        });

        searchInput.replaceWith(dateSearchInput);
        dateSearchInput.value = searchInput.value;
    }
    else if(selText === "Title") {
        if (dateSearchInput !== "") {
            dateSearchInput.replaceWith(searchInput);
            searchInput.value = dateSearchInput.value;
            dateSearchInput = "";
        }
    }
    else {
        if (dateSearchInput !== "") {
            dateSearchInput.replaceWith(searchInput);
            searchInput.value = dateSearchInput.value;
            dateSearchInput = "";
        }
    }

});
//do Actual filter search
function myFunction() {
    // Declare variables

    var input, filter, ul, li, i, txtValue;

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

//pull saved datas
jQuery(($) => {
    let uri = '/photoalbums/find';
    $.ajax({
        url: uri,
        dataType: "json",
        success: function(data) {
            var html = '';
            $.each(data, function(key, content) {
                let dateCreated = content.updatedAt;
                let dateCreatedModified = dateCreated.substring(5,7)+'/'+ dateCreated.substring(8,10)+'/'+ dateCreated.substring(0,4);
                html += '<li data-title="'+ content.title +'" data-album_name="'+ content.albums[0].u_name +'" data-date="'+ dateCreatedModified +'" class="card" style="background-color: #d9edf7; border-color: #bce8f1;">\n';
                html +='<div class="card-body panel-heading"><div class="row"><div class="col-lg-2"><a href="javascript:void(0)" data-toggle="modal" data-target="#largeModal">\n';
                html +='<img class="img-thumbnail img-fluid" style="cursor: pointer;" src="'+ content.img +'" alt="'+ content.imgName +'"></a>\n';
                html +='</div><div class="col-lg-10" style="padding-top: 10px;"><span>Title:<a  onclick="insertText(this, \'Title\')"> '+ content.title +'</a></span> &nbsp;\n';
                html +='<span>Album name:<a  href="javascript:void(0)" onclick="insertText(this, \'Album name\')"> '+ content.albums[0].u_name +'</a></span>&nbsp;';
                html +='<span>Date Created:<a  href="javascript:void(0)" onclick="insertText(this, \'Date Created\')"> '+ dateCreatedModified +'</a></span></div>\n';
                html +='<a class="edit" href="javascript:void(0)" onclick="onEditItem(\''+ content._id +'\')">Edit</a>\n';
                html +='<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></div></div>\n';
                html +='<!--=======================================/modal=============================-->\n';
                html +='<!-- large modal -->\n';
                html +='<div class="modal fade" id="largeModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">\n';
                html +='<div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header">\n';
                html +='<img src="'+ content.img +'" alt="'+ content.imgName +'" style="width:100%">\n';
                html +='<button type="button" onclick="onDeleteItem(\''+ content._id +'\')" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>\n';
                html +='</button></div></div></div></div></li>';
            })
            document.getElementById("draggablePanelList").innerHTML = html;
        }
    })
});

//form validation
function validateForm() {
    let title = document.forms["formId"]["title"].value;
    let album_name = document.forms["formId"]["album_name"].value;
    let album_title = document.forms["formId"]["album_title"].value;
    let fileInput = document.forms["formId"]["fileInput"];
    debugger;
    if(_id === null) {
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
$("#formId").submit(function (event) {
    if (validateForm() === false)
        return false;
    let title= document.getElementById('title').value;

    // let img= {data: blob};
    let albums = { u_name : document.getElementById('album_name').value, u_title : document.getElementById('album_title').value};
    event.preventDefault();

    let url = "/photoalbums/create";
    if (_id === null) {
        // $(this).ajaxSubmit({
        //     url: url,
        //     data: {
        //         title: title,
        //         albums: albums
        //     },
        //     contentType: 'application/json',
        //     success: function (response) {
        //         console.log('image uploaded and form submitted');
        //     }
        // });

        let settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "POST",
            data: {
                title: title,
                albums: albums
            },
        };

        $.ajax(settings).done(console.log('image uploaded and form submitted'));
    }else {

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
        };

        $.ajax(settings).done(console.log(response));

        _id = null;
        // document.getElementById('evalForm').innerText = "Submit Form"
    }
    return false;
});



//perform edit functions
function onEditItem(id){
    _id = id;
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/photoalbums/" + id,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "Postman-Token": "d8a72744-3f78-45eb-9967-05d281a007b9"
        }
    }

    $.ajax(settings).done(function (response) {
        debugger;
        document.getElementById('title').value = response.title;
        document.getElementById('album_name').value = response.albums[0].u_name;
        document.getElementById('album_title').value = response.albums[0].u_title;
        img = response.img;
        imgName = response.imgName;
    });
    document.getElementById('evalForm').innerText = "Update Form"
}

//perform delete functions

function onDeleteItem(id){
    _id = id;
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/photoalbums/" + id,
        "method": "DELETE",
        "headers": {
            "cache-control": "no-cache",
            "Postman-Token": "d8a72744-3f78-45eb-9967-05d281a007b9"
        }
    }

    $.ajax(settings).done(function (response) {
        alert(response);
    });
}
//================End perform submit, edit, update delete functions================
