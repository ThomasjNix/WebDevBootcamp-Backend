var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');

// Comments NEW
router.get('/new', isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }else{
            res.render('comments/new', {campground:campground});
        }
    });
});

// Comments CREATE
router.post('/', isLoggedIn,  function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, commentCreated){
                if (err){
                    console.log(err);
                }else{
                    //Add username and ID to comment
                    commentCreated.author.id = req.user._id;
                    commentCreated.author.username = req.user.username;
                    //Save comment
                    commentCreated.save();
                    //Push to campground comments, create
                    campground.comments.push(commentCreated);
                    campground.save();
                    res.redirect('/campgrounds/'+req.params.id);
                }
            });
        }
    });
});

// Middleware 
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    };
    res.redirect('/login');
};

module.exports = router;