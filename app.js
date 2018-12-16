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
    res.render("admin/admin");
});


app.post("/updateJob", parser.single("image"), function(req, res)
{
    let title = req.body.title;
    let location = req.body.location;
    let requirement = req.body.req;
    let no = req.body.no;
    let desc = req.body.desc;
    let min_year = req.body.min_year;
    let max_year = req.body.max_year;
    let from_salary = req.body.from_salary;
    let to_salary = req.body.to_salary;

    // let imageFile = req.files.image;
    // let image = imageFile.name;

    // imageFile.mv('/jobs_images/' + image, function(err) {
    // if (err)
    //   return res.status(500).send(err);
    // });
    let image_url = req.file.url;

    let object_ = {title: title, location: location, 
        req: requirement,
        no: no,
        desc: desc,
        min_exp: min_year,
        max_exp: max_year,
        min_sal: from_salary,
        max_sal: to_salary,
        image: image_url
    };
    

    job.create(object_, function(err, campground)
    {
        if(err)
        {
            res.post(err)
        }
        else
        {
            res.send(object_);
        }
    });


    
});


app.get("/", function(req, res)
{
    res.render("index/Homepage");
});

app.get("/search", function(req, res)
{
    res.render("search");
});

app.get("/about", function(req, res)
{
    res.render("about");
});

app.get("/detail", function(req, res)
{
    res.render("detail");
});




let port = process.env.PORT || 3000;
//server
app.listen(port, function()
{
    console.log("Server started");
});


