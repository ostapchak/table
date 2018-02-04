var express=require('express');
var app=express();
var fs=require('fs');
var Emp=require('./user.js')//mongoDB

//Встановлення шляху для статичного каталогу
app.use(express.static(__dirname)) ;
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/data',function(req,res)
{
	Emp.find({},function(err,data){
		console.log(data);
		res.send(data);
	});
});

app.get('/form',function(req,res)
{
	res.sendFile(__dirname+'/form.html');
});

app.get('/',function(req,res)
{
	res.sendFile(__dirname+'/index.html');
});

app.post('/sendId',function(req,res)
{
	console.log(req.body);
	Emp.remove(req.body,function(err,result){
		res.send("deleted!");
	})
});

app.post('/sendData',function(req,res)
{
	console.log(req.body.rowId+"           IDDDDDD");
	var newEmp=new Emp({
		firstName:req.body.firstName,
		lastName:req.body.lastName,
		age:req.body.age,
		salary:req.body.salary
	});
	if(req.body.rowId!=="")
	{
		Emp.update({_id:req.body.rowId}, req.body, function(err, result){
			console.log(result);
			res.send("Дані оновлені в базі!")
		});
	}
	else
	{
		newEmp.save(function(err,data){
			console.log(data+"data");
			res.send("Дані збережено в базі!")
		});
	}
});

app.post('/search',function(req,res)
{
	console.log(req.body.value+"    SEARCH");
	Emp.find({}, function(err, data){
		var resMas=[];
		for(var i=0;i<data.length;i++)
		{
			if(data[i].firstName.toLowerCase().indexOf(req.body.value.toLowerCase())>=0 || 
				data[i].lastName.toLowerCase().indexOf(req.body.value.toLowerCase())>=0)
				resMas.push({firstName:data[i].firstName, 
					lastName:data[i].lastName});
		}
		res.send(resMas);
	});
});

app.post('/load',function(req,res)
{
	console.log(req.body.value);
	var mas=req.body.value.split(" ");
	var obj={firstName:mas[0], lastName:mas[1]};
	Emp.find(obj, function(err, data){
		console.log(data)
		res.send(data);
	});
});


app.listen(process.env.PORT || 8080);
console.log('Server is running...')