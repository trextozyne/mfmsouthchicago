
$(document).ready(function(){
    let gallerySlideCounter = 0;
    let galleryDiv ='';
    let modalDiv ='';
    var photoAdd = '/photoalbums/find';

    function getPhoto() {

        // debugger;
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
    function AjaxSucceeded(result) {
        if(result.length === 0){
            galleryDiv += '<div style="text-align: center"><h1 class="mbr-section-title mbr-bold pb-3 mbr-fonts-style display-1">\n' +
                '                    No images in Database</h1></div>';

            document.querySelector("div.mbr-gallery-filter.container.gallery-filter-active").innerHTML = galleryDiv
            var divGalleryTarget = document.querySelector("div.mbr-gallery-layout-default").childNodes;//;
            var divModalTarget = document.querySelector("div.carousel-inner");
            divGalleryTarget[1].innerHTML = "";
            divModalTarget.innerHTML = "";
        }else {
            $.each(result, function (k, dbData) {
                debugger;
                //for gallery image
                galleryDiv += '<div class="mbr-gallery-item mbr-gallery-item--p2" data-video-url="false" data-tags="' + dbData.albums[0].u_name + '">';
                galleryDiv += '<div href="#lb-gallery2-2y" data-slide-to="' + gallerySlideCounter + '" data-toggle="modal">';
                // galleryDiv += '<img src="assets/images/gallery' +gallerySlideCounter + '.png" alt="mfm_gallery" title="'+ dbData.title +'"/>';
                galleryDiv += '<img src="assets/images/gallery/' + dbData.imgName + '" alt="mfm_gallery" title="' + dbData.title + '"/>';
                galleryDiv += '<span class="icon-focus"></span></div></div>';
                //for modal images
                if (gallerySlideCounter === 0)
                    modalDiv += '<div class="carousel-item active">';
                else
                    modalDiv += '<div class="carousel-item">';
                modalDiv += '<img src="assets/images/gallery/' + dbData.imgName + '" alt="mfm_gallery" title="' + dbData.title + '"/>';
                modalDiv += '</div>';

                /// do stuff
                // var h = '<li><img class="imageClass" src="' + url + arr[i] + '" /></li>';
                gallerySlideCounter++;
            });

            divGalleryTarget = document.querySelector("div.mbr-gallery-layout-default").childNodes;//;
            divModalTarget = document.querySelector("div.carousel-inner");
            divGalleryTarget[1].innerHTML = galleryDiv;
            divModalTarget.innerHTML = modalDiv;
        }
    }
    function AjaxFailed(result) {
        alert(result.statusText);
    }
    getPhoto();
});