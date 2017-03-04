var dbConnect = require('./dbConnect');

exports.up = function (next) {
  // Wait for mongodb Driver to be connected and get the mongodb object
  dbConnect.mongodb.then(function (mongodb) {

    // get the collection needed
    var users = mongodb.collection('www_user');

    //execute the query and get a cursor
    var userCursor = users.find({ name: { $exists: true } });

    // loop through the found docs
    userCursor.each(function (err, doc) {
      if (err) {
        console.log(err);
      } else {

        // if it's the last doc null will be returned
        // close the mongodb connection
        // and finish the task
        if (doc === null) {
          mongodb.close();
          next();
        } else {
          // Do what you need to do

          var indexOfSpace = doc.name.indexOf(' ');
          var firstName = doc.name.substr(0, indexOfSpace);
          var lastName = doc.name.substr(indexOfSpace + 1, doc.name.length -1);

          if (indexOfSpace === -1) {
            firstName = doc.name;
            lastName = '';
          }

          users.update(doc, { $set: { FirstName: firstName, LastName: lastName }, $unset: { name: '' } });
        }
      }
    });
  });
};

exports.down = function (next) {
  console.log('001-update-user-name-first-last-mongodb does not need down migration');
  next();
};
