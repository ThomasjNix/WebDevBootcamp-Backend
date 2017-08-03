// Declarations
var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    app = express(),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    seedDB = require('./seeds');
    
// Application setup
app.set('view engine','ejs');
app.use(express.static('/public'));
app.use(bodyParser.urlencoded({extended:true}));

// Databse setup
mongoose.connect("mongodb://localhost/yelp_camp");

// Seed database
seedDB();

   

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
    
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
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