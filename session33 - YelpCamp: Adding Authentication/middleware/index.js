var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middlewareObject = {};

middlewareObject.isLoggedIn = function(req,res,next){
    if (req.isAuthenticated()){
        return next();
    };
    req.flash("error", "Please log in to continue.");
    res.redirect('/login');
};

middlewareObject.checkCampgroundOwnership = function(req,res,next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if (err){
                console.log(err);
                req.flash("error", "Unable to find campground.");
                res.redirect('/campgrounds');
            }else{
                console.log(req.user);
                if (campground.author.id.equals(req.user._id)){
                    return next();    
                }else{
                    res.redirect('back');
                    req.flash("error", "Unauthorized access.");
                }
            }
        });
    }else{
        res.redirect("back");
        req.flash("error", "Please log in to continue.");
    }
}

middlewareObject.checkCommentOwnership = function(req,res,next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, comment){
            if (err){
                console.log(err);
                req.flash("error", "Unable to find comment.");
                res.redirect('/campgrounds');
            }else{
                console.log(req.user);
                if (comment.author.id.equals(req.user._id)){
                    return next();    
                }else{
                    res.redirect('back');
                    req.flash("error", "Unauthorized access.");
                }
            }
        });
    }else{
        res.redirect("back");
        req.flash("error", "Please log in to continue.");
    }
};
    
    
module.exports = middlewareObject;