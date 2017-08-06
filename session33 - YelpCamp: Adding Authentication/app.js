// Declarations
var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    app = express(),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seedDB = require('./seeds'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user');
    
// Application setup
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

// Databse setup
mongoose.connect("mongodb://localhost/yelp_camp");

// Authentication setup
app.use(require('express-session')({
    secret: "This is a secret, it could be anything",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); // Create a new local strategy using the User.authenticate method that comes from passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Seed database
seedDB();

// This will make req.user available to every single route
// This is a middleware that will be applied to every route because of app.use
app.use(function(req,res,next){
    res.locals.user = req.user;
    next();
});

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
app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }else{
            res.render('comments/new', {campground:campground});
        }
    });
});
app.post('/campgrounds/:id/comments', isLoggedIn,  function(req,res){
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


// Routing - Authentication [Register]
app.get('/register', function(req,res){
    res.render('auth/register');
});

app.post('/register', function(req,res){
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

// Routing - Authentication [Login]
app.get('/login', function(req,res){
    res.render('auth/login');
});

app.post('/login', passport.authenticate('local',{
    successRedirect: '/campgrounds',
    failureRedirect: 'auth/login'
    }), function(req,res){
});

// Routing - Authentication [L:ogout]
app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/campgrounds');
});

// Middleware 
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    };
    res.redirect('/login');
};

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started...");
});