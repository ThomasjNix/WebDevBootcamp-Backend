var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
        {
            name: "Example Campground 1",
            imgUrl: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5115588.jpg",
            description: "This is an example campground (1)"
        },
        {
            name: "Example Campground 2",
            imgUrl: "http://visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg",
            description: "This is an example campground (2)"
        },
        {
            name: "Example Campground 3",
            imgUrl: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5115421.jpg",
            description: "This is an example campground (3)"
        },
        {
            name: "Example Campground 4",
            imgUrl: "http://www.nationalparks.nsw.gov.au/~/media/DF58734103EF43669F1005AF8B668209.ashx",
            description: "This is an example campground (4)"
        }
    ];

function seedDB(){
    // Remove everything from database on seed
    Campground.remove({}, function(err){
        if (err){
            console.log(err);
        }else{
            console.log("ALL CAMPGROUNDS REMOVED");
 
            // Add a few campgrounds for testing purposes
            data.forEach(function(seedItem){
                Campground.create(seedItem, function(err, campgroundCreated){
                    if (err){
                        console.log(err)
                    }else{
                        console.log("Added a campground");
                        Comment.create({
                            text: "This is an example comment!",
                            author: "Anonymous"
                        }, function(err, commentCreated){
                            if (err){
                                console.log(err);
                            }else{
                                campgroundCreated.comments.push(commentCreated);
                                campgroundCreated.save();
                                console.log("Created new comment");
                            }
                        });
                    }
                });
            });
        }
    });
    
    
}

module.exports = seedDB;