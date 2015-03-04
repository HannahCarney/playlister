//Database set-up
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/playlister';
var monk = require('monk');
var db = monk(mongoUri);

exports.saveToDatabase = function(collectionName, collectionObject) {
  var collection = db.get(collectionName);
  collection.insert(collectionObject, function(err) {
    if (err) {
      console.log("FAILED: write to db: " + collectionName);
    }
    else {
      console.log("SUCCESS: write to db: " + collectionName);
    }
  });
};

exports.readFromDatabase = function(collectionName, matcher, fields, callback) {
  console.log('start read from db');
  var collection = db.get(collectionName);
  var options = {fields : fields, limit : 1, sort : {$natural : -1}};
  collection.find(matcher, options, callback);
};

exports.errorHandling = function(err) {
  if (err) {
    console.log(err);
  }
};
