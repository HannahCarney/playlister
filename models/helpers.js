

exports.saveToDatabase = function(db, collectionName, collectionObject) {
  var collection = db.get(collectionName);
  collection.insert(collectionObject, function(err, doc) {
    if (err) {
      console.log("FAILED: write to db: " + collectionName);
    }
    else {
      console.log("SUCCESS: write to db: " + collectionName);
    }
  });
};

exports.readFromDatabase = function(db, collectionName, matcher, fields, callback) {
  var collection = db.get(collectionName);
  var options = {fields : fields, limit : 1, sort : {$natural : -1}}
  collection.find(matcher, options, callback);
};

// collection.find({ pgEmail: pgEmail, ppPartyDate: todaysDate },
//                 { fields : { ppPartyName: 1, _id: 0},
//                   limit : 1,
//                   sort : {$natural : -1}
//                 }
//   , retrieveSpotifyID);
