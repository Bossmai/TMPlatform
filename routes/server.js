var express = require('express'),
	router = express.Router(),
    fetchCount = 1;

/**
 * fetch task list 
 */
router.get('/', function(req, res, next) {
	console.log('server.get.start');
    req.db.get('server').find(
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
    console.log('server.update.start: ' + JSON.stringify(req.body));
    req.db.get('server').update(
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
    console.log('server.delete.start: ' + JSON.stringify(req.body));
    req.db.get('server').delete(
        {id: req.params.id},
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

module.exports = router;