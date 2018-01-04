var request = require("request");
var db = require("./db.js");

function getPersonalityLikes (res, token, userLikes, name) {
  console.log('token get personality likes', token);
  console.log('lista de likes ', userLikes);
  //console.log('curtidas' , userLikes);
  request.post(
    { headers: {'Content-type': 'application/json', 'Accept': 'application/json', 'X-Auth-Token': token},
      url:'https://api.applymagicsauce.com/like_ids?interpretations=true&contributors=true',
      body: JSON.stringify(userLikes)
    }, 
      
    function(err,httpResponse,body){
      console.log(httpResponse.statusCode);
      if(httpResponse.statusCode == 204){
        console.log('insuficiente likes');
        var Users = db.Mongoose.model('usercollection', db.UserSchema, 'usersData');
        var query = { _id: name}
          Users.findOneAndUpdate(query, { _id: name, personalityLikes: {"input_used" : 0}, likes: userLikes}, {upsert:true}, function(err, doc){
            if (err) return res.send(500, { error: err });
            console.log("Salvando personalidade dos likes");
            //return res.redirect('/logadoFB');
        });
      }
      if (err){
        console.log('error', err);
        res.send(err);
      }else{
        var response = JSON.parse(body);
        console.log('token', response);
        var Users = db.Mongoose.model('usercollection', db.UserSchema, 'usersData');

        var query = { _id: name}
          Users.findOneAndUpdate(query, { _id: name, personalityLikes: response, likes: userLikes}, {upsert:true}, function(err, doc){
            if (err) return res.send(500, { error: err });
            console.log("Salvando personalidade dos likes");
            //return res.redirect('/logadoFB');
        });
        //res.send(response);
      }
    });

}


function getPersonalityPosts (res, token, posts, likes, name) {
  console.log('token get personality posts', token);
  //console.log('curtidas' , posts);
  request.post(
    { headers: {'Content-type': 'application/json', 'Accept': 'application/json', 'X-Auth-Token': token},
      url:'https://api.applymagicsauce.com/text?interpretations=true&source=STATUS_UPDATE',
      body: JSON.stringify(posts)
    }, 
      
    function(err,httpResponse,body){
      console.log(httpResponse.statusCode);
      if (err){
        console.log('error', err);
        res.send(err);
      }else{
        var response = JSON.parse(body);
        console.log('token', response);
        var Users = db.Mongoose.model('usercollection', db.UserSchema, 'usersData');

        var query = { _id: name}
          Users.findOneAndUpdate(query, { _id: name, personalityPosts: response}, {upsert:true}, function(err, doc){
            if (err) return res.send(500, { error: err });
            console.log('salvando personalidade dos posts ...');
            return getPersonalityLikes(res, token, likes, name);
        });
        //res.send(response);
      }
    });

}

function auth(res, curtidas, posts,  idFB){
  request.post(
    { headers: {'Content-type': 'application/json', 'Accept': 'application/json'},
      url:'https://api.applymagicsauce.com/auth',
      body: JSON.stringify({ 'customer_id': 3541,'api_key': 'dogvqne35lrneu69v2rhnkp9q3'})
    }, 
      
    function(err,httpResponse,body){
      console.log(httpResponse.statusCode);
      if (err){
        console.log('error', err);
        
      }else{
        var response = JSON.parse(body);
        //console.log(posts);
        //getPersonalityLikes(res, response.token, curtidas, idFB);
        getPersonalityPosts(res, response.token, posts, curtidas, idFB);
        
      }
    })

}

module.exports ={getPersonalityLikes, auth, getPersonalityPosts};