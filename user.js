var mongoose=require('./mongoose');
var schemaEmp=mongoose.Schema({
	firstName:{
		type:String,
		require:true,//обов'язкова властивість
	},
	lastName:{
		type:String,
		require:true
	},
	age:{
		type:Number
	},
	salary:{
		type:Number
	}
});
var Emp=mongoose.model("Emp",schemaEmp);
module.exports=Emp;