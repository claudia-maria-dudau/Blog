var express = require('express');/*include modulul express
memorand in variabila express obiectul asociat modulului(exportat de modul)*/
var path = require('path');
var formidable = require('formidable');
var session = require('express-session');
var fs = require('fs');
var crypto = require('crypto');
var nodemailer = require("nodemailer");
var app = express();

//pentru folosirea ejs-ului 
app.set('view engine', 'ejs');// asta imi permite sa scriu cod intre <%  si %>

console.log(__dirname);// in __dirname (predefinit!) am calea absoluta catre folderul radacina al proiectului 

//definirea folderului static de resurse
app.use(express.static(path.join(__dirname, "resurse")));

//definire sesiune
app.use(session({     
	secret: 'cheie_sesiune',
    resave: true,
    saveUninitialized: false
}));


// ------ cereri de tip post ------
//sign-up
app.post("/sign-up", function(req, res){
	var formular = formidable.IncomingForm();
	// req - requestul 
	//parse primeste o functie callback care se executa la finalul parsarii
	formular.parse(req, function(err, fields, files){
		//in fields am datele din inputurile de tip text, range, number etc... mai putin file
		//in files am campurile de tip fisier din <input type="file" />
		// in fields o sa avem pe post de campuri(proprietati) valorile din atributele name ale inputurilor din formular
		var fisUseri = fs.readFileSync("resurse/json/useri.json");
		//fisUseri --- continutul lui useri.json
		var obUseri = JSON.parse(fisUseri);
		var parolaCriptata;
		var algCriptare = crypto.createCipher("aes-128-cbc", "parola_criptare");
		parolaCriptata = algCriptare.update(fields.parola, "utf-8", "hex")
		parolaCriptata += algCriptare.final("hex");
		var userNou = {
			id: obUseri.nextId, 
			username: fields.username,
			email:fields.email, 
			parola:parolaCriptata, 
			dataInreg:new Date(),  
			notificari: fields.subscriptie,
			rol:"user" 
		}
		obUseri.nextId++;
		obUseri.useri.push(userNou);
    	//opus parse
		var jsonNou= JSON.stringify(obUseri);//opusul lui parse
		fs.writeFileSync("resurse/json/useri.json", jsonNou);
		console.log("Utilizator nou inregistrat");
		trimiteMail(userNou.email, userNou.username);

		//conectare user
		req.session.user = userNou; //setez userul ca proprietate a sesiunii
		console.log("User conectat");
		console.log(userNou);
		res.render('html/signed-up',{username: req.session.user.username}); 
	});
});

//trimitere mail inregistrate user		
async function trimiteMail(email, username) {
	let transporter = nodemailer.createTransport({
		service: 'gmail',

		secure: false,
		auth: {
			user: "claudia-maria.dudau@my.fmi.unibuc.ro",
			pass: "Friptura7"
		},
		tls: {
			rejectUnauthorized: false //pentru gmail
		}
	});

	//trimitere mail
	let info = await transporter.sendMail({
		from: '"Friptura&Negru" <claudia-maria.dudau@my.fmi.unibuc.ro>',
		to: email,
		subject: "Inregistrare reusita",
		text: "Buna " + username + ", bine ai venit in comunitata blogului Friptura&Negru!"
	});

	console.log("Mesaj trimis: %s", info.messageId);
}

//log-in
app.post('/login', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
		var fisUseri = fs.readFileSync("resurse/json/useri.json", "utf8");
		var obUseri = JSON.parse(fisUseri);
        var algCriptare = crypto.createCipher('aes-128-cbc', 'parola_criptare'); 
        var parolaCriptata = algCriptare.update(fields.parola, 'utf8', 'hex'); //cifrez parola
        parolaCriptata += algCriptare.final('hex'); 
        let user = obUseri.useri.find(function(x){ //caut un user cu acelasi nume dat in formular si aceeasi cifrare a parolei
            return (x.username == fields.username && x.parola == parolaCriptata);
        });
        if(user){
            req.session.user = user; //setez userul ca proprietate a sesiunii
			console.log("User conectat");
			console.log(user);
			res.render('html/postari',{username: req.session.user.username}); 
		}
		else{
			console.log("User inexistent");
			res.render('html/404');
		}
    });
});

//comentarii
app.post('/blog1', function(req, res){
	var fisCom = fs.readFileSync("resurse/json/com-blog1.json", "utf8");
	var obCom = JSON.parse(fisCom);
	var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
		var comNou = {
			id: obCom.nextId, 
			username: req.session.user.username,
			text: fields.comentariu,
			data: new Date()
		}
		obCom.nextId++;
		obCom.comentarii.push(comNou);
		console.log("Comentariu nou inregistrat");
		var jsonNou = JSON.stringify(obCom);
		fs.writeFileSync("resurse/json/com-blog1.json", jsonNou);
		res.render('html/blog1',{username: req.session.user.username}); 
	});
});

app.post('/blog2', function(req, res){
	var fisCom = fs.readFileSync("resurse/json/com-blog2.json", "utf8");
	var obCom = JSON.parse(fisCom);
	var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
		var comNou = {
			id: obCom.nextId, 
			username: req.session.user.username,
			text: fields.comentariu,
			data: new Date()
		}
		obCom.nextId++;
		obCom.comentarii.push(comNou);
		console.log("Comentariu nou inregistrat");
		var jsonNou = JSON.stringify(obCom);
		fs.writeFileSync("resurse/json/com-blog2.json", jsonNou);
		res.render('html/blog2',{username: req.session.user.username}); 
	});
});

app.post('/blog3', function(req, res){
	var fisCom = fs.readFileSync("resurse/json/com-blog3.json", "utf8");
	var obCom = JSON.parse(fisCom);
	var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
		var comNou = {
			id: obCom.nextId, 
			username: req.session.user.username,
			text: fields.comentariu,
			data: new Date()
		}
		obCom.nextId++;
		obCom.comentarii.push(comNou);
		console.log("Comentariu nou inregistrat");
		var jsonNou = JSON.stringify(obCom);
		fs.writeFileSync("resurse/json/com-blog3.json", jsonNou);
		res.render('html/blog3',{username: req.session.user.username}); 
	});
});

//log-out
app.get("/logout", function(req, res) {
	req.session.destroy();
	console.log("Utilizator deconectat");
	res.redirect("/")
});

// ------ cereri de tip get ------
app.get('/', function(req, res) {
	/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
	console.log(req.url);
	var numeUtiliz = req.session? (req.session.user? req.session.user.username : null) : null;
    res.render('html/index', {username: numeUtiliz });
});

//app.get general
app.get("/*", function(req,res){
	console.log(req.url);// req.url --- "/pagina"
	var numeUtiliz = req.session? (req.session.user? req.session.user.username : null) : null;
    res.render('html' + req.url/*.replace(/\./g, "")*/, {username: numeUtiliz}, function(err, text_randat){
        //err e eventuala eroare; daca intra in callback la finalul randarii fara sa fi intalnit eroare atunci err este null
        //err.message contine textul erorii
        //text_randat este textul de dupa interpretarea template-ului
			
		//functia callback trebuie sa returneze noul text randat (dupa procesari ulterioare)
        if(err){
			if(err.message.includes('Failed to lookup view')){
			 	console.log("/404");
			    return res.status(404).render("html/404",  {username: numeUtiliz});
			}
            else
				throw err;
        }
        else
        	res.send(text_randat);// e textul dupa procesarea template-urilor
    });
});
  

//fiind ultimul ajunge aici doar cand nu a gasit tratarea cererii mai sus
app.use(function(req, res){
	console.log("/404");
	res.status(404).render("html/404");
})

app.listen(8080); //asteapta cereri
console.log('Aplicatia se va deschide pe portul 8080.');