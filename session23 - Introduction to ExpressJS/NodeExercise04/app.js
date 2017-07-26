var express = require('express');

// Express has a lot of methods, typically the export for the express module
// is executed and the return of that function is saved to a variable, typically
// named app.
// Most things done in an application will be done based off this variable, as the 
// return of express() holds a lot of valuable functionality (such as .get()

var app = express();


// req and res are actually objects. req has all the information (as properties)
// of the request and how the route was triggered, the information sent along with
// the request, etc.

// res gives us all the functionality and properties needed to respond to a request.


app.get('/', function(req, res){
    res.send("Hi there, welcome to my assignment!");
});

app.get('/speak/:animal', function(req,res){
    var animal = req.params.animal.toLowercase();
    if (animal === "pig"){
        res.send("The pig says 'Oink'");
    }else if (animal === "cow"){
        res.send("The cow says 'Moo'")
    }else if (animal === "dog"){
        res.send("The dog says 'Woof Woof!");
    }else{
        res.redirect('/404')
    }
});

app.get('/repeat/:whatToRepeat/:numTimes', function(req,res){
    var strToSend = '';
    for (var i = 0; i < req.params.numTimes; i++){
        strToSend += (req.params.whatToRepeat + " ");
    }
    
    res.send(strToSend);
});

app.get('*', function(req,res){
    res.send("Sorry, page not found... What are you doing with your life?");
});


// .listen() is a function that tells the code to listen for incoming requests
// it takes a numeric argument of what port to listen on as well as a callback function
// process.env.PORT is the environment set port, which is needed for C9 as well as 
// when a node project is deployed to a server that requires incoming requests on a certain port.
// process.env.IP is similar, it basically tells express to use the proper IP and Port that 
// C9 wants us to use... locally it's not required, but in most settings it is.
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Listening at ' + process.env.IP + ":" + process.env.PORT + "...");
});