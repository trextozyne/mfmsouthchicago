
//==========Begin With Animation On-Load=================
// $(".slide-1 h2, .slide-1 h4").css("transform", "translateY(100px)").css("opacity", 0);
// $(".slide-1 h2 span").css("padding", 0);
// $(".slide-1 .number-pagination, .slide-1 .date-pagination").css("transform", "translateX(-100px) rotate(-90deg)").css("opacity", 0);
// $(".slide-1 img").css("transform", "translateY(100px)").css("opacity", 0);
// $(".slide-1 img:nth-child(1)").css("transform", "translateY(-100px)").css("opacity", 0);
//
// setTimeout(function(){
//     $(".slide-1 h2, .slide-1 h4").addClass("animate-1");
//     $(".slide-1 h2 span").addClass("animate-2");
//     $(".slide-1 .number-pagination, .slide-1 .date-pagination").addClass("animate-3");
//     $(".slide-1 img").addClass("animate-4");
//     $(".slide-1 img:nth-child(1)").addClass("animate-4");
// }, 400);
// setTimeout(function(){
//     $(".slide-1 h2, .slide-1 h4").removeClass("animate-1").removeAttr("style");
//     $(".slide-1 h2 span").removeClass("animate-2").removeAttr("style");
//     $(".slide-1 .number-pagination, .slide-1 .date-pagination").removeClass("animate-3").removeAttr("style");
//     $(".slide-1 img").removeClass("animate-4").removeAttr("style");
//     $(".slide-1 img:nth-child(1)").removeClass("animate-4").removeAttr("style");
// }, 5600);
//==========End of Begin With Animation On Load=============


var TIMEOUT = 6000;

var $radios;var $activeRadio;var currentIndex;
var radiosLength;

var interval = setInterval(handleNext, TIMEOUT);

function handleNext() {
    $radios = $('input[class*="slide-radio"]');
    $activeRadio = $('input[class*="slide-radio"]:checked');

    currentIndex = $activeRadio.index();
    radiosLength = $radios.length;

    $radios
        .attr('checked', false);


    if (currentIndex >= radiosLength - 1) {

        $radios
            .first()
            .click();

    } else {

        $activeRadio
            .next('input[class*="slide-radio"]')
            .click();

    }

}

function myStopFunction() {
    clearInterval(interval);
}

$(document).on('mouseenter','.slider', function (event) {
    myStopFunction()
}).on('mouseleave','.slider',  function(){
    interval = setInterval(handleNext, TIMEOUT);
});