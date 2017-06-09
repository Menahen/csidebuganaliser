var ErroLinx = require("./erro-linx");

module.exports.GerenciadorLinx = {
    replaceAll: function (str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    },

    configurarLinha: function(linha){
         let regex = new RegExp('(\\[.*\\])','g');
         return linha.replace(regex, '');
    },

    extrairData: function(linha){
        let regex = new RegExp('([0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2})');
        let data = regex.exec(linha);
        if(data != null && data.length >= 0){
            return data[0] != null || typeof(data[0]) !== 'undefined' ? data[0] : "";
        }else{
            return "";
        }
    },

    extrairTipo: function(linha){
        let linhaRegex = this.replaceAll(linha, '\\.',' ');
        let regex = new RegExp('(\\w)*exception', 'i');
        let regexExececao = new RegExp('(\\w)*excecao(\\w)*', 'i');
        let erro = regexExececao.exec(linhaRegex);
         if(erro == null || typeof(erro) == 'undefined'){
            erro = regex.exec(linhaRegex);
         }
        erro = erro != null && (erro[0] != null || typeof(erro[0]) !== 'undefined') ? erro[0] : "";
        return erro;
    },

    extrairMic: function(linha){
        let regex = new RegExp('Mic(\\w)+');
        let mic = regex.exec(linha);
        if(mic != null && typeof(mic) !== 'undefined'){
             mic =  (mic[0] != null && typeof(mic[0]) !== 'undefined' && mic[0] != 'MicroOperacao') ? mic[0] : "";
        }else{
            mic = "";
        }
        return mic;
    },

     converterLinhaToErroLinx: function(linha, numLinha){
        let linhaOriginal = this.replaceAll(linha, /"/,'');
        linhaOriginal = this.replaceAll(linhaOriginal, "'",'');
        linhaOriginal = this.configurarLinha(linhaOriginal);
        let data = this.extrairData(linha);
        let tipo = String(this.extrairTipo(linha));
        let numLinhaOriginal = numLinha;
        if(tipo !== null && typeof(tipo) !== 'undefined' && tipo !== ""){
                    console.log(linhaOriginal);
            return new ErroLinx(numLinhaOriginal, data, tipo, linhaOriginal, global.mic);
        }else{
            return null;
        }
    },

    verificarFimMic: function(linha){
        if(linha.indexOf("Execution of object")  >= 0){
           global.mic = "";
        }
    }


}
