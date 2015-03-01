

exports.saveToDatabase = function(db, collectionName, collectionObject, successMethod) {
  var collection = db.get(collectionName);
  collection.insert(collectionObject, function(err, doc) {
    if (err) {
      console.log("FAILED: write to db: " + collectionName);
    }
    else {
      console.log("SUCCESS: write to db" + collectionName);
      successMethod;
    }
  });
};
