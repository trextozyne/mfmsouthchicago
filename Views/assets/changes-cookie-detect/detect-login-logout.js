(()=>{//debugger;
    // Get data
    let user = localStorage.getItem('user');
    let login_admin = document.getElementsByClassName("login_admin")[0];

    if (user){
        login_admin.setAttribute("href", "/user/admin");
        login_admin.innerHTML = `<span class="mbri-user mbr-iconfont mbr-iconfont-btn"></span>Admin`;
    }else {
        login_admin.setAttribute("href", "/user/login");
        login_admin.innerHTML = `<span class="mbri-user mbr-iconfont mbr-iconfont-btn"></span>Login`;
    }
})();

