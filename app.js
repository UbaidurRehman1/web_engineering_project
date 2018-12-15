let     express                     =   require("express"),
        app                         =   express();




app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));



app.use("/", function(req, res)
{
    res.render("index/Homepage");
});






let port = process.env.PORT || 3000;
//server
app.listen(port, function()
{
    console.log("Server started");
});


