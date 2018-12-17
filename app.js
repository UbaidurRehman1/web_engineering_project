let     express                     =   require("express"),
        app                         =   express(),
        bodyParser                  =   require("body-parser"),
        mongoose                    =   require("mongoose"),
        admin                       =   require("./models/admin"),
        passport                    =   require("passport"),
        job                         =   require("./models/job");


const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

app.set("view engine", "ejs");
app.use(express.static("assests"));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(admin.createStrategy());
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


// var name = "ubaid";
// var password = "pakistan1234";
// var newUser = new admin({
//     username: name
// });
// admin.register(newUser, password, function (err, account) {
//     if (err) {
//         console.log(err);
//     }
// });






app.get("/admin", function(req, res)
{
    res.render("admin/login");
});

// create login
app.post("/admin", passport.authenticate("local", {
    failureRedirect : "/admin",
}), function(req, res)
{
    job.find({}, function(err, jobs){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("admin/admin", {jobs: jobs}); 
       }
   });
});


app.post("/updateJob", parser.single("image"), function(req, res)
{
    let title = req.body.title;
    let location = req.body.location;
    let company = req.body.company;
    let experience = req.body.experience;
    let desc = req.body.desc;
    let skills = req.body.skills;
    let qualification = req.body.qualification;
    let min_sal = req.body.min_sal;
    let max_sal = req.body.max_sal;
    let companyInfo = req.body.companyInfo;
    let image_url = req.file.url;

    let object_ = {
        title: title, 
        location: location, 
        company: company,
        experience: experience,
        desc: desc,
        skills: skills,
        qualification: qualification,
        min_sal: min_sal,
        max_sal: max_sal,
        image: image_url,
        companyInfo: companyInfo
    };
    

    job.create(object_, function(err)
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
    job.find({}, function(err, jobs){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("search", {jobs: jobs}); 
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




let port = process.env.PORT || 3000;
//server
app.listen(port, function()
{
    console.log("Server started");
});


