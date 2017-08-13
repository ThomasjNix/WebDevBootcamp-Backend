var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var isLoggedIn = require('../middleware').isLoggedIn;
var checkCampgroundOwnership = require('../middleware').checkCampgroundOwnership;

// Campgrounds INDEX
router.get('/', function(req,res){
   Campground.find({}, function(err, campGroundList){
       if (err){
           req.flash("error", "Unable to find campgrounds.");
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
            req.flash("error", "Unable to find campground.");
            console.log(err);
            res.redirect('/');
        }else{
            res.render('campgrounds/show',{campground: campground});
        }
    });

});

// Campgrounds EDIT
router.get('/:id/edit', checkCampgroundOwnership, function(req,res){
   Campground.findById(req.params.id, function(err, campground){
       if (err){
           req.flash("error", "Unable to find campground.");
           console.log(err);
           res.redirect('/campgrounds/'+req.params.id);
       }else{
           res.render('campgrounds/edit', {campground: campground});
       }
   })
});

// Campgrounds UPDATE
router.put('/:id', checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,campground){
        if (err){
            req.flash("error", "Unable to find or update campground.");
            console.log(err);
            res.redirect('/campgrounds');
        }else{
            req.flash("success", "Campground updated successfully.");
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

// Campgrounds CREATE
router.post('/', isLoggedIn, function(req,res){
    Campground.create(req.body.campground, function(err, campground){
        if (err){
            console.log(err);
            req.flash("error", "Unable to create campground.");
            res.redirect('/campgrounds/'+campground._id);
        }else{
            campground.author.id = req.user._id;
            campground.author.username = req.user.username;
            campground.save();
            console.log("Addition successful, added: " + campground);
            req.flash("success", "Campground created successfully.");
            res.redirect('/campgrounds/'+campground._id);
        }
    });
    
});

// Campground DESTROY
router.delete("/:id", checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            console.log(err);
            req.flash("error", "Unable to find or remove campground");
            res.redirect('/campgrounds');
        }else{
            req.flash("success", "Campground deleted successfully.");
            res.redirect('/campgrounds');   
        }
    })
});


module.exports = router;