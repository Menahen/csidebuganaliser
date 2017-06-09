module.exports.GeradorFlow = {

	gerarFlowAnalisador: function(line){

		if(line.indexOf("STATEMACHINE (INFO)")  >= 0){
			if(line.indexOf("STATEMACHINE (INFO) Next object to execute")  >= 0){
	 			if(global.key == 0){
	 				parent = global.key;
	 			}else{
	 				parent = global.key - 1;
	 			}
		 	let indexName = line.indexOf("Mic");
		 	if(indexName != null && indexName > 0){
			 	let name = line.substring(indexName).trim();
			 	let graph = {key: global.key, text: name};
			 	global.mics.push(graph);
			 }
		 	global.key = global.key + 1;
			} else if(line.indexOf("Execution of object")  >= 0){
				let resultIndex = line.indexOf('->');
				let result = line.substring(resultIndex + 2).trim();
				let link = {from: global.resultPai, to:global.resultFilho, text: result};
				global.resultPai++;
				global.resultFilho++;
				console.log(link);
				global.links.push(link);
			}
  		}
	}
}