//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');


//Setup
var app = express();
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); // Must come after body-parser use statement
app.set('view engine','ejs');



//Database config
mongoose.connect('mongodb://localhost/blog_app');
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now()
    }
});
var Blog = mongoose.model('Blog', blogSchema);


//RESTful routes

    //Root route, redirect to index
app.get('/', function(req,res){
    res.redirect('/blogs');
});

    //Index route
app.get('/blogs', function(req,res){
    Blog.find({}, function(err, blogs){
        if (err){
            console.log(err);
        }else{
            res.render('index', {blogs:blogs});
        }
    })
});

    //New route
app.get('/blogs/new', function(req,res){
    res.render('new');
});

    //Show route
app.get('/blogs/:blogId', function(req,res){
    Blog.findById(req.params.blogId, function(err, blog){
        if (err){
            console.log(err);
            res.redirect('/blogs');
        }else{
            res.render('show', {blog: blog});
        }
    });
});

    //Edit route
app.get('/blogs/:blogId/edit', function(req,res){
    Blog.findById(req.params.blogId, function(err, blog){
        if (err){
            console.log(err);
            res.redirect('/blogs');
        }else{
            res.render('edit', {blog: blog});
        }
    });
});

    //Create route
app.post('/blogs', function(req,res){
    //Sanitize body to get rid of possible scripts
    req.body.blog.body= req.sanitize(req.body.blog.body);
    var data = req.body.blog;
    Blog.create(data, function(err, blog){
        if (err){
            console.log(err);
            res.redirect('index');
        }else{
            console.log('Created: ' + blog);
            res.redirect('/blogs/'+blog._id);
        }
    });
    
});

    //Update route with method override
app.put('/blogs/:blogId', function(req,res){
    //Sanitize body to get rid of possible scripts
    req.body.blog.body= req.sanitize(req.body.blog.body);
    var data = req.body.blog;
    Blog.findByIdAndUpdate(req.params.blogId, data, function(err, updatedBlog){
        if (err){
            console.log(err);
            res.redirect('/blogs');
        }else{
            console.log('Updated: ' + updatedBlog);
            res.redirect('/blogs/' + req.params.blogId);
        }
    });
});

    //Destroy route with method override
app.delete('/blogs/:blogId', function(req,res){
    Blog.findByIdAndRemove(req.params.blogId, function(err){
        if (err){
            console.log(err);
            res.redirect('/blogs');
        }else{
            console.log('Blog destroyed successfully');
            res.redirect('/blogs');
        }
    });
});

//Server start
var port = process.env.PORT;
var ip = process.env.IP;
app.listen(port,ip,function(){
    console.log("Listening on " + ip + ":" + port + "...");
});