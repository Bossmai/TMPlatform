
/*
 * GET home page.
 */
var mongo = require('mongodb')
  , monk = require('monk')
  , db = monk('localhost:27017/test');


exports.get = function(req, res){
	var me = this;
	console.log(req.query);
	db.get('task').find({
			'slaver.slaverMAC': req.query.slaverMAC, 
			'planExecDate':req.query.planExecDate}, 
			function(err, docs) {
		res.setHeader('Content-Type', 'application/json;charset=utf-8');  
		res.send(docs);  
		
	});
};

exports.list = function(req, res){
	var me = this;
	console.log("list");
	res.send("345"); 
	
	db.get('task').find({}, function(err, docs) {
		res.setHeader('Content-Type', 'application/json;charset=utf-8');  
		res.send(docs);  
	});
};