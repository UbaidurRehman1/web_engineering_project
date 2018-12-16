let     express                     =   require("express"),
        app                         =   express(),
        bodyParser                  =   require("body-parser"),
        mongoose                    =   require("mongoose"),
        admin                       =   require("./models/admin"),
        passport                    =   require("passport");





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

var name = "ubaid";
var password = "pakistan1234";
var newUser = new admin({
    username: name
});
admin.register(newUser, password, function (err, account) {
    if (err) {
        console.log(err);
    }
});






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




app.get("/", function(req, res)
{
    res.render("index/Homepage");
});




let port = process.env.PORT || 3000;
//server
app.listen(port, function()
{
    console.log("Server started");
});


