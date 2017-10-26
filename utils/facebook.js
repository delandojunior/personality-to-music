var FB = require('fb');

function getPosts(req, res, accesstoken){
  
  console.log("accesstoken: "+accesstoken);
  FB.setAccessToken(accesstoken); 
  
  FB.api('me', function (res) {
    if(!res || res.error) {
     console.log(!res ? 'error occurred' : res.error);
     return;
    }
    console.log(res.id);
    req.session.nameFB = res.name;
    req.session.save();
    console.log("aq: "+res.name);

  });
  
	FB.api('me', {fields :'id,name,posts,likes'}, function(response) {
					console.log(response.name);
	                //itens.contentItems = '';
	                //texto = '';
	                //qtdPosts = {"lidos":0, "utilizados":0};
	                var dataStr = "data:application/octet-stream;charset=utf-8," + encodeURIComponent(JSON.stringify(response));
				    p = response.posts.paging.next;
				    //getMessages(req, response.posts.data);
				    //index++;
            res.send(response);
				    //getPagePost(req,res,response,p);


    });
};

module.exports ={getPosts};