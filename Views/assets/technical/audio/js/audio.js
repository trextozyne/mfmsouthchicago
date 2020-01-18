
    // <img src="../Views/
    let uri = '/tracks/find';
$.ajax({
    url: uri,
    dataType: "json",
    success: function (data) {
        debugger;
        let html = '<div class="container container-table">\n' +
            '      <h2 class="mbr-section-title mbr-fonts-style align-center pb-3 display-2">Sermon List</h2>\n' +
            '      \n' +
            '      <div class="table-wrapper">\n' +
            '        <div class="container">\n' +
            '          <div class="row search">\n' +
            '            <div class="col-md-6"></div>\n' +
            '            <div class="col-md-6">\n' +
            '                <div class="dataTables_filter">\n' +
            '                  <label class="searchInfo mbr-fonts-style display-7">Search:</label>\n' +
            '                  <input class="form-control input-sm" disabled="">\n' +
            '                </div>\n' +
            '            </div>\n' +
            '          </div>\n' +
            '        </div>\n' +
            '\n' +
            '        <div class="container scroll">\n' +
            '            <table class="table isSearch" cellspacing="0">\n' +
            '                <thead>\n' +
            '                <tr class="table-heads ">\n' +
            '                  <th class="head-item mbr-fonts-style display-7">Sermon</th>\n' +
            '                  <th class="head-item mbr-fonts-style display-7">Duration</th>\n' +
            '                  <th class="head-item mbr-fonts-style display-7">DATE</th>\n' +
            '                  <th class="head-item mbr-fonts-style display-7">SPEAKER</th>\n' +
            '                  <th class="head-item mbr-fonts-style display-7">PLAY</th>\n' +
            '                  <th class="head-item mbr-fonts-style display-7">DOWNLOAD</th></tr>' +
            '                </thead>\n' +
            '<tbody id="trackList">';
        data.forEach((data, k) => {
            console.log()
            // html = '<a  href="javascript:void(0)" onclick="_onClickItem(\''+ data._id +'\')">' + data.metadata.speaker+' - ' + data.filename + '(' +data.metadata.duration + 'hr) </a>' + ' - ' +
            //     '<a target="_blank"  href="/tracks/download/'+ data._id +'">Download</a>';
            html+='<tr>\n' +
                '                <td class="body-item mbr-fonts-style display-7">' + data.filename +'</td>\n' +
                '                <td class="body-item mbr-fonts-style display-7">' +data.metadata.duration +'</td>\n' +
                '                <td class="body-item mbr-fonts-style display-7">' +data.uploadDate  +'</td>\n' +
                '                <td class="body-item mbr-fonts-style display-7">' + data.metadata.speaker +'</td>'+
                '                <td class="body-item mbr-fonts-style display-7"><audio id="myAudio" controls>\n' +
                '                        <source src="/tracks/download/'+ data._id +'" type="audio/mp3">\n' +
                '                        Your browser does not support the audio element.\n' +
                '                    </audio></td>\n'+
                '                <td class="body-item mbr-fonts-style display-7">' +
                '<a target="_blank"  href="/tracks/download/'+ data._id +'">Download</a></td>' +
                '</tr>'
        });
        html += '</tbody>\n' +
            '            </table>\n' +
            '        </div>\n' +
            '        <div class="container table-info-container">\n' +
            '          <div class="row info">\n' +
            '            <div class="col-md-6">\n' +
            '              <div class="dataTables_info mbr-fonts-style display-7">\n' +
            '                <span class="infoBefore">Showing</span>\n' +
            '                <span class="inactive infoRows"></span>\n' +
            '                <span class="infoAfter">entries</span>\n' +
            '                <span class="infoFilteredBefore">(filtered from</span>\n' +
            '                <span class="inactive infoRows"></span>\n' +
            '                <span class="infoFilteredAfter"> total entries)</span>\n' +
            '              </div>\n' +
            '            </div>\n' +
            '            <div class="col-md-6"></div>\n' +
            '          </div>\n' +
            '        </div>\n' +
            '      </div>\n' +
            '    </div>';
        debugger;
        let referenceNode = document.getElementById("header1-1w");
        let htmlObject = document.createElement('section');
        htmlObject.setAttribute("id", "table1-2z");
        htmlObject.classList.add("section-table");
        htmlObject.classList.add("cid-rcUlCXyszu");
        htmlObject.innerHTML = html;
        insertAfter(htmlObject, referenceNode);
        html = "";

        dynamicallyLoadScript("assets/datatables/jquery.data-tables.min.js");
        dynamicallyLoadScript("assets/datatables/data-tables.bootstrap4.min.js");

        setTimeout(()=>{
            applyPagination();
        }, 1000);

    }
});

//=====================================Apply Pagination==============================
function applyPagination() {
    let htmlPagination = document.createElement('p');
    htmlPagination.setAttribute("id", "pagination-here");
    referenceNode = document.getElementById("DataTables_Table_0_wrapper");
    debugger;
    insertAfter(htmlPagination, referenceNode);

    htmlPagination = document.createElement('p');
    htmlPagination.setAttribute("id", "content");
    htmlPagination.innerText = "Page 1";
    referenceNode = document.getElementById("pagination-here");
    insertAfter(htmlPagination, referenceNode);

    //******************************************Pagination Area***********************************
    //========================apply pagination data attribute===============================

    let table = document.getElementById("DataTables_Table_0");
    let totalPageData = 5;
    let page = 1;
    for (let i = 1, row; row = table.rows[i]; i++) {//debugger;
        //iterate through rows  rows would be accessed using the "row" variable assigned in the for loop
        row.setAttribute('data-page', page);

        if(page > 1)
            row.setAttribute('hidden', "");
        if((totalPageData*page) % i === 0 && i !== 1)
            page++;

        // alert(i-1);
    }

    //============Apply booypagination jquery=================
    $("#pagination-here").bootpag({
        total: page,
        page: 1,
        maxVisible: 5,
        leaps: true,
        href: "#result-page-{{number}}",
    })

    //page click action
    $("#pagination-here").on("page", function(event, num){
        //show / hide content or pull via ajax etc
        $("#content").html("Page " + num);
    });
    //============Apply booypagination jquery=================

    //=======================onload go to page===============================
    let pageHash = window.location.hash.substr(1);
    if(pageHash)
        selectPageByData(pageHash.replace(/\D/g, ""), document.getElementById("DataTables_Table_0"));
    //=======================onload go to page===============================

    //=========lock all the click events for pagination in============
    let Items = document.querySelectorAll('#pagination-here > ul > li');
    for (i = 0; i < Items.length; i++) {
        Items[i].onclick = function() {
            selectPageByData(this.getAttribute('data-lp'), document.getElementById("DataTables_Table_0"));
        };
        //=========automate click event on load==============
        if(pageHash) Items[parseInt(pageHash.replace(/\D/g, ""))].click();
    }
    //=========lock all the click events for pagination in============
}
//========================select pagination by data attribute===============================
function selectPageByData(dataPage, table){debugger
    for (let i = 1, row; row = table.rows[i]; i++) {
        //iterate through rows  rows would be accessed using the "row" variable assigned in the for loop
        let dataPageTable = row.getAttribute('data-page');
        if(dataPage === dataPageTable)
            row.removeAttribute('hidden');
        else
            row.setAttribute('hidden', "");
    }
}
//========================select pagination by data attribute===============================
//********************************************Pagination Area**************************************************


function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function dynamicallyLoadScript(url) {
    let script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL

    document.body.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}


// function _onClickItem(trackId){
//     debugger
//     // document.getElementById("css").innerHTML =
//     // '<video controls="" autoplay="" name="media"><source src="/tracks/' + trackId + '" type="css/mp3"></video>';
//     let url = "/tracks/" + trackId;
//     // let video = document.getElementById("myVideo");
//     let css = document.getElementById("myAudio");
//     // video.setAttribute("src", url);
//     // video.load();
//     css.setAttribute("src", url);
//     css.load();
//     css.play();
// }
