window.onload = function(){
	align_menu();

	//---------------- template ----------------
	//creez un obiect de tip XMLHttpRequest cu care pot transmite cereri catre server
	var ajaxRequest = new XMLHttpRequest();

	//la schimbarea starii obiectului XMLHttpRequest (la schimbarea proprietatii readyState)
	/* stari posibile:
	0 - netrimis
	1 - conexiune deschisa
	2 - s-au transmis headerele
	3 - se downleadeaza datele (datele sunt impartite in pachete si el primeste cate un astfel de pachet)
	4 - a terminat
	*/

	ajaxRequest.onreadystatechange = function() {
			//daca am primit raspunsul (readyState==4) cu succes (codul status este 200)
			if (this.readyState == 4 && this.status == 200) {
					//in proprietatea responseText am contintul fiserului JSON
					//document.getElementById("afisJson").innerHTML = this.responseText;
					var obJson = JSON.parse(this.responseText);
					afiseajaJsonTemplate(obJson);
			}
    };
    
	//deschid o conexiune cu o cerere de tip get catre server
	//json e pus in folderul static "resurse" deci calea e relativa la acel folder (fisierul e la calea absoluta /resurse/json/studenti.json)
	ajaxRequest.open("GET", "/json/merch.json", true);
	//trimit catre server cererea
	ajaxRequest.send();

	function afiseajaJsonTemplate(obJson) { 
			//in acets div voi afisa template-urile   
			let container = document.getElementById("afisTemplate");

			//in textTemplate creez continutul (ce va deveni innerHTML-ul) divului "afisTemplate"
			let textTemplate = "";
			//parcurg vetorul de studenti din obJson
			for(let i = 0; i < obJson.merch.length; i++){
				//creez un template ejs (primul parametru al lui ejs.render)
				//acesta va primi ca parametru un student din vectorul de studenti din json {student: obJson.studenti[i]}
				//practic obJson.studenti[i] e redenumit ca "student" in template si putem sa ii accesam proprietatile: student.id etc
				if(i < 3){
					textTemplate += ejs.render("<div class = 'merch_temp'>\
					<p>Nume: <%= merch.nume %></p>\
					<p>Descriere: <%= merch.descriere %>*</p>\
					<p>Dimensiune: <%= merch.dimensiune %></p>\
					<p>Material: <%= merch.material %></p>\
					<p>Pret: <%= merch.pret %></p>\
					<button>Cumpara</button>\
					</div>", 
					{merch: obJson.merch[i]});
				}
				else if(i < 6){
					textTemplate += ejs.render("<div class = 'merch_temp'>\
					<p>Nume: <%= merch.nume %></p>\
					<p>Descriere: <%= merch.descriere %>*</p>\
					<p>Marime: <%= merch.marime %></p>\
					<p>Material: <%= merch.material %></p>\
					<p>Pret: <%= merch.pret %></p>\
					<button>Cumpara</button>\
					</div>", 
					{merch: obJson.merch[i]});
				}
				else{
					textTemplate += ejs.render("<div class = 'merch_temp'>\
					<p>Nume: <%= merch.nume %></p>\
					<p>Descriere: <%= merch.descriere %></p>\
					<p>Pret: <%= merch.pret %></p>\
					<button>Cumpara</button>\
					</div>", 
					{merch: obJson.merch[i]});
				}
            } 
            
			//adaug textul cu afisarea studentilor in container
			container.innerHTML = textTemplate;
	}
}