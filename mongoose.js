var mongoose=require("mongoose");
mongoose.connect("mongodb://****:****@ds161012.mlab.com:61012/ostapchak_db");
console.log('MongoDB connect...');
module.exports=mongoose;