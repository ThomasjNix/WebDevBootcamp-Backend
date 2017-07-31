
// Declarations
var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    app = express(),
    mongoose = require('mongoose');




// Application setup
app.set('view engine','ejs');
app.use(express.static('/public'));
app.use(bodyParser.urlencoded({extended:true}));


// Databse setup
mongoose.connect("mongodb://localhost/yelp_camp");

    //Schema
    var campgroundSchema = new mongoose.Schema({
        name: String,
        imgUrl: String,
        description: String
    });
    var Campground = mongoose.model("Campground", campgroundSchema);

// Routing
app.get('/', function(req,res){
    res.render('home');
});

app.get('/campgrounds', function(req,res){
   Campground.find({}, function(err, campGroundList){
       if (err){
           console.log(err);
       }else{
           res.render('index', {campGroundList : campGroundList});
       }
   });
});

app.get('/campgrounds/new', function(req,res){
    res.render('new');
});

app.get('/campgrounds/:id', function(req,res){
    var id = req.params.id;
    Campground.findById(id, function(err, campground){
        if (err){
            console.log(err);
            res.redirect('/');
        }else{
            res.render('show',{campground: campground});
        }
    });

});


// You can and should name post routes the same as the get route it comes from, following REST convention (more on that later)
app.post('/campgrounds', function(req,res){
    var cName = req.body.campgroundName;
    var cImage = req.body.campgroundImage;
    var cDesc = req.body.campgroundDesc;
    Campground.create({
        name: cName,
        imgUrl: cImage,
        description: cDesc
    }, function(err, campground){
        if (err){
            console.log(err);
        }else{
            console.log("Addition successful, added:");
            console.log(campground);
        }
    });
    res.redirect('/');
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started...");
});