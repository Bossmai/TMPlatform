var express = require('express'),
	router = express.Router(),
    fetchCount = 15;

/**
 * fetch task list 
 */
router.get('/', function(req, res, next) {
	console.log('task.get.start');
    req.db.get('task').find(
        {},//req.query,
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

/**
 * update single task
 */
router.put('/:id', function(req, res, next) {
    console.log('task.update.start: ' + JSON.stringify(req.body));
    req.db.get('task').update(
        {id: req.params.id},
        {$set:req.body},
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

/**
 * delete single task
 */
router.delete('/:id', function(req, res, next) {
    console.log('task.delete.start: ' + JSON.stringify(req.body));
    req.db.get('task').delete(
        {id: req.params.id},
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});



/**
 * fetch task list with query condition and status:NONE in count
 */
router.get('/getnew', function(req, res, next) {

	var condition=req.query;
	condition.status="NONE";
    console.log('task.get.start:' + JSON.stringify(condition));
    req.db.get('task').find({
    	query: condition,
    	limit: fetchCount
    }, function(err, docs){
    	res.setHeader('Content-Type', 'application/json;charset=utf-8');
    	if(err){
    		console.log(err);
    		res.send(err);
            return;
    	}

        req.db.get('task').update({
            query: condition,
            limit: fetchCount
        },{
            $set:{
                status: 'INPROGRESS'
            }
        },function(err, docs){
            if(err){
                res.send(err);
                return;
            }

        });
        res.send(docs);
        return;
    });
});

module.exports = router;