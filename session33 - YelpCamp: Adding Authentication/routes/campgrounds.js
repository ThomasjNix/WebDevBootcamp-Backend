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

// Campgrounds EDIT
router.get('/:id/edit', checkCampgroundOwnership, function(req,res){
   Campground.findById(req.params.id, function(err, campground){
       if (err){
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
            console.log(err);
            res.redirect('/campgrounds');
        }else{
           res.redirect('/campgrounds/'+req.params.id);
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
            
            res.redirect('/campgrounds/'+campground._id);
        }
    });
    
});

// Campground DESTROY
router.delete("/:id", checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            console.log(err);
            res.redirect('/campgrounds');
        }else{
         res.redirect('/campgrounds');   
        }
    })
});

// Middleware 
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    };
    res.redirect('/login');
};

function checkCampgroundOwnership(req,res,next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if (err){
                console.log(err);
                res.redirect('/campgrounds');
            }else{
                console.log(req.user);
                if (campground.author.id.equals(req.user._id)){
                    return next();    
                }else{
                    res.redirect('back');
                }
            }
        });
    }else{
        res.redirect("back");
    }
};


module.exports = router;