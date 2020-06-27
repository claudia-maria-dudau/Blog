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
					selectare();
					actualizare_stoc();
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
					<p>Stoc: </p>\
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
					<p>Stoc: </p>\
					<button>Cumpara</button>\
					</div>", 
					{merch: obJson.merch[i]});
				}
				else{
					textTemplate += ejs.render("<div class = 'merch_temp'>\
					<p>Nume: <%= merch.nume %></p>\
					<p>Descriere: <%= merch.descriere %></p>\
					<p>Pret: <%= merch.pret %></p>\
					<p>Stoc: </p>\
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
	sel_resetare = document.getElementById("res");
	div_temp = document.getElementById("afisTemplate");
	merch = document.getElementsByClassName("merch_temp");

	sel_sortare.onclick = function(){
		var opt = 0;
		var sort = document.getElementsByName("sort")
		for(let i = 0; i < sort.length; i++){
			if(sort[i].checked){
				opt = sort[i].value;
				break;
			}
		}

		if(opt == "cresc"){
			let merch1 = Array.prototype.slice.call(merch);
			merch1.sort(function(a, b){
				let p_a = a.getElementsByTagName("p");
				let pret_a = parseInt(p_a[p_a.length - 2].innerHTML.split(" ")[1]);
				let p_b = b.getElementsByTagName("p");
				let pret_b = parseInt(p_b[p_b.length - 2].innerHTML.split(" ")[1]);
				return pret_a - pret_b;
			});
			for(let i = 0; i < merch1.length; i++)
				div_temp.appendChild(merch1[i]);
		}
		else{
			let merch1 = Array.prototype.slice.call(merch);
			merch1.sort(function(a, b){
				let p_a = a.getElementsByTagName("p");
				let pret_a = parseInt(p_a[p_a.length - 2].innerHTML.split(" ")[1]);
				let p_b = b.getElementsByTagName("p");
				let pret_b = parseInt(p_b[p_b.length - 2].innerHTML.split(" ")[1]);
				return pret_b - pret_a;
			});
			for(let i = 0; i < merch1.length; i++)
				div_temp.appendChild(merch1[i]);
		}

		time_out();
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

		time_out();
	}

	sel_resetare.onclick = resetare;
	
	function resetare(){
		for(let i = 0; i < merch.length; i++)
			merch[i].classList.remove("ascunde");
		
		let merch1 = Array.prototype.slice.call(merch);
		merch1.sort(function(a, b){
			let p_a = a.getElementsByTagName("p");
			let nume_a = p_a[0].innerHTML.split(" ")[1];
			let p_b = b.getElementsByTagName("p");
			let nume_b = p_b[0].innerHTML.split(" ")[1];
			return nume_a.localeCompare(nume_b);
			});
		for(let i = 0; i < merch1.length; i++)
			div_temp.appendChild(merch1[i]);
	}

	function time_out(){
		setTimeout(function(){
			resetare();
			alert("Aplicatia va fi resetata")
		}, 12000);
	}

	//---------------- evenimente ----------------
	function selectare(){
		for(let i = 0; i < merch.length; i++){
			merch[i].onclick = function(){
				for(let j = 0; j < merch.length; j++){
					if(merch[j] != this){
						merch[j].classList.remove("selectat");
						merch[j].getElementsByTagName("button")[0].classList.remove("selectat");
					}
				}

				this.classList.toggle("selectat");
				this.getElementsByTagName("button")[0].classList.toggle("selectat");
			}
		}
	}

	function actualizare_stoc(){
		for(let m of merch){
			let stoc = m.getElementsByTagName("p");
			stoc = stoc[stoc.length - 1];
			stoc.innerHTML = 'Stoc: ' + Math.floor(Math.random() * 30);
		}

		setInterval(function() {
			for(let m of merch){
				let stoc = m.getElementsByTagName("p");
				stoc = stoc[stoc.length - 1];
				stoc.innerHTML = 'Stoc: ' + Math.floor(Math.random() * 30);
			}
		}, 4000);
	}

	let btn_of = document.getElementById("oferta");
	var div_of = document.createElement("div");
	let cont = document.getElementById("sortare");
	btn_of.onclick = function(){
		if(this.innerHTML == "Afiseaza Oferta Momentului"){
			//maresc nr de apasari
			if(localStorage.nr_apas_of)
				localStorage.nr_apas_of = parseInt(localStorage.nr_apas_of) + 1;
			else
				localStorage.nr_apas_of = 1;

			//calculez minimul de produse din stoc la acel moment
			let min = 31;
			for(let m of merch){
				let stoc = m.getElementsByTagName("p");
				stoc = parseInt(stoc[stoc.length - 1].innerHTML.split(" ")[1]);
				if(stoc < min && stoc != 0){
					min = stoc;
					var prod = m;
				}
			}

			let p_prod = prod.getElementsByTagName("p");
			let p_nume = document.createElement("p");
			p_nume.innerHTML = p_prod[0].innerHTML;
			div_of.appendChild(p_nume);
			let p_pret = document.createElement("p");
			let pret = parseInt(p_prod[p_prod.length - 2].innerHTML.split(" ")[1]);
			p_pret.innerHTML = "Pret: ";
			let s_pret = document.createElement("s");
			s_pret.innerHTML = pret + " ";
			p_pret.appendChild(s_pret);
			p_pret.innerHTML += " " + pret - 0.15*pret + " lei (economisiti " + 0.15*pret + " lei)"
			div_of.appendChild(p_pret);
			let p_stoc = document.createElement("p");
			p_stoc.innerHTML = p_prod[p_prod.length - 1].innerHTML;
			div_of.appendChild(p_stoc);
			div_of.classList.add("oferta");
			let btn_of = document.createElement("button");
			btn_of.type = "button";
			btn_of.innerHTML = "Cumpara";
			div_of.appendChild(btn_of);
			cont.appendChild(div_of);

			div_of.onclick = function(){
				alert("Nr apasari pe oferta: " + localStorage.getItem("nr_apas_of"));
			}

			this.innerHTML = "Ascunde Oferta";
		}
		else{
			div_of.innerHTML = "";
			cont.removeChild(div_of);
			this.innerHTML = "Afiseaza Oferta Momentului";
		}
	}
}