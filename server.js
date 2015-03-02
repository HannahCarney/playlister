// Server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
// Dependencies
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
// Database
var mongo = require('mongodb'); //is this required, does monk do it anyway?
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/playlister';
var monk = require('monk');
var db = monk(mongoUri);
//router
var partyGoer = require('./routes/partyGoer');
var partyPlanner = require('./routes/partyPlanner');
var mobileApp = require('./routes/mobileApp');
// Server Set-up
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))
.use(cookieParser());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(expressLayouts);
// Make our db accessible to our router
app.use(function(req,res,next){
req.db = db;
next();
});
app.use('/partygoer', partyGoer);
app.use('/partyplanner', partyPlanner);
app.use('/mobileapp', mobileApp);
app.set('port', (process.env.PORT || 3000));
// // Routes
app.get('/', function(req, res){
res.render('index');
});
server.listen(app.get('port'), function(){
console.log('Server running at ' + app.get('port'));
});
module.exports = server;