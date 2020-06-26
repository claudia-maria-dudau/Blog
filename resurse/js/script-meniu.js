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

function ascundere_img(){
    btn = document.getElementById("asc");
    btn.onclick = function(){
        img = document.getElementsByTagName("figure");
        vid = document.getElementsByTagName("video");
        if(btn.innerHTML == "Ascundere imagini"){
            for(let i = 0 ; i <= img.length - 1; i++)
                img[i].classList.add("ascunde");
            for(let i = 0 ; i <= vid.length - 1; i++)
                vid[i].classList.add("ascunde");
            btn.innerHTML = "Afisare imagini";
        }
        else{
            for(let i = 0 ; i <= img.length - 1; i++)
                img[i].classList.remove("ascunde");
            for(let i = 0 ; i <= vid.length - 1; i++)
                vid[i].classList.remove("ascunde");
            btn.innerHTML = "Ascundere imagini";
        }
    }
}

function marcare_pg(){
    adr = window.location.href.split("/");
    adr_curenta = adr[adr.length - 1];
    meniu = document.getElementsByTagName("nav")[0];
    a = meniu.getElementsByTagName("a");
    
    for(let i = 0; i < a.length; i++){
        a_adr = a[i].href.split("/");
        a_adr = a_adr[a_adr.length - 1];
        if(a_adr == adr_curenta){
            a[i].parentNode.classList.add("curent");
        }
    }
}

function nr_cuv(){
    body = document.getElementsByTagName("body")[0];
    var text = body.innerText.split(" ");
    nr_cuv = document.getElementById("nr_cuv");
    nr_cuv.innerHTML += text.length - 2;
}