window.onload = function(){
	align_menu();
	marcare_pg();

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

	//---------------- sortare/filtare ----------------
	sel_sortare = document.getElementById("sort");
	sel_filtrare = document.getElementById("filt");
	div_temp = document.getElementById("afisTemplate");
	merch = document.getElementsByClassName("merch_temp");

	sel_sortare.onchange = function(){
		let merch1 = Array.prototype.slice.call(merch);
		if(sel_sortare.options[sel_sortare.selectedIndex].value == "cresc"){
			merch1.sort(function(a, b){
				let p_a = a.getElementsByTagName("p");
				let pret_a = parseInt(p_a[p_a.length - 1].innerHTML.split(" ")[1]);
				let p_b = b.getElementsByTagName("p");
				let pret_b = parseInt(p_b[p_b.length - 1].innerHTML.split(" ")[1]);
				return pret_a - pret_b;
			});
		}
		else{
			merch1.sort(function(a, b){
				let p_a = a.getElementsByTagName("p");
				let pret_a = parseInt(p_a[p_a.length - 1].innerHTML.split(" ")[1]);
				let p_b = b.getElementsByTagName("p");
				let pret_b = parseInt(p_b[p_b.length - 1].innerHTML.split(" ")[1]);
				return pret_b - pret_a;
			});
		}

		for(let i = 0; i < merch1.length; i++)
			div_temp.appendChild(merch1[i]);
	}

	sel_filtrare.onchange = function(){
		if(sel_filtrare.options[sel_filtrare.selectedIndex].value == "tot"){
			for(let i = 0; i < merch.length; i++)
				merch[i].classList.remove("ascunde");
		}
		else if(sel_filtrare.options[sel_filtrare.selectedIndex].value == "cana"){
			for(let i = 0; i < merch.length; i++){
				if(!merch[i].innerHTML.includes("Cana"))
					merch[i].classList.add("ascunde");
				else
					merch[i].classList.remove("ascunde");
			}
		}
		else if(sel_filtrare.options[sel_filtrare.selectedIndex].value == "tricou"){
			for(let i = 0; i < merch.length; i++){
				if(!merch[i].innerHTML.includes("Tricou"))
					merch[i].classList.add("ascunde");
				else
					merch[i].classList.remove("ascunde");
			}
		}
		else{
			for(let i = 0; i < merch.length; i++){
				if(!merch[i].innerHTML.includes("Zi"))
					merch[i].classList.add("ascunde");
				else
					merch[i].classList.remove("ascunde");
			}
		}
	}
}