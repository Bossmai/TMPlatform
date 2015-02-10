var express = require('express'),
	router = express.Router(),
	moment = require('moment'),
    fetchCount = 15;

/**
 * fetch slaver list 
 */
router.get('/', function(req, res, next) {
	console.log('slaver.get.start');
    req.db.get('slaver').find(
        {},//req.query,
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

/**
 * update single slaver
 */
router.put('/:id', function(req, res, next) {
    console.log('slaver.update.start: ' + JSON.stringify(req.body));
    req.db.get('slaver').update(
        {id: req.params.id},
        {$set:req.body},
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

/**
 * add single slaver
 */
router.post('/', function(req, res, next) {
	var condition = req.body;
	condition.createDate = moment(new Date()).format('YYYY/MM/DD');
	console.log('slaver.add.start: ' + JSON.stringify(condition));
    req.db.get('slaver').insert(condition,
    	function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});


/**
 * delete single slaver
 */
router.delete('/:id', function(req, res, next) {
    console.log('slaver.delete.start: ' + JSON.stringify(req.body));
    req.db.get('slaver').remove(
    	req.body,
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

module.exports = router;