document.addEventListener('paste', function(e){
    //debugger;
    if(e.target && (e.target.id === "playlistId" || e.target.id === "playlistName") && document.getElementsByName('live')[0].checked) {
        document.getElementsByClassName('saveYTPlaylistId')[0].disabled = false;
    } else {
        document.getElementsByClassName('saveYTPlaylistId')[0].disabled = true;
    }
});

document.addEventListener('click',function(e) {
    //debugger
    if (e.target && e.target.type === "checkbox" && e.target.getAttribute('name') === "live" && e.target.checked === true) {
        let parentElement = e.target.parentElement.parentElement;
        let inputs = parentElement.querySelectorAll("input");

        inputs[0].value = "Live";
        inputs[0].setAttribute("disabled","disabled");

        inputs[1].value ="";
        inputs[1].focus();
        document.getElementsByClassName('saveYTPlaylistId')[0].disabled = true;
    }else if (e.target && e.target.type === "checkbox" && e.target.getAttribute('name') === "live"){
        let parentElement = e.target.parentElement.parentElement;
        let inputs = parentElement.querySelectorAll("input");

        inputs[0].value = "";
        inputs[0].removeAttribute("disabled");
        inputs[0].focus();

        inputs[1].value ="";
    }
    if (e.target && e.target.classList.contains('fa')) {
        e.target.parentElement.click();
        e.stopPropagation();
        e.preventDefault();
    }
    if (e.target && e.target.classList.contains('saveYTPlaylistId')) {
        !document.getElementsByName('live')[0].checked ? addData(e.target) : saveLive(e.target);
    }
    if (e.target && e.target.classList.contains('editYTplaylist') && e.target.innerText !== "done") {
        e.target.innerText = "done";
        edit(e);
    } else if (e.target.innerText === "done" && e.target.tagName === "BUTTON") {
        e.target.innerHTML = `<i class="fa fa-pencil-square-o" aria-hidden="true"></i> `;

        save(e.target);
    }
    if (e.target && e.target.classList.contains('deleteYTplaylist')) {
        e.target.parentElement.parentElement.remove();
        deleteData(e.target.dataset.id);
    }
});

function deleteData(id) {
    if(document.getElementsByClassName("fixed_header")[0].rows.length === 1) {
        let tableRef = document.getElementsByClassName('fixed_header')[0].getElementsByTagName('tbody')[0];

        // Insert a row in the table at the last row
        let newRow   = tableRef.insertRow();
        newRow.setAttribute("id", "empty");

        // Insert a cell in the row at index 0
        let newCell  = newRow.insertCell(0);
        newCell.setAttribute("style", "    text-align: center; width: 785px;")

        // Append a text node to the cell
        let newText  = document.createTextNode('Table list is empty');
        newCell.appendChild(newText);
    }

    let url= `/ytplayList/${id}/delete`;

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "DELETE"
    };

    $.ajax(settings).done(console.log("Deleted!!!"));
}

function checkEmpty(){
    //debugger;
    if(document.getElementById("playlistId").value.length > 0 && document.getElementById("playlistName").value.length > 0) {
        document.getElementsByClassName('saveYTPlaylistId')[0].disabled = false;
    } else {
        document.getElementsByClassName('saveYTPlaylistId')[0].disabled = true;
    }
}

function addTableRow(inputData, ytPlaylistId) {
    let tableRef = document.getElementsByClassName('fixed_header')[0].getElementsByTagName('tbody')[0];

    if (document.getElementsByClassName("fixed_header")[0].rows[1].id === "empty") {
        tableRef.deleteRow(0);
    }

    // Insert a row in the table at the last row
    let newRow = tableRef.insertRow();

    inputData.forEach((input, i)=> {
        // Insert a cell in the row at index 0
        let newCell = newRow.insertCell(i);
        // newCell.setAttribute("style", "    text-align: center; width: 390px;")
        //create span element
        let span = document.createElement("span");

        // Append a text node to the span
        let newText = document.createTextNode(input.value||input);

        span.appendChild(newText);
        newCell.appendChild(span);
    });

    let tableElements = [
        `<button type="button" data-id = "${ytPlaylistId}" class="btn btn-default btn-sm editYTplaylist">
                                                    <i disabled class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                                </button>`,
        `<button type="button" data-id = "${ytPlaylistId}" class="btn btn-default btn-sm deleteYTplaylist">
                                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                                </button>`
    ];

    for (let i = 0; i < tableElements.length; i++) {
        // Insert a cell in the row at index 0
        let newCell = newRow.insertCell(2+i);
        // newCell.setAttribute("style", "    text-align: center; width: 390px;")

        // Append  edit and delete to the cell
        newCell.innerHTML = tableElements[i];
    }
}

(()=> {
    let url = '/ytplayList/find';
    let uri = '/ytplayLive/find';

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": url
    };

    let liveSettings = {
        "async": true,
        "crossDomain": true,
        "url": uri
    };

    let inputs = [];

    $.ajax(settings).done(
        (response) => {
            //debugger;
        response.forEach((ytPlaylist)=>{
            inputs.push(ytPlaylist.playlisttiltle);
            inputs.push(ytPlaylist.playlistid);

            let ytPlaylistId = ytPlaylist._id;

            addTableRow(inputs, ytPlaylistId);

            inputs.length = 0;
        });
    });

    $.ajax(liveSettings).done(
        (response) => {
            //debugger;
            document.getElementsByName("live")[0].setAttribute("data-id", response[0]._id);
        });
})();

function addData(btnElement) {
    //debugger;
    let parentElement = btnElement.parentElement;
    let inputs =  parentElement.querySelectorAll("input:not([type=checkbox])");

    let ytData = {
        playlisttiltle: inputs[0].value,
        playlistid: inputs[1].value
    };


    let url = "/ytplayList/create";
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "POST",
        data: ytData,
    };

    $.ajax(settings).done(
        (ytPlayslistId)=>{
            console.log('Saved!!!');

            addTableRow(inputs,ytPlayslistId);
        });
}

function saveLive(btnElement) {
    let parentElement = btnElement.parentElement;
    let inputs = parentElement.querySelectorAll("input");

    let ytData = {
        ytlivelink: inputs[1].value
    };
//debugger;
    if(!document.getElementsByName("live")[0].hasAttribute("data-id")) {
        let url = "/ytplayLive/create";
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "POST",
            data: ytData,
        };

        $.ajax(settings).done(
            (ytplayLiveId) => {

                console.log('Saved!!!');
                document.getElementsByName("live")[0].setAttribute("data-id", ytplayLiveId);

                toggleClasses();
                showModal();
                showModalChildren();
            });
    }else{
        let _id = document.getElementsByName("live")[0].getAttribute("data-id").trim();
        let url = "/ytplayLive/" + _id + "/update";

        let settings = {
            url: url,
            method: "PUT",
            data: ytData,
        };

        $.ajax(settings).done((response)=>{
            console.log(response);

            toggleClasses();
            showModal();
            showModalChildren();
        });
    }
    // alert("saved");

    inputs[0].removeAttribute("disabled");
    inputs[0].value = "";
    inputs[0].focus();
    btnElement.setAttribute("disabled", "disabled");

    inputs[1].value = "";

    document.getElementsByName("live")[0].checked = false;
}

function save(btnElement) {
    let parentElement = btnElement.parentElement.parentElement;
    let inputs = parentElement.querySelectorAll("input");
    //debugger;
    inputs.forEach((i) => {
        // Remove the input
        let parent = i.parentElement;
        parent.removeChild(i);

        // Update the span
        parent.querySelector("span").innerHTML = i.value === "" ? "&nbsp;" : i.value;

        // Show the span again
        parent.querySelector("span").style.display = "";
    });


    let spans = parentElement.querySelectorAll("span");

    let _id = btnElement.dataset.id;
    let ytData = {
        playlisttiltle: spans[0].textContent,
        playlistid: spans[1].textContent
    };

    let url = "/ytplayList/" + _id + "/update";

    let settings = {
        url: url,
        method: "PUT",
        data: ytData,
    };

    $.ajax(settings).done((response)=>{console.log(response)});
}

function edit(event) {
    //debugger;
    let element, spans, input, text;

    // Get the event (handle MS difference)
    event = event || window.event;

    // Get the root element of the event (handle MS difference)
    element = event.target || event.srcElement;

    let parentElement = element.parentElement.parentElement;
    if(parentElement.querySelectorAll("input").length === 0)
        spans = parentElement.querySelectorAll("span");

    spans.forEach((span)=> {
        // Hide it
        span.style.display = "none";

        // Get its text
        text = span.innerHTML;

        // Create an input
        input = document.createElement("input");
        input.type = "text";
        input.value = text;
        input.size = Math.max(text.length / 4 * 3, 4);
        span.parentNode.insertBefore(input, span);

        //  hook blur to undo
        //debugger;
        input.addEventListener("blur", blurEffect);
    })
}

function blurEffect(e) {
    //debugger;
    // Remove the input
    let parent = e.target.parentElement;
    parent.removeChild(e.target);

    // Update the span
    parent.querySelector("span").innerHTML = e.target.value === "" ? "&nbsp;" : e.target.value;

    // Show the span again
    parent.querySelector("span").style.display = "";
}