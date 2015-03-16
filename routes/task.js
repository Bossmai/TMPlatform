var express = require('express'),
	router = express.Router(),
    moment = require('moment');

/**
 * fetch task list 
 */
router.get('/', function(req, res, next) {
	console.log('task.get.start');
    req.db.get('task').find(
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
    console.log('task.update.start: ' + JSON.stringify(req.body));
    req.db.get('task').update(
        {id: req.params.id},
        {$set:req.body},
        function(err, docs) {
            if (err) {
                res.status(500);
                return;
            }
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.status(200);
            res.send("{status: 'OK'}");
        });
});

/**
 * delete single task
 */
router.delete('/:id', function(req, res, next) {
    console.log('task.delete.start: ' + JSON.stringify(req.body));
    req.db.get('task').delete(
        {id: req.params.id},
        function(err, docs) {
            if (err) {
                res.status(500);
                return;
            }
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            res.status(200);
            res.send("{status: 'OK'}");
        });
});



/**
 * fetch task list with query condition and status:NONE in count
 */
router.get('/getnew', function(req, res, next) {
	
	var ret = [],
        today = moment().format('YYYY/MM/DD'),
        querySq =[{
            //请求今日留存失败
            'planExecDate' : today,
            'appRunner.scriptType' : "REPEAT",
            'status' : {'$in' :['FAILURE','NOT_BUILT']}
        },{
            //请求今日留存未做
            'planExecDate' : today,
           'appRunner.scriptType' : "REPEAT",
            'status' : 'NONE'
        },{
            //请求今日新增失败
            'planExecDate' : today,
            'appRunner.scriptType' : "NEW",
            'status' : {'$in' :['FAILURE','NOT_BUILT']}
        },{
            //请求今日新增未做
            'planExecDate' : today,
           'appRunner.scriptType' : "NEW",
            'status' : 'NONE'
        }],

        queryIndex = 0;

    function queryDB(){
        if(req.query.slaverMAC){
            querySq[queryIndex]["slaver.slaverMAC"] = req.query.slaverMAC;
        }
        
        var limit = (req.query.limit || 15 ) - ret.length;
        if (limit > 0) {
        	req.db.get('task').find(querySq[queryIndex], { stream: true, limit: limit })
	            .each(function(doc){
	                ret.push(doc);
	                req.db.get('task').update({id: doc.id},{$set:{'status':'INPROGRESS'}})
	            })
	            .success(function(oc){
	                if(ret.length < (req.query.limit || 15 ) && queryIndex < querySq.length-1){
	                    queryIndex ++;
	                    queryDB();
	                }else{
	                    res.setHeader('Content-Type', 'application/json;charset=utf-8');
	                    res.send(ret);
	                }
	            })
	            .error(function(err){
	                res.setHeader('Content-Type', 'application/json;charset=utf-8');
	                res.send(err);
	            });
        }
    }
    queryDB();
});

module.exports = router;