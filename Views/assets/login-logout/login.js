
(()=>{
    $('.toggle').on('click', function() {
        $('.container').stop().addClass('active');
    });

    $('.close').on('click', function() {
        $('.container').stop().removeClass('active');
    });

    let btn = document.querySelectorAll('button');
    btn.forEach((button)=>{
        button.addEventListener("click", (event)=>{
            event.preventDefault();
            if (event.target.id === 'login' || event.target.parentElement.id === 'login'){
                $("#login_form").submit(); //Trigger the Submit Here
            }
            if (event.target.id === 'register' || event.target.parentElement.id === 'register'){
                $('.container').stop().removeClass('active');
                $("#register_form").submit(); //Trigger the Submit Here
            }
        })
    });


    function loadAdmin(){
        let data = null;

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {debugger;
            if (this.readyState === 4) {
                alert(this.status)
                if (this.status === 200)
                    window.location = "admin";
                else if (this.status === 404)
                    window.location = "not-found";
                else if (this.status === 500)
                    window.location = "login";
            }
        });

        xhr.open("GET", "/user/admin");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("postman-token", "2d73c5b2-7dd4-5d8e-fae7-7c92d9081fa1");

        xhr.send(data);
    }

    function loadAnimation() {
        //=====add animation to login
        let cards = document.getElementsByClassName("card");
        cards[1].classList.add("animate-login-left");
        cards[0].classList.add("animate-welcome");

        setTimeout(()=> {
            cards[0].setAttribute("style", "z-index: 1000;");
        }, 400);

        setTimeout(()=>{
            cards[1].classList.remove("animate-login-left");
            cards[0].classList.remove("animate-welcome");
            document.body.innerHTML += `<div class="loading">
                      <div class="spinner-wrapper">
                        <span class="spinner-text">LOADING</span>
                        <span class="spinner"></span>
                      </div>
                    </div>`;
        }, 1200);
    }

    function getFormData($form){

        let unindexed_array = $form.serializeArray();
        let indexed_array = {};

        $.map(unindexed_array, function(n, i){
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    }

    $("#login_form").submit(function(evt) {
        evt.preventDefault();
        let url ="";
        let method ="";

        let $form = $("#login_form");

        if ($form[0]["username"].value === null || $form[0]["username"].value === "",$form[0]["password"].value === null || $form[0]["password"].value === "") {
            alert("Please Fill All Required Field");
            return false;
        }else {

            let formData = JSON.parse(JSON.stringify(getFormData($form)));
            debugger;
            let foundUser = users.find(item => item.username === formData.username);
            if (!foundUser) {
                alert("You likely do not exist on our server, Please contact Admin");
            }else {
                let foundPswd = users.find(item => item.password === formData.password);
                let foundRole = foundUser.roles.find(item => item.role === "userOnly");
                if (!foundPswd && foundUser) {
                    alert("Password not exist/Incorrect!!!");
                } else if (foundUser && !foundRole) {
                    url = "/user/login";
                    method = "POST";

                    $.ajax({
                        async: true,
                        crossDomain: true,
                        url: url,
                        method: method,
                        data: formData
                    }).done(function (response) {
                        debugger;
                        // Store data
                        localStorage.setItem('user', response.user._id);

                        $form.find("input[type=text], textarea").val("");
                        loadAnimation();
                        setTimeout(() => {
                            loadAdmin();
                        }, 5000);

                    }).fail(function (data) {
                        // alert("it must be an image");
                    });

                } else {
                    alert('You\'re not an Administrative, Please check with Admin')
                }
            }
        }
    });

    $("#register_form").submit(function(evt) {
        evt.preventDefault();
        let url ="";
        let method ="";

        let $form = $("#register_form");
debugger;
        if ($form[0]["username"].value === null || $form[0]["username"].value === "",
            $form[0]["firstname"].value === null || $form[0]["firstname"].value === "",
            $form[0]["lastname"].value === null || $form[0]["lastname"].value === "",
        $form[0]["email"].value === null || $form[0]["email"].value === "",
            $form[0]["password"].value === null || $form[0]["password"].value === "",
            $form[0]["re-password"].value === null || $form[0]["re-password"].value === "") {
            alert("Please Fill All Required Field");
            return false;
        }else {
            let formData = JSON.parse(JSON.stringify(getFormData($form)));

            let mirrorUser = {
                roles: [{role: "userOnly"}],
                username: formData.username,
                password: formData.password
            };
            users.push(mirrorUser);

            url = "/user/create";
            method = "POST";

            $.ajax({
                async: true,
                crossDomain: true,
                url: url,
                method: method,
                data: formData
            }).done(function (response) {
                alert("Saved: "+response);
                $form.find("input[type=text], textarea").val("");
            }).fail(function (data) {
                // alert("it must be an image");
            });

        }
    });

})();