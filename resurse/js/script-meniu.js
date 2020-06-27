function align_menu(){
    //---------------- meniu ----------------
    let div_login = document.querySelector("#log-in div");
    let signup = document.getElementById("sign-up");
    div_login.style.right = signup.offsetWidth + "px";

    //---------------- footer ----------------
    let footer = document.getElementsByTagName("footer")[0];
    footer.style.top = window.innerHeight - footer.offsetHeight + "px";

    window.addEventListener('resize', function(){
        div_login.style.right = signup.offsetWidth + "px";
        footer.style.top = window.innerHeight - footer.offsetHeight + "px";
    });
}

function ascundere_img(){
    let btn = document.getElementById("asc");
    btn.onclick = function(){
        let img = document.getElementsByTagName("figure");
        let vid = document.getElementsByTagName("video");
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
    let body = document.getElementsByTagName("body")[0];
    var text = body.innerText.split(" ");
    let nr_cuv = document.getElementById("nr_cuv");
    nr_cuv.innerHTML += text.length;
}

function afis_com(pag){
    //---------------- template comentarii ----------------
    var ajaxRequest = new XMLHttpRequest();
	ajaxRequest.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
					var obJson = JSON.parse(this.responseText);
                    afis(obJson, pag);
			}
    };
	ajaxRequest.open("GET", "/json/comentarii.json", true);
    ajaxRequest.send();

    function afis(json_com, pag){
        let container = document.getElementById("comentarii");
        let textTemplate = "";
        for(let i = 0; i < json_com.comentarii.length; i++){
            if(parseInt(json_com.comentarii[i].pagina) == pag){
                textTemplate += ejs.render("<div class = 'comm'>\
                <p><%= comment.username %> (la <%= comment.data.substring(0, 9) %>): </p>\
                <p class = 'text_com'><%= comment.text %></p>\
                <% if(locals.rol == 'admin') { %> <button class = 'sterg_com'> Sterge </buttton> <% } %>\
                <form method = 'post'> <input type = 'text' name = 'nr_com' value = <%= comment.id %> <input type = 'text' name = 'nr_com' value = <%= comment.id %>><%= comment.plusuri %>  <button type = 'submit' formaction = 'plus'> + </button> <button type = 'submit' formaction = '/minus'> - </button> <%= comment.minusuri %></form>\
                </div>", 
                {comment: json_com.comentarii[i]});
            }
        }
        container.innerHTML = textTemplate;
    }
}

function ascundere_com(){
    let btn = document.getElementById("btn_asc");
    var comentarii = document.getElementsByClassName("comm");
    btn.onclick = function(){
        if(btn.innerHTML == "Ascunde"){
            for(let i = 0; i < comentarii.length; i++)
                comentarii[i].classList.add("ascunde");
            btn.innerHTML = "Afiseaza";
        }
        else{
            for(let i = 0; i < comentarii.length; i++)
                comentarii[i].classList.remove("ascunde");
            btn.innerHTML = "Ascunde";
        }
    }
}