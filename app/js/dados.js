var Db = require('tingodb')().Db;
var ErroIgnorado = require('./erro-ignorado.js').ErroIgnorado;
 
var db = new Db('./app/db', {});

module.exports.DadosDB = {
	salvarCaminho: function(path){
		var collection = db.collection("caminho-arquivo");

		collection.findOne({_id:1}, function(err, item) {
		  	if(item != null && item !== 'undefined'){
		  		collection.update({_id:{$eq:'1'}}, {$set: {caminho: path}}, function(err, result){
		  			console.log('Atualizado');

		  		});
		  	}else{
		  		collection.insert([{_id: 1,caminho:path}], {w:1}, function(err, result){
		  			console.log('Inserir');
		  		});
		  	}
		 });
	},
	buscarCaminho: function () {
			return new Promise(function(resolve, reject) {
			var collection = db.collection("caminho-arquivo");
			collection.findOne({_id:1}, function(err, item) {
			  	if(item != null && item !== 'undefined'){
			  		resolve(item);
			  	}
			});
		});
	},
	salvarErroIgnorado: function(erroLinx){
		return new Promise(function(resolve, reject){
			var collection = db.collection("erros-ignorados");
			collection.insert([erroLinx], {w:1}, function(err, result){
				console.log("Inserido");
			});
		});
	},
	buscarErrosIgnorados: function(callback){
		return new Promise(function(resolve, reject){
			var collection = db.collection("erros-ignorados");
			collection.find().toArray(function(err, items){
				resolve(items);
			});
		});
	},
	removerErro: function(erro){
		return new Promise(function(resolve, reject){
			var collection = db.collection("erros-ignorados");
			resolve(collection.remove({mic: erro.mic, linha: erro.linha, tipo: erro.tipo}));
		});
	},
	isErroIgnorado: function(erroLinx){
					console.log("linha: " + erroLinx.linha);
			console.log("mic: " + erroLinx.mic);
		return new Promise(function(resolve, reject){
			console.log("Verificando erro");
			var collection = db.collection("erros-ignorados");
			collection.findOne({linha: erroLinx.linha, mic: erroLinx.mic}, function(err, item) {
			  	if(item != null && item !== 'undefined'){
			  		console.log("Erro ignorado: " + item);
			  		resolve(item);
			  	}else{
			  		console.log("Erro não encontrado: " + item);
			  		resolve(null);
			  	}
			});
		});
	}

}