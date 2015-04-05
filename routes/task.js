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
 * delete single task
 */
router.get('/resetAbort', function(req, res, next) {
	console.log(req.query.slaverMAC);
    req.db.get('task').update({
    		'slaver.slaverMAC':req.query.slaverMAC,
    		'status':'INPROGRESS'
    	},
        {$set: {'status':'NONE'}},
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
            'status' : {'$in' :['FAILURE','NOT_BUILT']},
            'isHold' : false
        },{
            //请求今日留存未做
            'planExecDate' : today,
           'appRunner.scriptType' : "REPEAT",
            'status' : 'NONE',
            'isHold' : false
        },{
            //请求今日新增失败
            'planExecDate' : today,
            'appRunner.scriptType' : "NEW",
            'status' : {'$in' :['FAILURE','NOT_BUILT']},
            'isHold' : false
        },{
            //请求今日新增未做
            'planExecDate' : today,
           'appRunner.scriptType' : "NEW",
            'status' : 'NONE',
            'isHold' : false
        }],
        limit = parseFloat(req.query.limit) || 15;

	function generateNew(d){
		request('http://'+req.headers.host+'/mockingjay',{
            qs: d.job
        }, function(_req, _res){
			console.log(_res.body);
			if(_res.body === "NO_DATA"){
				res.setHeader('Content-Type', 'application/json;charset=utf-8');
                res.send(ret);
			}else{
				queryDB(d);
			}
			
		});
	}
	
    function queryDB(d){
        if(req.query.slaverMAC){
            querySq[queryIndex]["slaver.slaverMAC"] = req.query.slaverMAC;
        }

        if (limit > 0) {
            var query = querySq[d.queryIndex];
            query.jobId = d.job.id;
        	req.db.get('task').find(query, { stream: true, limit: d._length - d.ret.length})
	            .each(function(doc){
                    d.ret.push(doc);
	                req.db.get('task').update({_id: doc._id},{$set:{'status':'INPROGRESS'}})
	            })
	            .success(function(){
	                if(d.ret.length === d._length){
                        ret = ret.concat(d.ret);
                       if(ret.length===limit){
                            res.setHeader('Content-Type', 'application/json;charset=utf-8');
                            res.send(ret);
                        }

	                } else{
	                	if(d.queryIndex < querySq.length-1){
                            d.queryIndex ++;
	                		queryDB(d);
	                	}else{
	                		console.log("no task, generate new");
	                		generateNew(d);
	                	}
	                }
	            })
	            .error(function(err){
	                res.setHeader('Content-Type', 'application/json;charset=utf-8');
	                res.send(ret);
	            });
        }
    }

    req.db.get('job').find({
            '_status':'GO'
        },
        function(err, jobs) {
            if (err) {
                res.status(500);
                return;
            }
            var length = jobs.length;
            if (jobs.length === 0) {
                res.status(500);
                return;
            }

            if(limit === 1){
                var job =  jobs[Math.ceil(Math.random() * jobs.length)-1];
                queryDB({
                    key: job.id,
                    _length: 1,
                    ret :[],
                    job: job,
                    queryIndex: 0
                });
                return;
            }


            var config = jobs.map(function(job,i){
                var count = Math.floor(limit/length);
                if(i==0){
                    count+=limit%length;
                };
                return {
                    key: job.id,
                    _length: count,
                    ret :[],
                    job: job,
                    queryIndex: 0
                };
            });

            config.forEach(function(d){
                queryDB(d);
            });
        });

});

module.exports = router;