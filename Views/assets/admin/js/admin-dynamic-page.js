
// ====================================Date addon For Events========================================
//============================change part of the page dynamically==============================
let $thislink;
$(function(){
    $("li a[rel='tab']").click(function(e){
        e.preventDefault();
        pageurl =  $(this).attr('href');
        $.ajax({type: "GET", url:pageurl+'?rel=tab',success: function(data) {
                $('body').html(data);

                loadScript();

                prepare_isDeleteListCards();
            }});
        if( pageurl !== window.location.pathname ){
            // window.history.pushState({path:pageurl},'',pageurl);
        }
        return false;
    });
});

// $(window).bind('popstate', function($this) {
//     let get = $this.type;
//     if($thislink === "")
//         $.ajax({url:location.pathname+'?rel=tab',success: function(data){
//                 $('.ext-content').html(data);
//             }
//         });
//     $thislink = '';
// });
//============================change part of the page dynamically==============================