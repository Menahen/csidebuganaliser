const fs = require('fs');
const readline = require('readline');
const { ipcRenderer } = require('electron');
const Analisador = require('./js/Analisador.js').Analisador;

var ultimaLinha = function(){
	return ultimaLinha.linha;
}

var verificador = function(){
	return verificador.id;
}

global.mics= [];
global.links= [];
let key = 0;
let parent = 0;
var resultPai = 0;
var resultFilho = 1;

ultimaLinha.linha = 0;

function observador(){
	var path = $("#path").val();
	$("#processamento").toggle("display");
		$("#info").css("display", "block");
	verificador.id = setInterval(function(){
		lerArquivoObservador(path); 
	}, 5000);
}

function parar(){
		$("#processamento").toggle("display");
		setTimeout(() => {
			$("#info").css("display", "none");
			clearInterval(verificador.id);
			limparTabela();
			limparFluxo();
	    },2000);
}

function lerArquivoObservador(path){
	var rd = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    console: false
	});
	//Ler as informações a cada 5 segundos.
	let count = 0;
	var countErro = 0;
	var mic = null;
	rd.on('line', function(line) {
		 count = count + 1;
		 var graph = {};
		 gerarDadosFluxo(line);
		 mic = obterNomeDaMic(line, mic);
   		 if(count > ultimaLinha.linha && (line.toLowerCase().indexOf("error") >= 0 || line.indexOf("IOException") >= 0)){
   		 	countErro++;
   		 	criarLinha(line, count, mic);
			ultimaLinha.linha = count;
   		 }
			$("#lblQuantidade").text(countErro);
	});
	console.log(global.links);
	console.log(global.mics);
}

function lerArquivo(){
	var path = $("#path").val();
	console.log(Analisador);
	Analisador.lerArquivoDois(path);
	limparFluxo();
	limparTabela();
	var rd = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    console: false
	});
	//Ler as informações a cada 5 segundos.
	let count = 0;
	var countErro = 0;
	var mic = null;
	rd.on('line', function(line) {
		 count = count + 1;
		 var graph = {};
		 gerarDadosFluxo(line);
		 mic = obterNomeDaMic(line, mic);
		 
   		 if(line.toLowerCase().indexOf("error") >= 0 || line.indexOf("IOException") >= 0 
   		 	|| line.indexOf("SDIException") >= 0){
   		 	countErro++;
   		 	criarLinha(line, count, mic);
			ultimaLinha.linha = count;
   		 }
			$("#lblQuantidade").text(countErro);
	});
	console.log(global.links);
	console.log(global.mics);
}

function obterNomeDaMic(line, mic){
	if(line.indexOf("STATEMACHINE (INFO) Next object to execute")  >= 0){
		console.log("Nome da mic" + mic);
		var indexName = line.indexOf("Mic");
		var name = line.substring(indexName).trim();
		return name;
	}else if(line.indexOf("TratadorDeMensagensLote")  >= 0){
		mic = "TratadorDeMensagensLote";
	}
	return mic;
}

function limparTabela(){
	$("#tabela > tbody > tr").remove();
}

function limparFluxo(){
	global.mics= [];
	global.links= [];
	key = 0;
	parent = 0;
	resultPai = 0;
	resultFilho = 1;
}


function criarLinha(line, count, mic){
	mic = mic == null ? '' : mic;
	$("#corpoTabela").append("<tr style='height:20px;' id="+ 'tr' + count +"> " +
				        "<td width='10%'>Linha: "+count+"</td> " +
						"<td width='50%' style='text-overflow: ellipsis;'><a data-role='hint' data-hint='"+line+"' data-hint-position='top' data-hint-max-size=500>" + line + "</a></td> "+
						"<td width='20%' style='text-overflow: ellipsis;' data-role='hint' data-hint='"+formatDate(new Date($.now()))+"' data-hint-position='top' data-hint-max-size=500>"+formatDate(new Date($.now()))+"</td>"+
						"<td width='10%' style='text-overflow: ellipsis;' data-role='hint' data-hint='"+mic+"' data-hint-position='top' data-hint-max-size=500>"+ mic +"</td>" +
						"<td width='10%'>" +
							"<div class='toolbar'>" +
							    "<div class='toolbar-section'>"+
							        "<button class='toolbar-button' onclick='removerLinha(tr" + count + ")'>"+
							        	"<span class='mif-bin fg-red' data-role='hint' "+
										    "data-hint-background='bg-green' "+
										    "data-hint-color='fg-white' " +
										    "data-hint-mode='1' "+
											    "data-hint='Remover|Remover erro'> " +
											  "</span>" +
							        "</button>"+
							        "<button class='toolbar-button'>"+
							        	"<span class='mif-warning fg-orange' data-role='hint' "+
											  "data-hint-background='bg-green' "+
											  "data-hint-color='fg-white' " +
												  "data-hint-mode='1' "+
												  "data-hint='Ignorar|Igonar erro'> " +
											"</span>"+
							        "</button>" +
							    "</div>" +
							"</div>" +
						"</td>" +
			        "</tr>");
}

function removerLinha(id){
	$(id).remove();
}

function gerarDadosFluxo(line){
	if(line.indexOf("STATEMACHINE (INFO)")  >= 0){
	if(line.indexOf("STATEMACHINE (INFO) Next object to execute")  >= 0){
	 	if(key == 0){
	 		parent = key;
	 	}else{
	 		parent = key - 1;
	 	}
	 	var indexName = line.indexOf("Mic");
	 	if(indexName != null && indexName > 0){
		 	var name = line.substring(indexName).trim();
		 	var graph = {key: key, text: name};
		 	global.mics.push(graph);
		 }
		 key = key + 1;
	} else if(line.indexOf("Execution of object")  >= 0){
		var resultIndex = line.indexOf('->');
		var result = line.substring(resultIndex + 2).trim();
		console.log(result);
		var link = {from: resultPai, to:resultFilho, text: result};
		resultPai++;
		resultFilho++;
		global.links.push(link);
	}
  }
}

function openFile(){
	var data = ipcRenderer.sendSync('abrir-arquivo');
	document.getElementById("path").value = data;
}

function formatDate(d){
	var month = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

	var date = d.getDate() + " " + month[d.getMonth()] + ", " + d.getFullYear();
	var time = d.toLocaleTimeString().toLowerCase();

	return date + " " + time;
}
