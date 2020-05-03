$(document).ready(()=>{
    debugger;
    var photoAdd = '/photoalbums/find';

    function getGalleryCount(AjaxSucceeded) {
        $.ajax({
            async: true,
            crossDomain: true,
            url: "/gallerycount/find",
            method: "GET",
            success: AjaxSucceeded,//callback,
            error: AjaxFailed
        })
    }

    function getPhoto(AjaxSucceeded) {
        $.ajax({
            // header: 'Access-Control-Allow-Origin: *',
            dataType: "json",
            url: photoAdd,
            contentType: 'application/json; charset=utf-8',
            async: false,
            // crossDomain: true,
            success: AjaxSucceeded,//callback,
            error: AjaxFailed
        });
    }

    function AjaxFailed(result) {
        alert(result.statusText);
    }

let imageDiv = "";
    let gallery = `
                <div class="church-gallery container">
                  <div class="synch-carousels">`;

//start here get callback
    getGalleryCount( function dataResponse(data) {
        debugger;
        //start final get callnbck
        getPhoto( function AjaxSucceeded(result) {
            if(result.length === 0){
                document.getElementById("churchEvent").innerHTML = `<h1 style="text-align: center">No Preview</h1>`;
            }else {
                $.each(result, function (k, dbData) {
                    if (data[0].quantity > k)
                        imageDiv += `
                        <div class="item">
                          <img src="${dbData.img}" alt="mfm_gallery" title="${dbData.title}"/>
                        </div>`;
                    else if (data === "" && k < 5)
                        imageDiv += `
                        <div class="item">
                          <img src="${dbData.img}" alt="mfm_gallery" title="${dbData.title}"/>
                        </div>`;
                });

                gallery+= `
            <div class="left child">
              <div class="gallery">` + imageDiv;

                gallery+= `          
              </div>
            </div>
            <div class="right child">
                  <div class="gallery2">` + imageDiv;

                gallery+= `   
                  </div>
                  <div class="nav-arrows">
                    <button class="arrow-left">
                      <!--SVGs from iconmonstr.com-->
                      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z"/></svg>
                    </button>
                    <button class="arrow-right">
                      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/></svg>
                      </button>
                  </div>
                  <div class="photos-counter">
                    <span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
          <p class="wrapper-see-all"><a class="see-all" href="images.html">See All</a></p>
                `;

                document.getElementById("churchEvent").innerHTML = gallery;
                startGalleryCarousel();
            }
        });
    })
});