var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

// Campgrounds INDEX
router.get('/', function(req,res){
   Campground.find({}, function(err, campGroundList){
       if (err){
           console.log(err);
       }else{
           res.render('campgrounds/index', {campGroundList : campGroundList});
       }
   });
});

// Campgrounds NEW
router.get('/new', isLoggedIn, function(req,res){
    res.render('campgrounds/new');
});

// Campgrounds SHOW
router.get('/:id', function(req,res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
        if (err){
            console.log(err);
            res.redirect('/');
        }else{
            res.render('campgrounds/show',{campground: campground});
        }
    });

});


// Campgrounds CREATE
router.post('/', isLoggedIn, function(req,res){
    var cName = req.body.campgroundName;
    var cImage = req.body.campgroundImage;
    var cDesc = req.body.campgroundDesc;
    Campground.create({
        name: cName,
        imgUrl: cImage,
        description: cDesc,
        author: {
            id: req.user._id,
            username: req.user.username
        }
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

// Middleware 
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    };
    res.redirect('/login');
};

module.exports = router;