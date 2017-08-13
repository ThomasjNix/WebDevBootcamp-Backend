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
    methodOverride = require('method-override'),
    User = require('./models/user'),
    campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    authRoutes = require('./routes/index'),
    flash = require('connect-flash');
    
// Application setup
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

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

// This will make req.user available to every single route
// This is a middleware that will be applied to every route because of app.use
app.use(function(req,res,next){
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Routing requirements 
app.get('/', function(req,res){
    res.render('home');
});
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(authRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started...");
});