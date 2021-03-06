var express = require('express'),
	router = express.Router(),
	moment = require('moment'),
    fetchCount = 15;

/**
 * fetch slaver list 
 */
router.get('/', function(req, res, next) {
	//console.log('slaver.get.start' + JSON.stringify(req.db.get('slaver')));
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


/**
 * fetch job list
 */
router.get('/setSimStatus', function(req, res, next) {
    console.log('slaver.setSimStatus.start');
    var mac = req.query["slaverMAC"];
    var running = req.query["running"];
    var max = req.query["max"];
    req.db.get('slaver').update(
        {slaverMAC: mac},
        {$set: {
            running : running,
            max : max
        }},
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);
        });
});

module.exports = router;