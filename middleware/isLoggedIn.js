function isLoggedIn(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    
    req.flash("error", "You have to Login for this");
    res.redirect("/admin");
}

module.exports = isLoggedIn;