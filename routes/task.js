var express = require('express');
var router = express.Router();
var mongo = require('mongodb')
    , monk = require('monk')
    , db = monk('localhost:27017/test');

var fetchCount = 15;

/* GET users listing. */
router.get('/get', function(req, res, next) {
    db.get('task').find({
            'slaver.slaverMAC': req.query.slaverMAC,
            'planExecDate':req.query.planExecDate},
        function(err, docs) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.send(docs);

        });

    db.get("task").find()
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