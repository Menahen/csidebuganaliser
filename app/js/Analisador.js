const fs = require('fs');
const readline = require('readline');
const GerenciadorLinx = require('./GerenciadorLinx').GerenciadorLinx;

module.exports.Analisador = {
    lerArquivoDois: function(path) {
        let rd = readline.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        console: false
    });
        let count = 0;
        rd.on('line', function(line) {
            let erroLinx = GerenciadorLinx.converterLinhaToErroLinx(line);
            if(erroLinx != null){
                console.log('Objeto convertido: ' + JSON.stringify(erroLinx));
            }
        });
    }
}

