var watson = require('watson-developer-cloud');


function traduzir(texto, successCallback, errCallback){

    var language_translator = watson.language_translator({
        url: "https://gateway.watsonplatform.net/language-translator/api",
        username: 'e7e14a56-a328-4f73-b0f1-8c632668dd53',
        password: 'C6UA245K3JUs',
        version: 'v2'
    });
        language_translator.translate({
        text: texto,
        source: 'pt',
        target: 'en'
    }, function(err, translation) {
        if (err)
            errCallback(err)
        else
            var x = translation.translations[0].translation;
            successCallback(x)
    });

};
module.exports = {traduzir};