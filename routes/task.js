var express = require('express'),
	router = express.Router(),
	mongo = require('mongodb'),
    monk = require('monk'),
    db = monk('localhost:27017/test'),
    fetchCount = 1;

/**
 * fetch task list 
 */
router.get('/get', function(req, res, next) {
	console.log('task.get.start');
    db.get('task').find(
    	req.query,
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

/**
 * fetch task list with query condition and status:NONE in count
 */
router.get('/getnew', function(req, res, next) {
	console.log('task.get.start');
	var condition=req.query;
	condition.status="NONE";
	
    db.get('task').findAndModify({
    	query: condition,
    	limit: fetchCount,
    	update:{
    		$set:{
    			status: 'INPROGRESS'
    		}
    	}
    }, function(err, docs){
    	res.setHeader('Content-Type', 'application/json;charset=utf-8');
    	if(err){
    		console.log(err);
    		res.send(err);
    	}
    	res.send(docs);
    });
});


/**
 * update task 
 */
router.route('/update/:id').post(function(req, res, next) {
	console.log('task.update.start');
	res.setHeader('Content-Type', 'application/json;charset=utf-8');
	db.get('task').update({id: 1},
		{$set :req.body},
		function(err, docs){
			if(err){
				res.send(err);
			}
			res.send(docs);
    });
	
});

module.exports = router;