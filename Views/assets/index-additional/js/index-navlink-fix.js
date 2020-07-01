var parentLi = null;
function hasClass(el, clss) {
    return el.className && new RegExp("(^|\\s)" +
        clss + "(\\s|$)").test(el.className);
}

$('li.nav-item a').on('click', function (event) {
    parentLi = $(this).parent();
    $(this).parent().toggleClass('open');
});
$('body').on('click', function (e) {
    if (!$('li.nav-item').is(e.target) && !hasClass(e.target, "slide-radio1") && !hasClass(e.target, "slide-radio2")
        && !hasClass(e.target, "slide-radio3") && !hasClass(e.target, "slide-radio4") &&
        !e.target.matches(".item.slick-slide.slick-current.slick-active") //.classList.contains()
        && $('li.nav-item').has(e.target).length === 0
        && $('.open').has(e.target).length === 0
    ) {
        $('li.nav-item').removeClass('open');
    }else {
        e.stopPropagation()
    }
});

let toggle = false;
let hambugerBtn = document.getElementsByClassName("navbar-toggler")[0];
hambugerBtn.addEventListener("click", (event)=>{
    //debugger;
    if(toggle === false){
        hambugerBtn.classList.remove("collapsed");
        hambugerBtn.parentElement.children[2].classList.add("show");
    }
    else if(toggle === true){
        hambugerBtn.classList.add("collapsed");
        hambugerBtn.parentElement.children[2].classList.remove("show");
    }
    toggle = !toggle;
});

$(window).on("load", () => {
    setTimeout(() => {
        $(".loading").fadeOut();
        $("body").addClass("over-visible");
    }, 2000);
});
