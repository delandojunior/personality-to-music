var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var tradutor = require("./translate.js");
var db = require("./db.js");

var personality_insights = new PersonalityInsightsV3({
	url: "https://gateway.watsonplatform.net/personality-insights/api",
	username: 'd59aa588-14df-4042-80d0-58e9783b12d9',
	password: '1hTeuWML3aZY',
	version_date: '2017-10-13'
});

function personalidade(req,res,itens, name){
	console.log('personalidade ',itens);
	var texto_traduzido = tradutor.traduzir(itens, 
	function(textoTraduzido) {

		console.log(textoTraduzido);
		var params = {
			// Get the content items from the JSON file.
			text: textoTraduzido,
			//content_items: itens.contentItems,
			consumption_preferences: false,
			raw_scores: true,
			headers: {
				'accept-language': 'pt-br',
				//'content-type' : 'application/json',
				'content-language' : 'en',
				'accept': 'application/json'
			}
		};


		personality_insights.profile(params, function(error, response) {
			
			if (error){
				console.log('Error123:', error);
				res.send(error);



			}else{
				console.log("resposta personality insights" + response);

				var Users = db.Mongoose.model('usercollection', db.UserSchema, 'usersData');

				var query = { _id: name}
			    Users.findOneAndUpdate(query, { _id: name, personality: response}, {upsert:true}, function(err, doc){
				    if (err) return res.send(500, { error: err });
				    return res.redirect("/");
				});

			    // var user = new Users({ _id: name, personality: response });
			    // user.save(function (err) {
			    //     if (err) {
			    //         console.log("Error! " + err.message);
			    //         return err;
			    //     }
			    //     else {
			    //         console.log("Post saved");
			    //         //res.redirect("userlist");
			    //     }
    			// });
				
			}
			
			
			}
		);
	},  function(err) {
			console.log('erro tranlate ', err);
	 		res.send(err);
		});
};

module.exports = {personalidade};