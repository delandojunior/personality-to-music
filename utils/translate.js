var watson = require('watson-developer-cloud');


function traduzir(texto, successCallback, errCallback){

    var language_translator = watson.language_translator({
        url: "https://gateway.watsonplatform.net/language-translator/api",
        username: '7c128bfe-9f08-4afb-8231-ed69bb4182ac',
        password: 'CQVZE2QmihTG',
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