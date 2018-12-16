const   mongoose                =   require("mongoose");
     

let jobSchema = new mongoose.Schema(
    {
        title: String,
        location: String,
        req: String,
        no: Number,
        desc: String,
        min_exp: Number,
        max_exp: Number,
        min_sal: Number,
        max_sal: Number,
        image: String
    }
);

module.exports = mongoose.model("job", jobSchema);
