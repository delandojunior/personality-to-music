var FB = require('fb');
var request = require("request");

//variáveis auxiliares.
var p = null;
texto = '';
var allLikes = [];
qtdPosts = {"lidos":null, "utilizados":null};
var index = 0;
var indexLike = 0;

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
            nextPageLikes = response.likes.paging.next;
				    getMessages(req, response.posts.data);
            getLikes(response.likes.data);
				    index++;
            //res.send(response);
				    getPagePost(req,res,response,p);
            getPageLike(req,res,response, nextPageLikes);


    });
};

    function getLikes(listalikes){
      //console.log(listalikes);
      listalikes.forEach( function(element, index) {
        allLikes.push(element);
      });
      console.log('likes ', allLikes.length);
    }

    function getPageLike(req,res,response, nextPage){
      request({
          url: nextPage,
          json: true
      }, function (error, responsePage, body) {
          //console.log("status code ",body.paging);
          if (!error && responsePage.statusCode === 200) {
              //console.log(body) // Print the json responsePage
              getLikes(body.data);
              indexLike++;
              if(body.paging.next){
                nextPage = body.paging.next;
                //console.log('Proxima página de likes', nextPage);
                //console.log(body);
                //console.log('Total de caracteres ', texto.length);
                //qtdPosts.lidos = qtdPosts.lidos + Number(body.data.length);
                getPageLike(req,res,body,nextPage);
              }
              else{
                  //res.render('/pi/match', { req: req.user, posts:JSON.stringify(itens)  });
                  console.log('Entrou no redirecionamento do likes');
                  //console.log(itens);
                  //req.session.itens=itens.contentItems;
                  req.session.likes = allLikes;
                  //req.session.qtdPosts = qtdPosts;
                  //req.session.save();
                  console.log(allLikes.length);
                  //res.send(texto);

                  //pi.personalidade(req,res,req.session.itens);
                  //res.redirect("/pi/match");
                  //res.send(allLikes);
              }
          }
      });
      
    
  }

    function getMessages(req, posts){
      
      for(var i=0;i<posts.length;i++){
            if(posts[i].message){
                //var objeto = {};
                //objeto.content=posts[i].message;
                //objeto.language = "es";
                //console.log('post ', posts[i].message);
                //itens.contentItems.
                texto = texto + posts[i].message + ". ";
                //console.log('entrou aqui?');
                qtdPosts.utilizados++;
                //console.log(qtdPosts);

            }
      }
      //console.log('dentro do get message', texto);
      //req.session.itens=itens;
      req.session.itens=texto;
      
  }
  function getPagePost(req,res,response,p){
      request({
          url: p,
          json: true
      }, function (error, response, body) {

          if (!error && response.statusCode === 200) {
              //console.log(body) // Print the json response
              getMessages(req, body.data);
              index++;
              if(body.paging){
                p = body.paging.next;
                console.log('Proxima página de posts ', texto.length);
                //console.log(body);
                //console.log('Total de caracteres ', texto.length);
                qtdPosts.lidos = qtdPosts.lidos + Number(body.data.length);
                getPagePost(req,res,body,p);
              }
              else{
                  //res.render('/pi/match', { req: req.user, posts:JSON.stringify(itens)  });
                  console.log('Entrou no redirecionamento do post');
                  //console.log(itens);
                  //req.session.itens=itens.contentItems;
                  req.session.itens.texto=texto;
                  req.session.qtdPosts = qtdPosts;
                  //req.session.save();
                  console.log(qtdPosts.lidos, qtdPosts.utilizados);
                  res.send({"texto":texto,"likes":allLikes});

                  //pi.personalidade(req,res,req.session.itens);
                  //res.redirect("/pi/match");
                  
              }
          }
      });
      
    
  }

module.exports ={getPosts};