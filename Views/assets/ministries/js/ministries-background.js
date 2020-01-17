$(document).ready(function(){
    let gallerySlideCounter = 0;
    let galleryDiv ='';
    let modalDiv ='';
    var photoAdd = '/photoalbums/find';

    function getPhoto() {

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
        let imgNames = [];
        $.each(result, function (k, dbData) {
            //for gallery image
            // galleryDiv += '<div class="mbr-gallery-item mbr-gallery-item--p2" data-video-url="false" data-tags="' + dbData.albums[0].u_name + '">';
            // galleryDiv += '<img src="assets/images/gallery/' + dbData+ '" alt="mfm_gallery" title="' + dbData.title + '"/>';
            // if(dbData.albums[0].u_name.toLowerCase() === "ministry")
            imgNames.push(dbData);
        });
        $(".grid li").each((i, li)=>{
            let bg = 'assets/images/gallery/' + imgNames[Math.floor(Math.random() * imgNames.length) + 1  ].imgName ;
            $(li).css('background-image', 'url('  + bg + ')');
            //change bg-image every 10 secs
            setInterval(()=>{
                let bg = 'assets/images/gallery/' + imgNames[Math.floor(Math.random() * imgNames.length) + 1  ].imgName ;
                $(li).css('background-image', 'url('  + bg + ')');
            }, 20000);
        });
    }
    function AjaxFailed(result) {
        alert(result.statusText);
    }
    getPhoto();
});