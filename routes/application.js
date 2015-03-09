var express = require('express'),
	router = express.Router(),
	moment = require('moment'),
    fetchCount = 15;

/**
 * fetch app list 
 */
router.get('/', function(req, res, next) {
	console.log('app.get.start');
    req.db.get('app').find(
        {},//req.query,
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

/**
 * update single app
 */
router.put('/:id', function(req, res, next) {
    console.log('app.update.start: ' + JSON.stringify(req.body));
    req.db.get('app').update(
        {id: req.params.id},
        {$set:req.body},
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

/**
 * add single app
 */
router.post('/', function(req, res, next) {
	var condition = req.body;
	condition.createDate = moment(new Date()).format('YYYY/MM/DD');
	console.log('app.add.start: ' + JSON.stringify(condition));
    req.db.get('app').insert(condition,
    	function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});


/**
 * delete single app
 */
router.delete('/:id', function(req, res, next) {
    console.log('app.delete.start: ' + JSON.stringify(req.body));
    req.db.get('app').remove(
    	req.body,
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

module.exports = router;