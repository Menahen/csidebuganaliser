var Analisador = require('./js/analisador-erros.js').Analisador;
var Observador = require('./js/observador.js').Observador;
var ManipuladorDom =  require('./js/manipulador-dom.js').ManipuladorDOM;
var DadosDB =  require('./js/dados.js').DadosDB;
var { ipcRenderer } = require('electron');


var idObservador = null;
$(document).ready(function(){
	if(global.errosLinx != null && global.errosLinx !== 'undefined' && global.errosLinx.length >= 0){
		for(let i = 0; i < global.errosLinx.length; i++){
			let erroLinx = global.errosLinx[i];
			erroLinx.linha = erroLinx.linha.replace(':', ' ');
			console.log(erroLinx.linha);
			ManipuladorDom.criarLinhaErroLinx(erroLinx);
			$("#lblQuantidade").text(global.errosLinx.length);
		  }
		}
   DadosDB.buscarCaminho().then((item) => {
   		console.log(item);
   		if(item != null && item !== 'undefined'){
   			$("#path").val(item.caminho);
   		}
   });
   if(global.isPrimeiraChecagem == false){
   		document.querySelector("#processamento").style.display = "block";
   }
});
document.querySelector("#observador").addEventListener("click", function (){
	console.log("Inicio...");
	limparTabela();
	global.ultimaLinha = 0;
	global.numErros = 0;
	global.isPrimeiraChecagem = true;
	$("#lblQuantidade").text(global.numErros);
	document.querySelector("#observador").disabled = true;
	document.querySelector("#processamento").style.display = "block";
	let path = $("#path").val();
	idObservador = setInterval(function(){
		Observador.executar(path)
	}, 5000);
	console.log("Iniciando evento: " + idObservador);
});

document.querySelector("#analisador-arquivo").addEventListener("click", function (){
	limparTabela().then(() => {
		let path = $("#path").val();
		if(typeof(path) == "undefined" || path == null ||(path != null && path == '')){
			$("#lblQuantidade").text("");
			throw "Caminho do arquivo não especificado."
		}
		Analisador.lerArquivo(path);
	}).catch(err =>alert(err));
});

document.querySelector("#salvar-arquivo").addEventListener("click", function(){
	var data = document.querySelector("#path").value;
	DadosDB.salvarCaminho(data);
	$.Notify({
	    caption: 'Caminho do Arquivo',
	    content: 'Caminho salvo com sucesso!!!',
	    type: 'success'
	});
});
document.querySelector("#parar").addEventListener("click", function (){
	$("#processamento").toggle("display");
		document.querySelector("#observador").disabled = false;
		$("#lblQuantidade").text(global.numErros);
		clearInterval(idObservador);
		setTimeout(() => {
			$("#info").css("display", "none");
			console.log("parando evento: " + idObservador);
			limparTabela();
			global.isPrimeiraChecagem = true;
	    },2000);
});
document.querySelector("#abrir-arquivo").addEventListener("click", function (){
	var data = ipcRenderer.sendSync('abrir-arquivo');
	if(data != null && typeof(data) !== 'undefined' && data !== ''){
		document.querySelector("#path").value = data;
	}
});

function removerLinha(id){
	$(id).remove();
}

function ignorarErro(erroLinx){
	DadosDB.salvarErroIgnorado(erroLinx);
}

function limparTabela(){
	return new Promise((resolve) => {
		global.mics= [];
		global.links= [];
		global.key = 0;
		global.parent = 0;
		global.resultPai = 0;
		global.resultFilho = 1;
		global.mic = null;
		global.numErros = 0;
		global.errosLinx = [];
		$("#tabela > tbody > tr").remove();
		let numeroLinhas = $("#tabela > tbody > tr").length;
		if(numeroLinhas == 0){
			resolve('Linhas apagadas');
		}
	});
}

