const   mongoose                =   require("mongoose"),
        passportLocalMongoose   =   require("passport-local-mongoose");


let jobSchema = new mongoose.Schema(
    {
        title: String,
        location: String,
        req: String,
        no: Number,
        desc: String,
        experience: Number,
        salary: Number
    }
);

module.exports = mongoose.model("job", jobSchema);
