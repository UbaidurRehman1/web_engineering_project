const   mongoose                =   require("mongoose"),
        passportLocalMongoose   =   require("passport-local-mongoose");


let userSchema = new mongoose.Schema(
    {
        adminName: String,
        password: String
    }
);

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("admin", userSchema);