window.onload = function(){
    align_menu();
    marcare_pg();
    ascundere_img();

    //---------------- template useri ----------------
    var ajaxRequest = new XMLHttpRequest();
	ajaxRequest.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
					var obJson = JSON.parse(this.responseText);
                    afis_useri(obJson);
                    stergere();
			}
    };
	ajaxRequest.open("GET", "/json/useri.json", true);
    ajaxRequest.send();

    function afis_useri(json_useri){
        let container = document.getElementsByTagName("tbody")[0];
        let textTemplate = "";
        for(let i = 0; i < json_useri.useri.length; i++){
            textTemplate += ejs.render("<tr>\
            <td><%= user.id %> </td>\
            <td><%= user.username %> </td>\
            <td><%= user.email %> </td>\
            <td><%= user.dataInreg %> </td>\
            <td><%= user.notificari %> </td>\
            <td><%= user.rol %> </td>\
            <td class = 'sterg'><form method = 'post' action = 'sterge-util'> <input type = 'text' name = 'id' value = <%= user.id %>> <button type = 'submit'> Sterge </button> </form> </td>\
            </tr>", 
            {user: json_useri.useri[i]});
        }
        container.innerHTML = textTemplate;

        let tfoot = document.getElementsByTagName("tfoot")[0];
        let tr = tfoot.getElementsByTagName("tr")[0];
        let nr_util = tr.getElementsByTagName("td")[0];
        nr_util.innerHTML += json_useri.useri.length;
    }

    function stergere(){
        let tbody = document.getElementsByTagName("tbody")[0];
        let util = tbody.getElementsByTagName("tr");
        for(let tr of util){
            tr.onclick = function(ev){
                if(ev.ctrlKey){
                    let btn_ster = tr.getElementsByTagName("td")[6];
                    btn_ster.classList.toggle("sterg");
                }
            }
        }
    }
}