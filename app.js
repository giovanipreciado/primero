var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var multer = require("multer");
var cloudinary = require("cloudinary");
var method_override = require("method-override");


var nombreUsuario = "giovani";
var passwordUsuario = "barcelona";
var sesion=false;
var cerrar = "cerrar sesion";

cloudinary.config({
	cloud_name: "dklw13fqs",
	api_key: "951338728356123",
	api_secret: "rPGNkKJ7hwkBC5PPdGgr3XizHzk"
});

var app = express();

mongoose.connect("mongodb://localhost/antojo_web");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(method_override("_method"));
var uploader = multer({dest: "./uploads"});
var middleware_upload = uploader.single("image_avatar");

var productSchema = {
	title:String,
	description:String,
	imageUrl:String,
	pricing:Number
};

var Platillo = mongoose.model("Platillo", productSchema);

app.set("view engine","jade");

app.use(express.static("public"));

app.get("/", function(req, res){
	if(sesion==true){
		Platillo.find(function(error, documento){
			if(error){ console.log(error); }
			res.render("index",{ platillos: documento, nombre: nombreUsuario, ce: cerrar });
		});	
	}else{
		Platillo.find(function(error, documento){
			if(error){ console.log(error); }
			res.render("index",{ platillos: documento });
		});	
	}
	
});

app.get("/admin", function(req, res){
	if(sesion==true){
		Platillo.find(function(error, documento){
			if(error){ console.log(error); }
			res.render("menu/new",{ platillos: documento, nombre: nombreUsuario, ce: cerrar });
		});
	}else{
		res.render("admin/formulario");
	}
});

app.get("/menu", function(req,res){
	if(sesion==true){
		Platillo.find(function(error, documento){
			if(error){ console.log(error); }
			res.render("menu/index",{ platillos: documento, nombre: nombreUsuario, ce: cerrar });
		});
	}else{
		Platillo.find(function(error, documento){
			if(error){ console.log(error); }
			res.render("menu/index",{ platillos: documento });
		});
	}
	
});

app.get("/cerrar", function(req, res){
	sesion=false;
	res.render("admin/formulario");
});

app.post("/menu",middleware_upload,function(req,res){
	var data = {
		title: req.body.title,
		description: req.body.description,
		imageUrl: "data.png",
		pricing: req.body.pricing
	}

	var platillo = new Platillo(data);

	if(req.file){
		cloudinary.uploader.upload(req.file.path, 
			function(result) {
				platillo.imageUrl = result.url;
				platillo.save(function(err){
					console.log(platillo);
					res.redirect("/menu");
				});
			}
		);
	}else{
		platillo.save(function(err){
			console.log(platillo);
			res.redirect("/menu");
		});
	}												
});

app.post("/admin", function(req, res){
	if(req.body.usuario == nombreUsuario && req.body.password == passwordUsuario){
		sesion = true;
		Platillo.find(function(error, documento){
			if(error){ console.log(error); }
			res.render("menu/new",{ platillos: documento, nombre: nombreUsuario, ce: cerrar });
		});
	}else{
		res.render("index");
	}
});

app.get("/menu/delete/:id", function(req, res){
	var id = req.params.id;
	Platillo.remove({"_id": id},function(err){
		if(err){
			console.log(err);
		}
		res.redirect("/menu");
	});
});

app.listen(8080);