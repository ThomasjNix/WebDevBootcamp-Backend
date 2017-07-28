/*
    Provided links with API key
    
    General search: http://www.omdbapi.com/?s=guardians+of+the+galaxy&apikey=thewdb 

    Search with Movie ID: http://www.omdbapi.com/?i=tt3896198&apikey=thewdb
    
*/

var requiredUrl = 'http://www.omdbapi.com/?';
var apiKey = '&apikey=thewdb';
var express = require('express');
var request = require('request');
var app = express(); 
var bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


// Home page / search page
app.get('/', function(req,res){
    res.render('search');
});

// Results link for given request 
app.get('/results', function(req,res){
    
    //Set the API call
    var apiCall = requiredUrl + "s=" + req.query.movieName + apiKey;
    
    console.log(apiCall);
    
    //Request using the api call
    request(apiCall, function(err, resForCallReq, body){
        
        //Check for errors
        if (!err && resForCallReq.statusCode===200){
            
            //Parse JSON
            var dataResults = JSON.parse(body);
            
            
            //Send data
            res.render('results', {
                data : dataResults["Search"]
            });
        }else{
            res.send("Error encountered.")
        }
    });
});

// There should be a catch-all, but this is just for demonstration of API calling

// Start server and listen
app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server started...');
});