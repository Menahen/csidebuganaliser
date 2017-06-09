var fs = require('fs');
var readline = require('readline');
var GerenciadorLinx = require('./gerenciador-linx').GerenciadorLinx;
var GeradorFlow = require('./gerador-flow').GeradorFlow;
var rlp = require('readline-promise');

module.exports.Analisador = {

    lerArquivo: function(path) {
        let rd = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        console: false
     });
        
        let count = 0;
        global.mics = [];
        global.links = [];
        global.key = 0;
        global.resultPai = 0;
        global.resultFilho = 1; 
        global.mic = "";
        global.numErros = 0;
        rd.on('line', (line) => {
            count++;
            let micLinha = GerenciadorLinx.extrairMic(line);
            if(micLinha != null && typeof(micLinha) !== 'undefined' && micLinha !== ''){
                global.mic = micLinha;
            }
            GerenciadorLinx.verificarFimMic(line);
            let erroLinx = GerenciadorLinx.converterLinhaToErroLinx(line, count);
            GeradorFlow.gerarFlowAnalisador(line);
            if(erroLinx != null){
                global.numErros++;
                ManipuladorDom.criarLinhaErroLinx(erroLinx);
                global.errosLinx.push(erroLinx);
                $("#lblQuantidade").text(global.numErros);
            }
        });

    },

    lerArquivoDois: function(path){
        return new Promise(function(resolve, reject) {
        global.path = "";
        let rd = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        console: false
     });
        
        let count = 0;
        var arrayErrosLinx = [];
        rd.on('line', function(line)  {
            count++;
            let erroLinx = GerenciadorLinx.converterLinhaToErroLinx(line, count);
            GeradorFlow.gerarFlowAnalisador(line);
            if(erroLinx != null){
                arrayErrosLinx.push(erroLinx);
            }
        });

        rd.on('close', function() {
            resolve(arrayErrosLinx);
        });
     });
    }
}

