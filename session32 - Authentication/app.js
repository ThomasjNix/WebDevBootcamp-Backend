// Requires 
var express = require('express'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user');
    
    
    
    
    
// App setup
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));





// Database setup
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/auth_demo');





// PASSPORT SETUP 
// require express-session inline and pass in 3 arguments:
/*
Secret: Can be anything, used to security purposes (encoding and decoding sessions). 
Resave: Boolean, must be required (not sure what it does)
saveUninitialized: Boolean, must be required (not sure what it does) 
*/
app.use(require('express-session')({
    secret: "This is a secret, it could be anything",
    resave: false,
    saveUninitialized: false
}));

// This code sets passport up to work in the application
// These two lines are needed whenever passport is used.
// These lines MUST come after telling the app to use express-session!
app.use(passport.initialize());
app.use(passport.session());


/*
These two methods are very important for passport
They are responsible for reading the session information and encoding/decoding it so it can be 
used securely

serialize = encode, deserialize = deserialize

by using UserSchema.plugin(passportLocalMongoose) tothe User schema, the methods serializeUser and deserializeUser 
have been added automatically
*/
passport.use(new LocalStrategy(User.authenticate())); // Create a new local strategy using the User.authenticate method that comes from passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





// Applications Routes
app.get('/', function(req,res){
    res.render('home');
});

// Use middleware to check if the user is logged in
app.get('/secret', isLoggedIn, function(req,res){
    res.render('secret');
});

// Authentication (login/register) routes

app.get('/register', function(req,res){
    res.render('register')
}); // show sign up form

app.post('/register', function(req,res){
    var username = req.body.username,
        password = req.body.password;
    
    /*
      The password isn't passed as a field for the new User because the 
      password isn't saved to the database. 
      
      Instead, password is passed as the second argument to User.register 
      and it will hash the password and store that in the database.
      
      The callback function has the arguments of error and the user that is created.
    */
    
    
    User.register(new User({
        username: username
    }), password, function(err, user){
        if (err){
            // If there is an error, render the register page again
            console.log(err);
            return res.render('register');
        }else{
            console.log(user);
            
            /*
                This runs once the user is created and there is not an error.
                passport.authenticate will log the user in, it is being told to use the local strategy 
                    (It will also take care of everything in the session, store the info, and run the serializeUser method)
                    => If a different strategy is needed, it could be changed with appropriate tweaks
            */
            passport.authenticate('local')(req,res,function(){
                res.render('secret');
            });
        }
    });
}); // Handle register POST

app.get('/login', function(req,res){
    res.render('login');
});

// Login authentication takes a second argument as the .post function, 
// passport.authenticate("<strategy", {successRedirect: "<success redirect route>", failureRedirect: "<failure redirect route>"})
// This is known as a middleware.
    // => Middleware is code that runs before the final callback. It runs middleware immediately once the route is triggered. 
    // They sit between the beginning and end of the route.
app.post('/login',passport.authenticate("local", {
    successRedirect: '/secret',
    failureRedirect: '/login'
    }), function(req,res){
    // Leave empty for now
});


app.get('/logout', function(req,res){
    // Passport gets rid of all the user data that is in the session, i.e log the user out
    req.logout();
    res.redirect('/');
});





// Middleware, 'next' is the next thing to be called
function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    console.log("Not authenticated");
    res.redirect('/login');
}





// Start server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
});