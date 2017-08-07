var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Auth register GET
router.get('/register', function(req,res){
    res.render('auth/register');
});

// Auth register POST
router.post('/register', function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.redirect('auth/register');
        }else{
            passport.authenticate('local')(req,res,function(){
                res.redirect('/campgrounds');
            });
        }
    });
});

// Auth login GET
router.get('/login', function(req,res){
    res.render('auth/login');
});

// Auth login POST
router.post('/login', passport.authenticate('local',{
    successRedirect: '/campgrounds',
    failureRedirect: 'auth/login'
    }), function(req,res){
});

// Auth logout
router.get('/logout', function(req,res){
    req.logout();
    res.redirect('/campgrounds');
});


module.exports = router;