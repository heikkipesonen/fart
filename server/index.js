var restify = require('restify');
var server = restify.createServer();

server.use(restify.bodyParser());
server.use(restify.CORS());

server.use(
  function crossOrigin(req,res,next){
    res.charSet('utf-8');
    return next();
  }
);

function respond(req, res, next) {
  res.contentType = 'json';
  res.send({hello: req.params});
  next();
}


var item = require('./item');


server.get('/item', item.list);
server.post('/item', item.add);
server.post('/item/:id', item.addChild);
server.del('/item/:id', item.remove);
server.get('/item/:id', item.get);
server.put('/item/:id', item.update);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
