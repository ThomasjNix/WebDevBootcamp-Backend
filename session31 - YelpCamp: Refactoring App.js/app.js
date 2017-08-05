// Declarations
var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    app = express(),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seedDB = require('./seeds');
    
// Application setup
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

// Databse setup
mongoose.connect("mongodb://localhost/yelp_camp");

// Seed database
seedDB();

   

// Routing - Campgrounds
app.get('/', function(req,res){
    res.render('home');
});

app.get('/campgrounds', function(req,res){
   Campground.find({}, function(err, campGroundList){
       if (err){
           console.log(err);
       }else{
           res.render('campgrounds/index', {campGroundList : campGroundList});
       }
   });
});

app.get('/campgrounds/new', function(req,res){
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', function(req,res){
    
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
        if (err){
            console.log(err);
            res.redirect('/');
        }else{
            res.render('campgrounds/show',{campground: campground});
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

// Routing - Comments
app.get('/campgrounds/:id/comments/new', function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }else{
            res.render('comments/new', {campground:campground});
        }
    });
});
app.post('/campgrounds/:id/comments', function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, commentCreated){
                if (err){
                    console.log(err);
                }else{
                    campground.comments.push(commentCreated);
                    campground.save();
                    res.redirect('/campgrounds/'+req.params.id);
                }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started...");
});