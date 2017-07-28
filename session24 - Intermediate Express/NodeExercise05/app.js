var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

var friends = []; // This isn't the recommended way to do this, but it's for the purpose of demonstrating POST requests, and will be addressed in later videos.

app.get('/', function(req,res){
    res.render('home');
});

app.get('/friends', function(req,res){
    res.render('friends', {
        friends: friends
    });
});

app.post('/addFriend', function(req, res){
    var newFriend = req.body.name;
    friends.push(newFriend);
    res.redirect('/friends');
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server started...');
});