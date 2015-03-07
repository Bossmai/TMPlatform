var express = require('express'),
	router = express.Router();

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
            if (err) {
                res.status(500);
                return;
            }
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.status(200);
            res.send("{status: 'OK'}");
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
            if (err) {
                res.status(500);
                return;
            }
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.status(200);
            res.send("{status: 'OK'}");
        });
});



/**
 * fetch task list with query condition and status:NONE in count
 */
router.get('/getnew', function(req, res, next) {
	
	var ret = [];
	var query = {
        status:'NONE'
    };
    if(req.query.slaverMAC){
        query["slaver.slaverMAC"] = req.query.slaverMAC;
    }
    if(req.query.planExecDate){
        query.planExecDate = req.query.planExecDate;
    }
    req.db.get('task').find(query, { stream: true, limit:req.query.limit || 15 })
    .each(function(doc){
    	ret.push(doc);
    	req.db.get('task').update({id: doc.id},{$set:{status:'INPROGRESS'}})
    })
    .error(function(err){
    	res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.send(err);
    })
    .success(function(){
    	res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.send(ret);
    });
    
    
});

module.exports = router;