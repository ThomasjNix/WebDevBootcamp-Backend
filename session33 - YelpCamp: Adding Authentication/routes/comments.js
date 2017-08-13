var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var isLoggedIn = require('../middleware').isLoggedIn;
var checkCommentOwnership = require('../middleware').checkCommentOwnership;

// Comments NEW
router.get('/new', isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
            req.flash("error", "Unable to find or update campground.");
            res.redirect('/');
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
            req.flash("error", "Unable to find or update campground.");
            res.redirect('/');
        }else{
            Comment.create(req.body.comment, function(err, commentCreated){
                if (err){
                    console.log(err);
                    req.flash("error","Unable to create comment.");
                    res.redirect("/campgrounds/"+req.params.id);
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


// Comments EDIT

router.get('/:commentId/edit', checkCommentOwnership, function(req,res){
   Comment.findById(req.params.commentId, function(err, foundComment){
       if (err){
           console.log(err);
           req.flash("error", "Unable to find comment.");
           res.redirect('/campgrounds/'+req.params.id);
       }else{
           res.render('comments/edit',{campground_id: req.params.id, comment: foundComment});
       }
   });
});

// Comments UPDATE 

router.put('/:commentId', checkCommentOwnership, function(req,res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, foundComment){
        if (err){
            console.log(err);
            req.flash("error", "Unable to find or update comment.");
            res.redirect('/campgrounds/'+req.params.id);
        }else{
            req.flash("success", "Comment updated successfully.");
            res.redirect('/campgrounds/'+req.params.id);
        }
   });
});

// Comments DELETE

router.delete('/:commentId', checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if (err){
           console.log(err);
           req.flash("error", "Unable to find or remove comment.");
           res.redirect('/campgrounds/'+req.params.id);
        }else{
          req.flash("success", "Comment removed successfully.");
          res.redirect('/campgrounds/'+req.params.id);
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