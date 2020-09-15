

//perform file input functions
function bs_input_file() {
    $(".input-file").before(
        function() {
            let $this = $(this);
            if ( ! $(this).prev().hasClass('input-ghost') ) {
                if(window.File && window.FileList && window.FileReader) {
                    let element = $this.find('.input-ghost');

                    element.attr("name", $(this).attr("name"));
                    element.change(function (event) {
                        let name = $(this).attr("name");
                        let output = null;
                        let files = event.target.files; //FileList object
                        if(name === "eventFileInput")
                            output = document.getElementById('eventResult');
                        else if(name === "pdfFile")
                            output = document.getElementById('sermonFileResult');
                        else if(name === "track")
                            output = document.getElementById('sermonResult');
                        else
                            output = document.getElementById('result');

                        if(event.target.hasAttribute("multiple")) {
                            if (parseInt(files.length) > 20){
                                alert("You can only upload a maximum of 20 files");
                                return;
                            }
                        }

                        for(let i = 0; i< files.length; i++)
                        {
                            let file = files[i];
                            //Only pics
                            if(file.type.match('image')) {
                                // if (!file.type.match('image')) {
                                //     alert("Please: only Pictures/Images")
                                //     continue;
                                // }
                                let picReader = new FileReader();

                                picReader.addEventListener('load', function (event) {
                                    let picFile = event.target;
                                    let div = document.createElement("div");
                                    div.setAttribute("style", "display: -webkit-inline-box;");
                                    div.innerHTML = "<img class='thumbnail' src='" + picFile.result + "'" +
                                        "title='" + picFile.name + "'/>";
                                    output.insertBefore(div, null);
                                });
                                //Read the image
                                picReader.readAsDataURL(file);
                                element.next(element).find('input').val(files.length + " files");
                            } else if(file.type ==='application/pdf' && name === "pdfFile"){
                                let div = document.createElement("div");
                                div.setAttribute("style", "display: -webkit-inline-box;");
                                div.innerHTML = '<img class="thumbnail" src="../../assets/images/pdf-thumbnail.jpg" title="pdf-mfm-thumbnail"/>';
                               output.insertBefore(div, null);
                                element.next(element).find('input').val(files.length + " files");
                            } else if(file.type.match('audio.*') && name === "track"){
                                let div = document.createElement("div");
                                div.setAttribute("style", "display: -webkit-inline-box;");
                                div.innerHTML = '<img class="thumbnail" src="../../assets/images/audio-thumbnail.jpg" title="audio-mfm-thumbnail"/>';
                                output.insertBefore(div, null);
                                element.next(element).find('input').val(files.length + " files");
                            }
                            if(file.type !=='application/pdf' && name === "pdfFile")
                                alert("Only PDf files");
                            if(!file.type.match('audio.*') && name === "track")
                                alert("Only Audio files");
                        }
                        // loadImage(this, event);
                        // let tempPath = URL.createObjectURL(event.target.files[0]);
                    });
                    $(this).find("button.btn-choose").click(function () {
                        element.click();
                    });
                    $(this).find("button.btn-reset").click(function () {
                        element.val(null);
                        $(this).parents(".input-file").find('input').val('');
                        let oldcanv = document.getElementById('canvas');
                        // document.removeChild(oldcanv)
                        oldcanv.remove();
                    });

                    $(this).find('input').css("cursor", "pointer");
                    $(this).find('input').mousedown(function () {
                        $(this).parents('.input-file').prev().click();
                        return false;
                    });
                    return element;
                }
            }
        }
    );
}
$(function() {
    bs_input_file();
});