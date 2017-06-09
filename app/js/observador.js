var fs = require('fs');
var readline = require('readline');
var GerenciadorLinx = require('./gerenciador-linx').GerenciadorLinx;
var notifier = require('electron-notifications');
var DadosDB =  require('./dados.js').DadosDB;
//var notifier = require('node-notifier');

module.exports.Observador = {
	executar: function(path){
		let rd = readline.createInterface({
		        input: fs.createReadStream(path),
		        output: process.stdout,
		        console: false
		 });
		  let count = 0;
          global.mic = "";
		  rd.on('line', (line) => {
		  	count++;		  				  		
		  	if(count > global.ultimaLinha){
		  	 	global.ultimaLinha = count;
		  	//let dataLinha = GerenciadorLinx.extrairData(line);
		  	//if(dataLinha !== null && typeof(dataLinha) !== 'undefined' && dataLinha !== ''){
		  		//var dataAtual = new Date();
		  		//let arrayDataLinha = dataLinha.split(':');
		  		//let dataLinhaDate = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate(), arrayDataLinha[0], arrayDataLinha[1], arrayDataLinha[2], 0);
		  		 //var data1 = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate(),dataAtual.getHours(), dataAtual.getMinutes(), dataAtual.getSeconds());
    			 //var data2 = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate(), dataLinhaDate.getHours(), dataLinhaDate.getMinutes(), dataLinhaDate.getSeconds());
		  		 //if(data2 >= data1){
		  		 	if(global.isPrimeiraChecagem == false){
				  		let erroLinx = GerenciadorLinx.converterLinhaToErroLinx(line, count);
			            if(erroLinx != null){
			            	global.numErros++;
			                ManipuladorDom.criarLinhaErroLinx(erroLinx);
			                global.errosLinx.push(erroLinx);
			                $("#lblQuantidade").text(global.numErros);
			                DadosDB.isErroIgnorado(erroLinx).then(function(erro){
			                	console.log('Erro: ' + erro);
			                	if(erro == null){
			                		console.log('Irei notificar');
			                		//notifier.notify('Message');
				                	let notificador = notifier.notify(erroLinx.tipo + ": " + erroLinx.data, {
									  message: erroLinx.linha,
									  icon: __dirname + '/evil-cat.png',
									  buttons: ['Dispensar', 'Ignorar'],
									});
									notificador.on('buttonClicked', (text, buttonIndex, options) => {
									  if (text === 'Dispensar') {
									    notificador.close(); 
									  } else if(text == 'Ignorar'){
									  	DadosDB.salvarErroIgnorado(erroLinx);
									  	notificador.close();
									  }
									});
			                	}
			                });
				           }
			            }
			        }
	       		//}
		  	//}
		  });
        

		  let leitorFechado = new Promise(function(resolve, reject) {
		  	resolve(rd.on('close', function(){
					console.log("leitor fechado");
					if(global.isPrimeiraChecagem  == true){
						console.log("Mudei o estado da variavel");
						global.isPrimeiraChecagem  = false;
					}
			  	}));
		  });
		  	
 }
}