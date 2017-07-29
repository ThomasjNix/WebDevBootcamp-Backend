var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();


// This is only for demonstration purposes, soon we will get into databases
var randomArr = [
    {name: 'SomeCampgroundName1', img: 'http://visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg'},    
    {name: 'SomeCampgroundName2', img: 'http://visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg'},
    {name: 'SomeCampgroundName3', img: 'http://visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg'},
    {name: 'SomeCampgroundName4', img: 'http://visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg'},
    {name: 'SomeCampgroundName5', img: 'http://visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg'}
];

app.set('view engine','ejs');
app.use(express.static('/public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req,res){
    res.render('index');
});

app.get('/campgrounds', function(req,res){
    res.render('campgrounds', {
        campGroundList : randomArr
    });
});

app.get('/campgrounds/new', function(req,res){
    res.render('new-campground');
});


// You can and should name post routes the same as the get route it comes from, following REST convention (more on that later)
app.post('/campgrounds', function(req,res){
    var cName = req.body.campgroundName;
    var cImage = req.body.campgroundImage;
    var newCampground = {name: cName, img: cImage};
    randomArr.push(newCampground);
    res.redirect('/');
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started...");
});