$(document).ready(function(){

    let media_screen4 = window.matchMedia("(max-width: 1360px)");
    let media_screen3 = window.matchMedia("(max-width: 545px");
    let media_screen2 = window.matchMedia("(max-width: 480px");
    let media_screen = window.matchMedia("(max-width: 360px");

    let mouseleave = true;
    $("body").on('mouseleave', '[id^="tile"]', function(){

        mouseleave = true;
    });


    $(document).on( 'mouseover ','.wrapper', function(){
    // $('.wrapper').on('hover', function(){

        if(mouseleave === false)
            return

        mouseleave = false;

        var parentId = $(this).parent().attr("id");

        $('#'+ parentId).addClass('animate');
        $('#'+ parentId +' div.settings-form').css('display', 'block').delay('40').animate({'opacity': 1});

        setTimeout(function(){
            $('#'+ parentId +' form div').css('display', 'block').animate({'opacity': 1, 'top':0}, 200);
        }, 40);

        if (media_screen.matches) {
            setTimeout(function(){
                $('#'+ parentId +' form .descr').css({'display': 'block' ,'height' : '115px'}).animate({'opacity': 1, 'top':0}, 158);
            }, 40);
        } else if (media_screen2.matches) { // If media query matches
                setTimeout(function(){
                    $('#'+ parentId +' form .descr').css({'display': 'block' ,'height' : '130px'}).animate({'opacity': 1, 'top':0}, 200);
                }, 40);
        }  else if (media_screen3.matches) { // If media query matches
            setTimeout(function(){
                $('#'+ parentId +' form .descr').css({'display': 'block' ,'height' : '130px'}).animate({'opacity': 1, 'top':0}, 200);
            }, 40);
        }  else if (media_screen4.matches) { // If media query matches
            setTimeout(function(){
                $('#'+ parentId +' form .descr').css({'display': 'block' ,'height' : '158px'}).animate({'opacity': 1, 'top':0}, 200);
            }, 40);
        } else {
            setTimeout(function(){
                $('#'+ parentId +' form .descr').css({'display': 'block' ,'height' : '232px'}).animate({'opacity': 1, 'top':0}, 158);
            }, 40);
        }


        setTimeout(function(){
            $('#'+ parentId +' form .short').css({'display': 'block' ,'width' : '50%'}).animate({'opacity': 1, 'top':0}, 200);
        }, 40);

        setTimeout(function(){
            $('#'+ parentId +' form button').css('display', 'block').animate({'opacity': 1, 'top':0}, 200);
            $('#'+ parentId +' .cx, #'+ parentId +' .cy').addClass('s1');
            setTimeout(function(){$('#'+ parentId +' .cx, #'+ parentId +' .cy').addClass('s2');}, 100);
            setTimeout(function(){$('#'+ parentId +' .cx, #'+ parentId +' .cy').addClass('s3');}, 200);
        }, 100);

    });


    // $('.close').click(function(){
    $("body").on('click', '.close', function(){
        let id = $(this).parents('[id^="tile"]').attr("id");;

        $('#'+ id +' .cx, #'+ id +' .cy').removeClass('s1 s2 s3');

        $('#'+ id +' form button').animate({'opacity': 0, 'top':-20}, 120, function(){$(this).css('display', 'none')});
        setTimeout(function(){
            $('#'+ id +' form div').animate({'opacity': 0, 'top':-20}, 120, function(){
                $(this).css('display', 'none')
            });
            $('#'+ id +' div.settings-form').animate({'opacity':0}, 120, function(){$(this).hide();});

            $('#'+ id).removeClass('animate');
        }, 50);

    });


    var flipCard = $("#make-3D .tile");

    $("#make-3D .settings").click(function(){

        $(flipCard).addClass('flip-10');
        setTimeout(function(){
            $(flipCard).removeClass('flip-10').addClass('flip90');
        }, 50);

        setTimeout(function(){
            $(flipCard).removeClass('flip90').addClass('flip190');
            $('#front').hide();	$('#back').show();
            setTimeout(function(){
                $(flipCard).removeClass('flip190').addClass('flip180');
                $('#back .cx, #back .cy').addClass('s1');
                setTimeout(function(){$('#back .cx, #back .cy').addClass('s2');}, 80);
                setTimeout(function(){$('#back .cx, #back .cy').addClass('s3');}, 150);
                setTimeout(function(){
                    $(flipCard).css('transition', '100ms ease-out');
                }, 100);
            }, 100);
        }, 150);
    });

    $('#back .close').click(function(){

        $('#back .cx, #back .cy').removeClass('s1 s2 s3');
        $(flipCard).removeClass('flip180').addClass('flip190');

        setTimeout(function(){
            $(flipCard).removeClass('flip190').addClass('flip90');
        }, 50);

        setTimeout(function(){
            $('#front').show();	$('#back').hide();
            $(flipCard).removeClass('flip90').addClass('flip-10');

            setTimeout(function(){
                $(flipCard).removeClass('flip-10').css('transition', '100ms ease-out');
            }, 100);
        }, 150);

    });

    $('button').click(function(){return false;});

});