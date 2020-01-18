$(document).ready(()=>{
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


    getGalleryCount( function dataResponse(data) {
        debugger;
        getPhoto( function AjaxSucceeded(result) {
            if(result.length === 0){
                document.getElementById("churchEvent").innerHTML = `<h1 style="text-align: center">No Preview</h1>`;
            }else {
                $.each(result, function (k, dbData) {
                    if (data[0].quantity > k)
                        imageDiv += `
                        <div class="item">
                          <img src="assets/images/gallery/${dbData.imgName}" alt="mfm_gallery" title="${dbData.title}"/>
                        </div>`;
                    else if (data === "" && k < 5)
                        imageDiv += `
                        <div class="item">
                          <img src="assets/images/gallery/${dbData.imgName}" alt="mfm_gallery" title="${dbData.title}"/>
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



    function startGalleryCarousel() {
        const $left = $(".left");
        const $gl = $(".gallery");
        const $gl2 = $(".gallery2");
        const $photosCounterFirstSpan = $(".photos-counter span:nth-child(1)");

        $gl2.on("init", (event, slick) => {
            $photosCounterFirstSpan.text(`${slick.currentSlide + 1}/`);
            $(".photos-counter span:nth-child(2)").text(slick.slideCount);
        });

        $gl.slick({
            rows: 0,
            slidesToShow: 2,
            arrows: false,
            draggable: false,
            useTransform: false,
            mobileFirst: true,
            autoplay: true,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 3 } },


                {
                    breakpoint: 1023,
                    settings: {
                        slidesToShow: 1,
                        vertical: true } }] });





        $gl2.slick({
            rows: 0,
            useTransform: false,
            prevArrow: ".arrow-left",
            nextArrow: ".arrow-right",
            fade: true,
            asNavFor: $gl });


        function handleCarouselsHeight() {
            if (window.matchMedia("(min-width: 1024px)").matches) {
                const gl2H = $(".gallery2").height();
                $left.css("height", gl2H);
            } else {
                $left.css("height", "auto");
            }
        }

        $(window).on("load", () => {
            handleCarouselsHeight();
        });

        $(window).on(
            "resize",
            _.debounce(() => {
                handleCarouselsHeight();
                /*You might need this code in your projects*/
                //$gl1.slick("resize");
                //$gl2.slick("resize");
            }, 200));


        $(".gallery .item").bind('DOMSubtreeModified', function (e) {
            setTimeout(() => {
                if (this.classList.contains("slick-slide") && this.classList.contains("slick-current") && this.classList.contains("slick-active"))
                    $(this).trigger("click");
            }, 1000);
        });

        $(".gallery .item").on("click", function () {
            const index = $(this).attr("data-slick-index");
            $gl2.slick("slickGoTo", index);
        });

        $gl2.on("afterChange", (event, slick, currentSlide) => {
            $photosCounterFirstSpan.text(`${slick.currentSlide + 1}/`);
        });


    }
});