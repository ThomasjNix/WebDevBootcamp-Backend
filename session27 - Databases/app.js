var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/example_db"); // This is how you connect to a database. If the specified name (example_db) doesn't exist, it will create it.


// Define schema of the database

// This doesn't affect our DB specifically, but helps mongoose create a pattern for data. 
// This doesn't mean that you HAVE to use these attributes only, more can be added, but it's just good for structure
var thingSchema = new mongoose.Schema({
    name: String,
    age: Number,
    city: String
});

// This is confusing, but it compiles a model from the schema provided, and 
// saves that model to the Thing object. Everything done with Mongoose related to the 
// Thing object will be used to interact with the database. 

// Doing this gives Thing a lot of methods needed. The string provided should ALWAYS be the 
// singular version of the collection used. Mongoose will pluralize what's provided, for example 
// here it will create the collection "Things" using the thingSchema and compile a model object
// to use for interacting with this collection.
var Thing = mongoose.model("Thing", thingSchema);


// Add something to the database

// Create an instance of Thing to add to the database
var person1 = new Thing({
    name: "Michael",
    age: 27,
    city: "Atlanta"
});

// Save it to the database
// Callback function used to check if properly saved. Will
// run when the save finishes, successful or not. This should be done on all CRUD operations, because
// these operations take time, and the status confirmation should only run when the save is completed.
person1.save(function(err,thing){
    if (err){
        console.log(err);
    }else{
        
        // Thing is what is sent back from the database, not what we originally saved, but the 
        // database entry for that
        console.log("Save successful");
        console.log(thing);
    }
});

// This is another way of creating an entry, essentially is new and create combined.

Thing.create({
    name: "Alex",
    age: 17,
    city: "Pittsburg"
}, function(err, thing){
    if (err){
        console.log(err);
    }else{
        console.log(thing);
    }
});

// Retrieve all things from database

Thing.find({}, function(err, things){
    if (err){
        console.log(err);
    }else{
        console.log("All indexes found:");
        console.log(things);
    }
});


/*
    Callbacks are very useful in pretty much all mongoose methods, as they give us information about our attempts to 
    connect to the database, if theres any issues, and even information about what we Create, Read, Update, or Destroy from the 
    database.
*/