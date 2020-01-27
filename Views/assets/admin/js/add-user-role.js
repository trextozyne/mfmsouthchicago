var role = null;
var userID = null;
function getSelectEntries($role) {
    if($role.trim() !== "superUsers" || $role.trim() !== "userAdminAnyDatabase")
        alert("Note if user has a higher admin instance, would be reduced to a lover one!!!");
    role = $role;
}

(function() {
    let uri = "";
    let autocomPlete = "";
    let $currentInput = "";
    let user = null;
    let autocomPleteDrpDwn = $(".outerUl");
    let checkEnterPress = false;
    let siteContainer = $("html, body");

    //========search the list to provide me data for the AutoComplete ul============
    $(".searchTerm").on("input propertychange paste", function () {
        let $this = $(this);
        let val = $this.val().trim();

        if(val) {
            uri = "/user/find/by/";
            $currentInput.css("display", "block");
            checkEnterPress = false; //reenable enter click
            //prevent many search from using dropdown
            if ($this.hasClass("searchTerms")) return false;

            $.ajax({
                url: uri + val,
                "method": "GET",
                success: function (data) {
                    if (data.length !== 0) {
                        autocomPlete += "<ul>";
                        autocomPlete +=
                            '<li><a href="javascript:void(0)">' + data[0].username + "</a></li>";
                        autocomPleteDrpDwn.html(autocomPlete + "</ul>");
                        autocomPlete = "";

                        userID = data[0]._id;
                    } else {
                        autocomPleteDrpDwn.html("");
                    }
                }
            });
        } else {
            autocomPleteDrpDwn.html("");
        }
    });

    //==plugin to check if attribute exists
    $.fn.hasAttr = function (name) {
        return this.attr(name) !== undefined;
    };


    $('body').on("click", "li a", function () {
        let $this = $(this);
        let $input = $this.parents(".input-wrapper").find("input").val($this.text());
        if (!$this.hasClass("searchTerms")) $this.trigger("blur");
        user = $input.value;
        document.getElementById("user-roles").removeAttribute("hidden");
        document.getElementById("add-user-role").removeAttribute("hidden");
    });

    // clear text remove growth from inputs
    $(".Klose").on("click", function() {

        $(this)
            .find(".right-klose, .left-klose")
            .delay(300)
            .animate({ opacity: 0, width: "0px" }, 1000);
        $(this).parent().find(".Klose").delay(1000).animate({ left: "35px" }, 300);
        $(this).parent().find("input").val("").removeClass("grow");
        autocomPleteDrpDwn.html("");
    });

    let focusinEvent = function($this) {

        $currentInput = $this
            .not(".searchTerms")
            .parents(".wrapper")
            .find(".outerUl")
            .css("display", "inline-block");
        $this.parent().find(".Klose").delay(300).animate({ left: "-4px" }, 300);
        $this
            .parent()
            .find(".right-klose, .left-klose")
            .delay(300)
            .animate({ opacity: 1, width: "20px" }, 1000);
        setTimeout(function() {
            $this.addClass("grow");
            $currentInput.addClass("auto");
        }, 400);
    };

    let focusOutEvent = function($this) {
        $currentInput = $this
            .parents(".wrapper")
            .find(".outerUl")
            .removeClass("auto");
        setTimeout(function() {
            $currentInput.css("display", "none");
        }, 400);
    };

    //==========On focus and lost focus for suggestions===============
    $("input")
        .focus(function() {
            focusinEvent($(this));
        })
        .blur(function() {
            focusOutEvent($(this));
        });

    //==========Inputs suggestion select changes===============
    $("input").keydown(function(e) {
        let $this = $(this);
        let $listItems = $this.parents(".wrapper").find("li");

        let key = e.keyCode, $selected = $listItems.filter(".selected"), $current;

        if (key !== 40 && key !== 38 && key !== 13) return;

        $listItems.removeClass("selected");
        $listItems.find("a").removeClass("hover");

        if (key == 40) {
            checkEnterPress = false; //reenable enter click
            // Down key
            if (!$selected.length || $selected.is(":last-child")) {
                $current = $listItems.eq(0);
                $current.find("a").addClass("hover");
            } else {
                $current = $selected.next();
                $current.find("a").addClass("hover");
            }
        } else if (key === 38) {
            checkEnterPress = false; //reenable enter click
            // Up key
            if (!$selected.length || $selected.is(":first-child")) {
                $current = $listItems.last();
                $current.find("a").addClass("hover");
            } else {
                $current = $selected.prev();
                $current.find("a").addClass("hover");
            }
        } else if (key === 13 && $this.value !== "") {
            // Enter key
            if (checkEnterPress) return false;
            checkEnterPress = true;
            if (!$this.hasClass("searchTerms")) $this.trigger("blur");
            user = $this.value;
            document.getElementById("user-roles").removeAttribute("hidden");
            document.getElementById("add-user-role").removeAttribute("hidden");
            return true;
        }

        $(this).val($current.addClass("selected").text());
    });


    $('#user-roles span').click(function(){
        $('#selected').text($(this).text());
    });

    $('#add-user-role').on("click", ()=>{
        let roles = {
            "role": role,
            "db": "photoalbumdb"
        };

        let settings = {
            url: "/user/"+ userID +"/update-roles",
            method: "put",
            data: roles
        };

        $.ajax(settings).done((response)=>{
            alert(response);
        });

        document.getElementById("user-roles").setAttribute("hidden", true);
        document.getElementById("add-user-role").setAttribute("hidden", true);
        $('.Klose').click();
    })
})($);