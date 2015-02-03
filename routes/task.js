var express = require('express');
var router = express.Router();
var mongo = require('mongodb')
    , monk = require('monk')
    , db = monk('localhost:27017/test');

var fetchCount = {
    limit: fetchCount
};

/* GET users listing. */
router.get('/get', function(req, res, next) {

    db.get('task').find(
        getSearchCondition(req),
        fetchCount,
        function(err, docs) {

            db.get("task").update(getSearchCondition(req), fetchCount, {
                $set : {status: "INPROGRESS"}
            }, function(err, docs){
                //TODO null;
            });
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);

        });
});

router.get('/:status', function(req, res, next) {
    console.log("status= " + req.params.status);
    db.get('task').update(getSearchCondition(req, 'INPROGRESS'),

        {$set : {
            status: req.params.status
        }},
        function(err, docs) {
            if(err){
                res.setHeader('Content-Type', 'application/json;charset=utf-8');
                res.send("failed with err: " + err);
            }
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send("success");

        });
});

function getSearchCondition(req, status){
    return {
       'slaver.slaverMAC': req.query.slaverMAC,
        'planExecDate':req.query.planExecDate,
        'status': status? status:'NONE'
    };
}

module.exports = router;