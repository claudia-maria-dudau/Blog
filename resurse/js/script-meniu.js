function align_menu(){
    //---------------- meniu ----------------
    div_login = document.querySelector("#log-in div");
    signup = document.getElementById("sign-up");
    div_login.style.right = signup.offsetWidth + "px";

    //---------------- footer ----------------
    footer = document.getElementsByTagName("footer")[0];
    footer.style.top = window.innerHeight - footer.offsetHeight + "px";

    window.addEventListener('resize', function(){
        div_login.style.right = signup.offsetWidth + "px";
        footer.style.top = window.innerHeight - footer.offsetHeight + "px";
    });
}