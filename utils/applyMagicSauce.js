var request = require("request");

function getPersonality (res, token, userLikes) {
  console.log('token', token);
  console.log('curtidas' , userLikes);
  request.post(
    { headers: {'Content-type': 'application/json', 'Accept': 'application/json', 'X-Auth-Token': token},
      url:'https://api.applymagicsauce.com/like_ids?interpretations=true&contributors=true',
      body: JSON.stringify(userLikes)
    }, 
      
    function(err,httpResponse,body){
      console.log(httpResponse.statusCode);
      if (err){
        console.log('error', err);
        res.send(err);
      }else{
        var response = JSON.parse(body);
        console.log('token', response);
        res.send(response);
      }
    });

}

function auth(res, curtidas){
  request.post(
    { headers: {'Content-type': 'application/json', 'Accept': 'application/json'},
      url:'https://api.applymagicsauce.com/auth',
      body: JSON.stringify({ 'customer_id': 3360,'api_key': '2vm8aqjfhnrfkbf1m01lg4j21m'})
    }, 
      
    function(err,httpResponse,body){
      console.log(httpResponse.statusCode);
      if (err){
        console.log('error', err);
        
      }else{
        var response = JSON.parse(body);
        getPersonality(res, response.token, curtidas);
        
      }
    })

}

module.exports ={getPersonality, auth};