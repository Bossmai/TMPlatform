var express = require('express'),
	router = express.Router(),
	moment = require('moment');

/**
 * fetch phoneType list 
 */
router.get('/', function(req, res, next) {
	console.log('phoneType.get.start');
    req.db.get('phoneType').find(
        {},//req.query,
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

/**
 * update single phoneType
 */
router.put('/:id', function(req, res, next) {
    console.log('phoneType.update.start: ' + JSON.stringify(req.body));
    req.db.get('phoneType').update(
        {id: req.params.id},
        {$set:req.body},
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

/**
 * add single phoneType
 */
router.post('/', function(req, res, next) {
	var condition = req.body;
	condition.createDate = moment(new Date()).format('YYYY/MM/DD');
	console.log('phoneType.add.start: ' + JSON.stringify(condition));
    req.db.get('phoneType').insert(condition,
    	function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});


/**
 * delete single phoneType
 */
router.delete('/:id', function(req, res, next) {
    console.log('phoneType.delete.start: ' + JSON.stringify(req.body));
    req.db.get('phoneType').remove(
    	req.body,
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

module.exports = router;