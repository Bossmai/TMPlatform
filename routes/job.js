var express = require('express'),
	router = express.Router(),
	moment = require('moment'),
    fetchCount = 15;

/**
 * fetch job list 
 */
router.get('/', function(req, res, next) {
	console.log('job.get.start');
    req.db.get('job').find(
        {},//req.query,
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

/**
 * update single job
 */
router.put('/:id', function(req, res, next) {
    console.log('job.update.start: ' + JSON.stringify(req.body));
    req.db.get('job').update(
        {id: req.params.id},
        {$set:req.body},
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

/**
 * add single job
 */
router.post('/', function(req, res, next) {
	var condition = req.body;
	condition.createDate = moment(new Date()).format('YYYY/MM/DD');
	console.log('job.add.start: ' + JSON.stringify(condition));
    req.db.get('job').insert(condition,
    	function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});


/**
 * delete single job
 */
router.delete('/:id', function(req, res, next) {
    console.log('job.delete.start: ' + JSON.stringify(req.body));
    req.db.get('job').remove(
    	req.body,
        function(err, docs) {
            req.db.get('task').remove({jobId: req.body.id});
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

module.exports = router;