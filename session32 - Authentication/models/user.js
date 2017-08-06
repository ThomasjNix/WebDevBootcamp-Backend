var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});


// This takes the package passport-local-mongoose and adds a bunch of methods that come with the package to the schema
// that are important for user authentication
userSchema.plugin(passportLocalMongoose);
var User = mongoose.model("User", userSchema);

module.exports = User;