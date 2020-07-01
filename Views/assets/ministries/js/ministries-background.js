$(document).ready(function(){
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
            imgNames.push(dbData);
        });
        //debugger;
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