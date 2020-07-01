
// ====================================Date addon For Events========================================
//============================change part of the page dynamically==============================
let $thislink;
$(function(){
    $("li a[rel='tab']").click(function(e){
        e.preventDefault();

        debugger;
        let pageurl =  $(this).attr('href');

        let data = pageurl,
            url = data;
        changeHistory(url);

        if(pageurl === "admin" && (localStorage.getItem("admin-clicked") === "false" || localStorage.getItem("admin-clicked") === null)) {
            $('body').html(localStorage.getItem("admin"));

            let script = document.getElementsByTagName('script');
            for (let i = 0; i < script.length; i++) {
                if (script[i].getAttribute('src') !== null) {
                    if (script[i].getAttribute('src').includes("gijgo")) {

                        let newSrc = script[i].src + '?v='
                            + (new Date()).getTime();
                        console.log(newSrc)
                        script[i].setAttribute('src', newSrc);

                        $("#start_date").datepicker('destroy');
                        $("#end_date").datepicker('destroy');
                        $("#start_time").timepicker('destroy');
                        $("#end_time").timepicker('destroy');

                        loadDateTimePicker();
                    } else {
                        if (script[i].getAttribute('src').includes("?")) {
                            let src = script[i].getAttribute('src').split('?')[0];
                            let newSrc = src + '?v='
                                + (new Date()).getTime();
                            console.log(newSrc);
                            script[i].setAttribute('src', newSrc);
                        } else {
                            let newSrc = script[i].src + '?v='
                                + (new Date()).getTime();
                            script[i].setAttribute('src', newSrc);
                        }
                    }
                }
            }

        }else if(pageurl === "add-roles" && (localStorage.getItem("roles-clicked") === "false" || localStorage.getItem("roles-clicked") === null)) {

            let data = pageurl,
                url = data;
            changeHistory(url);

            if(localStorage.getItem("add-roles") === null) {
                pageurl = "/dashboard/users.html";
                pageNavigation(pageurl, $(this));
            }else {
                $('body').html(localStorage.getItem("add-roles"));

                let script = document.getElementsByTagName('script');
                for (let i = 0; i < script.length; i++) {
                    if (script[i].getAttribute('src') !== null) {
                        if (script[i].getAttribute('src').includes("?")) {
                            let src = script[i].getAttribute('src').split('?')[0];
                            let newSrc = src + '?v='
                                + (new Date()).getTime();
                            console.log(newSrc);
                            script[i].setAttribute('src', newSrc);
                        } else {
                            let newSrc = script[i].src + '?v='
                                + (new Date()).getTime();
                            script[i].setAttribute('src', newSrc);
                        }
                    }
                }
            }
        }

        // e.stopPropagation();
        return false;
    });

    function pageNavigation(pageurl, $this) {
        debugger;
        $.ajax({type: "GET",
            url:pageurl+'?rel=tab',
            dataType: 'text',
            success: function(data) {
                // location.hash = '#';
                $('body').html(data);
            }
        });
    }

    let aRel= document.querySelector("a[rel='tab'][href*='admin']");
    let aRel2= document.querySelector("a[rel='tab'][href*='add-roles']");
// console.log(aRel.classList)
    function changeHistory(url) {
        history.pushState(null, null, url);
    }

    aRel.addEventListener("click", (e)=> {
        if (localStorage.getItem("admin-clicked") === "false" || localStorage.getItem("admin-clicked") === null) {
            localStorage.setItem("admin-clicked", "true");
            localStorage.setItem("roles-clicked", "false");
        }
    });

    aRel2.addEventListener("click", (e)=> {
        if (localStorage.getItem("roles-clicked") === "false" || localStorage.getItem("roles-clicked") === null) {
            localStorage.setItem("roles-clicked", "true");
            localStorage.setItem("admin-clicked", "false");
        }
    });

//     let get = $this.type;
});

// $(window).bind('popstate', function($this) {
//     if($thislink === "")
//         $.ajax({url:location.pathname+'?rel=tab',success: function(data){
//                 $('.dashboard').html(data);
//             }
//         });
//     $thislink = '';
// });
//============================change part of the page dynamically==============================

//================start perform submit, edit, update delete functions================
// ====================================Date addon For Events========================================
