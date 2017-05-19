var cambio = false;
var pegajoso = document.getElementById("pegajoso");
var esconder = document.getElementById("esconder");
var centrar = document.getElementById("lincentrar");
var altura = 85;


window.addEventListener("scroll", function(){
	if (window.pageYOffset > altura) {
		pegajoso.classList.add("fixed");
		esconder.style.display = "none";
		centrar.style.width = "70%";
	}else{
		pegajoso.classList.remove("fixed");
		esconder.style.display = "inline-block";
		centrar.style.width = "auto";
	}
});

function myFuncion(){
	if (cambio==false) {
		document.getElementById("puto").style.display = "inline-block";
		document.getElementById("puto").style.transition = "1s";
		cambio=true;
	}else{
		document.getElementById("puto").style.display = "none";
		cambio = false;
	}
}



