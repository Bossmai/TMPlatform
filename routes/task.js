var express = require('express'),
	router = express.Router(),
    moment = require('moment'),
    request = require('request');

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
	
	
	function generateNew(){
		request('http://'+req.headers.host+'/mockingjay/all', function(_req, _res){
			console.log(_res.body);
			if(_res.body === "NO_DATA"){
				res.setHeader('Content-Type', 'application/json;charset=utf-8');
                res.send(ret);
			}else{
				queryDB();
			}
			
		});
	}
	
    function queryDB(){
        if(req.query.slaverMAC){
            querySq[queryIndex]["slaver.slaverMAC"] = req.query.slaverMAC;
        }
        
        var limit = parseFloat(req.query.limit) || 15;
        if (limit > 0) {
        	req.db.get('task').find(querySq[queryIndex], { stream: true, limit: limit - ret.length})
	            .each(function(doc){
	                ret.push(doc);
	                req.db.get('task').update({id: doc.id},{$set:{'status':'INPROGRESS'}})
	            })
	            .success(function(){
	                if(ret.length === limit){
	                	res.setHeader('Content-Type', 'application/json;charset=utf-8');
		                res.send(ret);
	                } else{
	                	if(queryIndex < querySq.length-1){
	                		queryIndex ++;
	                		queryDB(); 
	                	}else{
	                		console.log("no task, generate new");
	                		generateNew();
	                	}
	                }
	            })
	            .error(function(err){
	                res.setHeader('Content-Type', 'application/json;charset=utf-8');
	                res.send(ret);
	            });
        }
    }
    queryDB();
});

module.exports = router;