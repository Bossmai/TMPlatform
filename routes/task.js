var express = require('express');
var router = express.Router();
var mongo = require('mongodb')
    , monk = require('monk')
    , db = monk('localhost:27017/test');

var fetchCount = 15;

/* GET users listing. */
router.get('/get', function(req, res, next) {

    var searchCondition = {
        'slaver.slaverMAC': req.query.slaverMAC,
        'planExecDate':req.query.planExecDate,
        'status':'NONE'
    };
    var limit = {
        limit: 15
    };

    db.get('task').find(
        searchCondition,
        limit,
        function(err, docs) {

            db.get("task").update(searchCondition, limit, {
                $set : {status: "INPROGRESS"}
            }, function(err, docs){
                //TODO null;
            });
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);

        });
});

router.get('/status', function(req, res, next) {
    db.get('task').update({
            'slaver.slaverMAC': req.query.slaverMAC,
            'planExecDate':req.query.planExecDate},
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);

        });
});


module.exports = router;