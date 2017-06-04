const ErroLinx = require("./ErroLinx");
const TipoErro = require("./TipoErro").TipoErro;

module.exports.GerenciadorLinx = {
    replaceAll: function (str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
},

    extrairData: function(linha){
        let regex = new RegExp('([0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2})');
        let data = regex.exec(linha);
        if(data != null && data.length >= 0){
            return data[0];
        }
    },

    extrairTipo: function(linha){
        let linhaErro = linha.toLowerCase();
        let tipos = TipoErro.getTipos();
        for(tipo in tipos){
            if(linhaErro.indexOf(tipo) >= 0){
                let linhaRegex = this.replaceAll(linha, '\\.',' ');
                let regex = new RegExp('(\\w)*exception', 'i');
                let regexExececao = new RegExp('(\\w)*excecao(\\w)*', 'i');
                 let erro = regexExececao.exec(linhaRegex);
                 if(erro == null || typeof(erro) == 'undefined'){
                    erro = regex.exec(linhaRegex);
                 }
                if(erro != null && erro.length >= 0){
                    console.log('tamanho do erro: ' + erro.length);
                    console.log(erro);
                    return erro[0];
                }
            }
        }
    },

    extrairMic: function(linha){
        let regex = new RegExp('Mic(\w)+');
        let mic = regex.exec(linha);
        return mic;
    },

     converterLinhaToErroLinx: function(linha){
        let linhaOriginal = linha;
        let data = this.extrairData(linha);
        let tipo = this.extrairTipo(linha);
        let mic = this.extrairMic(linha);
        if(tipo != null){
            return new ErroLinx(data, tipo, linhaOriginal, mic);
        }
    }


}
