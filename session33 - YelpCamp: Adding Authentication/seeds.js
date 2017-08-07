var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
        {
            name: "Example Campground 1",
            imgUrl: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5115588.jpg",
            description: "Pour-over flannel succulents try-hard. Paleo hashtag sartorial shoreditch palo santo meggings velit narwhal ut PBR&B officia selvage chia nisi. Godard vice adipisicing fashion axe pok pok, et scenester wolf locavore brooklyn try-hard 90's wayfarers hell of la croix. Blog keytar meggings quinoa, edison bulb chambray pickled in street art chicharrones. "
        },
        {
            name: "Example Campground 2",
            imgUrl: "http://visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg",
            description: "Pour-over flannel succulents try-hard. Paleo hashtag sartorial shoreditch palo santo meggings velit narwhal ut PBR&B officia selvage chia nisi. Godard vice adipisicing fashion axe pok pok, et scenester wolf locavore brooklyn try-hard 90's wayfarers hell of la croix. Blog keytar meggings quinoa, edison bulb chambray pickled in street art chicharrones. "
        },
        {
            name: "Example Campground 3",
            imgUrl: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5115421.jpg",
            description: "Pour-over flannel succulents try-hard. Paleo hashtag sartorial shoreditch palo santo meggings velit narwhal ut PBR&B officia selvage chia nisi. Godard vice adipisicing fashion axe pok pok, et scenester wolf locavore brooklyn try-hard 90's wayfarers hell of la croix. Blog keytar meggings quinoa, edison bulb chambray pickled in street art chicharrones. "
        },
        {
            name: "Example Campground 4",
            imgUrl: "http://www.nationalparks.nsw.gov.au/~/media/DF58734103EF43669F1005AF8B668209.ashx",
            description: "Pour-over flannel succulents try-hard. Paleo hashtag sartorial shoreditch palo santo meggings velit narwhal ut PBR&B officia selvage chia nisi. Godard vice adipisicing fashion axe pok pok, et scenester wolf locavore brooklyn try-hard 90's wayfarers hell of la croix. Blog keytar meggings quinoa, edison bulb chambray pickled in street art chicharrones. "
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
            // data.forEach(function(seedItem){
            //     Campground.create(seedItem, function(err, campgroundCreated){
            //         if (err){
            //             console.log(err)
            //         }else{
            //             console.log("Added a campground");
            //             Comment.create({
            //                 text: "This is an example comment!",
            //                 author: "Anonymous"
            //             }, function(err, commentCreated){
            //                 if (err){
            //                     console.log(err);
            //                 }else{
            //                     campgroundCreated.comments.push(commentCreated);
            //                     campgroundCreated.save();
            //                     console.log("Created new comment");
            //                 }
            //             });
            //         }
            //     });
            // });
        }
    });
    
    
}

module.exports = seedDB;