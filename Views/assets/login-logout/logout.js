function logOut(logout){
    let data = null;

    let loc = window.location;
    let url = loc.protocol + '//' + loc.hostname;
    url = (loc.port ? url + ":" + loc.port : url) + '/';

    if (url+"user/admin" === loc.href || url+"dashboard/dashboard.html" === loc.href || url+"dashboard/users.html" === loc.href) {
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status === 200)
                    window.location = "/";
                else if (this.status === 404)
                    window.location = "/user/not-found";
                else if (this.status === 500)
                    window.location = "/user/error-not-found";
            }

            // Remove user
            localStorage.removeItem('user');
        });

        xhr.open("GET", "/user/" + logout);
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("postman-token", "9064cb54-3cc3-4f58-6b51-17f48f313ad0");

        xhr.send(data);
    } else {
        // Remove user
        localStorage.removeItem('user');
    }
}