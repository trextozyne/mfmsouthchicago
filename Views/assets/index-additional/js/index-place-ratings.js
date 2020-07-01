var reviewHtml = '<section id="churchTestimonials" class="carousel slide testimonials-slider cid-rgyVI6xnIk" id="testimonials-slider1-r">' +
    '<div class="container text-center"> <h2 class="pb-5 mbr-fonts-style display-2">WHAT OUR FANTASTIC MEMBERS SAY</h2>' +
    '<div class="carousel slide" data-ride="carousel" role="listbox"><div class="carousel-inner">';

function logPlaceDetails() {
    var service = new google.maps.places.PlacesService(document.getElementById('map'));
    service.getDetails({
        placeId: 'ChIJ88hDxaYoDogRCOp9ajOoifo',
        fields: ['reviews'],
    }, function (place, status) {
        // console.log('Place details:', place);
        $.each(place, function(key, data_content) {
            if(key === "reviews"){
                $.each(data_content, function(key, content) {
                    let userRating = parseInt(content.rating) * 20;
                    if (content.author_name.trim() !== 'Olo Ilo') {
                        reviewHtml += '<div class="carousel-item"><div class="user col-md-8"><div class="user_image"><img src="' + content.profile_photo_url + '"></div>\n';
                        reviewHtml += '<div class="user_text pb-3"><p class="mbr-fonts-style display-7">' + content.text + '</p>\n';
                        reviewHtml += '</div><div class="user_name mbr-bold pb-2 mbr-fonts-style display-7">';
                        reviewHtml += '<a target="_blank" href="' + content.author_url + '" class="user_name mbr-bold pb-2 mbr-fonts-style display-7">' + content.author_name + '</a> - ' + content.relative_time_description + '</div>';
                        reviewHtml += '<div class="user_star mbr-light mbr-fonts-style display-7">';
                        reviewHtml += '<div class="star-ratings-sprite"><span style="width:' + userRating + '%" class="star-ratings-sprite-rating"></span></div></div></div></div>';
                    }
                })
            }
        });

        reviewHtml+= "<div class=\"carousel-controls\"><a class=\"carousel-control-prev\" role=\"button\" data-slide=\"prev\">\n" +
            "<span aria-hidden=\"true\" class=\"mbri-arrow-prev mbr-iconfont\"></span><span class=\"sr-only\">Previous</span></a>\n" +
            "<a class=\"carousel-control-next\" role=\"button\" data-slide=\"next\"><span aria-hidden=\"true\" class=\"mbri-arrow-next mbr-iconfont\"></span>\n" +
            "<span class=\"sr-only\">Next</span></a></div></div></div></section>";

        $(reviewHtml).insertAfter("#churchEvents");
        //debugger;
        dynamicallyLoadScript("assets/mbr-testimonials-slider/mbr-testimonials-slider.js")
    });
}