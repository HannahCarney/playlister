var express = require('express');
var app = express();
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 3000));

app.get('/', function(request, response){
  response.render('index');
});

server.listen(app.get('port'), function(){
  console.log('Server running at ' + app.get('port'));
});

module.exports = server;
