let     express                     =   require("express"),
        app                         =   express(),
        bodyParser                  =   require("body-parser"),
        mongoose                    =   require("mongoose"),
        admin                       =   require("./models/admin"),
        passport                    =   require("passport"),
        job                         =   require("./models/job"),
        LocalStratrgy               =   require("passport-local"),
        methodOverride              =   require('method-override'),
        flash                       =   require('connect-flash');


const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

app.set("view engine", "ejs");
app.use(express.static("assests"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));



// Passport Configuration
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
    }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session
passport.use(new LocalStratrgy(admin.authenticate()));

// For encoding and decoding the session
passport.serializeUser(admin.serializeUser());
passport.deserializeUser(admin.deserializeUser());



//connection
let db_url = process.env.DATABASEURL || "mongodb://localhost/web_eng"
mongoose.connect(db_url, { useNewUrlParser: true }, function(error)
{
    if(error != null)
    {
        console.log(error);
    }
});
mongoose.set('useCreateIndex', true);


// Cloudinary Config
cloudinary.config
({
    cloud_name: 'student1234567',
    api_key: '839988815983737',
    api_secret: '5a-DnChbLGQ4lXPTdGQlJPOnBMA'
});

const storage = cloudinaryStorage({
cloudinary: cloudinary,
folder: "demo",
allowedFormats: ["jpg", "png"],
transformation: [{ width: 500, height: 500, crop: "limit" }]
});
const parser = multer({ storage: storage });


// Creating admin login detials manually
// var name = "admin";
// var password = "admin";
// var newUser = new admin({
//     username: name
// });
// admin.register(newUser, password, function (err, account) {
//     if (err) {
//         console.log(err);
//     }
// });

// Middleware
function isLoggedIn(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/admin/login");
}


// ====== Routes ========== //

// Admin Login Routes
app.get("/admin/login", function(req, res)
{

    res.render("admin/login", { message: req.flash('error') });
});

// Login Logic

app.post("/admin/login", passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/admin/login",
    failureFlash: { type: 'error', message: 'Invalid username or password.' }
}) ,function(req, res){
});

app.get("/admin/logout", function(req, res){
    req.logout();
    res.redirect("/admin/login")
});

app.get("/admin",isLoggedIn, function(req, res){
    job.find({}, function(err, jobs){
      if(err){
          console.log("ERROR!");
      } else {
          res.render("admin/admin", {jobs: jobs}); 
      }
    })
});



app.post("/admin/addJob", parser.single("image"), function(req, res)
{
    var imgUrl;
    try {
    imgUrl = req.file.url;
    }
    catch(error) {
    imgUrl = "http://logodust.com/img/logo.svg";
    }
    
    req.body.data.image = imgUrl;
    
    
    job.create(req.body.data, function(err)
    {
        if(err)
        {
            res.post(err)
        }
        else
        {
            res.redirect("/admin");
        }
    });
});


app.get("/", function(req, res)
{
    res.render("index/Homepage");
});

app.get("/search", function(req, res)
{

    var q = req.query.q;


    job.find({}, function(err, jobs){

        if(err)
        {
            console.log("ERROR!");
        }
        else
        {
            res.render("search", {jobs: jobs, q : q});
        }
   });
});


app.get("/about", function(req, res)
{
    res.render("about");
});

app.get("/detail/:id", function(req, res)
{
       job.findById(req.params.id, function(err, foundJob){
       if(err){
           res.redirect("/");
       } else {
           res.render("detail", {job: foundJob});
       }
   })
    
});

// Edit Route

app.get("/admin/job/:id/edit",isLoggedIn, function(req, res){
    
    job.findById(req.params.id, function(err, foundJob){
       if(err){
           res.redirect("/admin");
       } else {
           res.render("admin/edit", {job: foundJob});
       }
   })
})

// Update Route

app.put("/detail/:id", function(req, res){
    
    job.findByIdAndUpdate(req.params.id, req.body.jData, function(err, updateJob){
        if(err){
            res.redirect("/admin")
        } else {
            res.redirect("/detail/" + req.params.id);
        }
    })
    
})

// Delete Route

app.get("/admin/job/:id/delete",isLoggedIn, function(req, res){
   job.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
       } else {
           blog.remove();
           res.redirect("/admin");
       }
   }); 
});

// Approve Job

app.get("/admin/job/approve", function(req,res){
    res.render("admin/JobsTable")
})



app.get("*", function(req,res){
    res.render("404")
})





let port = process.env.PORT || 3000;
//server
app.listen(port, function()
{
    console.log("Server started");
});


