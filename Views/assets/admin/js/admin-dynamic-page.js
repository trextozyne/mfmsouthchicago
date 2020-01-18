
// ====================================Date addon For Events========================================
//============================change part of the page dynamically==============================
let $thislink;
$(function(){
    $("li a[rel='tab']").click(function(e){
        debugger;
        e.preventDefault();
        let pageurl =  $(this).attr('href');
        pageNavigation(pageurl, $(this));
        // if( pageurl !== window.location.pathname ){
        //     window.history.pushState({path:pageurl},'',pageurl);
        // }
        return false;
    });

    function pageNavigation(pageurl, $this) {
        $.ajax({type: "GET", url:pageurl+'?rel=tab',success: function(data) {
                $('body').html(data);
                loadScript();

                prepare_isDeleteListCards();

            }
        });
        debugger;

        setTimeout(()=>{
            $this.trigger('click');
        }, 3000)
    }

});

// $(window).bind('popstate', function($this) {
//     let get = $this.type;
//     if($thislink === "")
//         $.ajax({url:location.pathname+'?rel=tab',success: function(data){
//                 $('.dashboard').html(data);
//             }
//         });
//     $thislink = '';
// });
//============================change part of the page dynamically==============================