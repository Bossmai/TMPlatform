var express = require('express'),
	router = express.Router(),
	moment = require('moment');

/**
 * fetch company list 
 */
router.get('/', function(req, res, next) {
	console.log('company.get.start');
    req.db.get('company').find(
        {},//req.query,
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

/**
 * update single company
 */
router.put('/:id', function(req, res, next) {
    console.log('company.update.start: ' + JSON.stringify(req.body));
    req.db.get('company').update(
        {id: req.params.id},
        {$set:req.body},
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

/**
 * add single company
 */
router.post('/', function(req, res, next) {
	var condition = req.body;
	condition.createDate = moment(new Date()).format('YYYY/MM/DD');
	console.log('company.add.start: ' + JSON.stringify(condition));
    req.db.get('company').insert(condition,
    	function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});


/**
 * delete single company
 */
router.delete('/:id', function(req, res, next) {
    console.log('company.delete.start: ' + JSON.stringify(req.body));
    req.db.get('company').remove(
    	req.body,
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

module.exports = router;