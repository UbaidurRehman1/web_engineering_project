const   mongoose                =   require("mongoose");
     

let jobSchema = new mongoose.Schema(
    {
        title: String,
        location: String,
        skills: String,
        qualification: String,
        desc: String,
        experience: String,
        min_sal: Number,
        max_sal: Number,
        // image: {type: String, default: "http://logodust.com/img/logo.svg"},
        image: String,
        company: String,
        companyInfo: String,
        date: {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model("job", jobSchema);
