var DadosDB =  require('./js/dados.js').DadosDB;
var ManipuladorDom =  require('./js/manipulador-dom.js').ManipuladorDOM;

$(document).ready(function(){
	 DadosDB.buscarErrosIgnorados().then(function(items){
	 	if(items != null && items !== 'undefined'){
	 		for(let i = 0; i < items.length; i++){
	 			ManipuladorDom.criarLinhaErroIgnorado(items[i], i);
	 		}
	 	}
	});
});

function removerLinha(erro, id){
	DadosDB.removerErro(erro).then(() => {
		$(id).remove();	
	});
	
}
