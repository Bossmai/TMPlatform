var express = require('express'),
	router = express.Router(),
    moment = require('moment'),
    request = require('request');

var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'tm.log'}
  ]
});
var logger = log4js.getLogger();


/**
 * fetch task list 
 */
router.get('/', function(req, res, next) {
	logger.info('task.get.start');
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
	logger.info('task.update.start: ' + JSON.stringify(req.body));
    var newVal = req.body;
    req.db.get('task').find(
        /* temp fix for issue of auto switch " " into "+" in param */
        {id: req.params.id.replace("+", " ")},

        //{id: req.params.id},
        function(err, tasks) {

            if(tasks === undefined || tasks[0] === undefined){
                logger.info('task update skip with invalid id: ' + req.params.id);
                return;
            }

            if(tasks[0].appRunner.scriptType == "NEW"){
				if(tasks[0].appRunner.needRepeat == true){
					if(newVal.status == "SUCCESS"){
						newVal.repeatTimes = tasks[0].repeatTimes ? (tasks[0].repeatTimes+1):1;
					} else if(newVal.status == "FAILURE" && tasks[0].repeatTimes){
						//二次激活执行失败的情况，重置状态位为上一次新增的成功，理解为二次激活没有做过
						newVal.status = "SUCCESS";
					}
				}
               
            }
            req.db.get('task').update(
                {id: req.params.id},
                {$set:newVal},
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



});

/**
 * delete single task
 */
router.delete('/:id', function(req, res, next) {
	logger.info('task.delete.start: ' + JSON.stringify(req.body));
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
	logger.info(req.query.slaverMAC);
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
	if(!req.query["slaver.slaverMAC"]){
		logger.info("no slaverMAC found, return.");
        sendResponse(res, "no slaverMAC");
        return;
	}
    var slaverMAC = req.query["slaver.slaverMAC"];
    
    var ret = [],
        today = moment().format('YYYY/MM/DD'),
        jobList = undefined,
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

        },{
            //今日新增二次激活
            'planExecDate' : today,
            'appRunner.scriptType' : "NEW",
            'status' : 'SUCCESS',
            'repeatTimes': 1,
            'isHold' : false

        }],
        limit = parseFloat(req.query.limit) || 15;

    function generateNew(d){

        //get count list from db
        req.db.get('countList').find({
            date : today
        }, function(err, docs) {
            if(err){
                logger.info("error" + e);
                return;
            }
            if(docs && docs[0]){
                countList = docs[0];
            }else{
                countList = {
                    date: today
                };
                req.db.get('countList').insert(countList);
            }
            if(!countList[d.job._id]){
                countList[d.job._id] = 0;
            }

            if(countList[d.job._id] > 200){
                logger.info("job: [" + d.job.appId + "] hit the max limit 200, stop add.");
                stopJob(d.job);
                return;
            }

            var query = {
                qs: {
                    job: d.job,
                    slaverMAC : slaverMAC
                }
            };

            request('http://'+req.headers.host+'/mockingjay',
                query,
                function(_req, _res){
                    if(_res.body === "NO_DATA"){
                        logger.info('generate new failed with response carry no date');
                        sendResponse(res, ret);
                    }else{

                        countList[d.job._id] += parseInt(d.job.newUsers);
                        req.db.get('countList').update({"date" : today},{$set:countList});

                        //特别处理，基于二次激活任务没找到的情况下，在创建新任务后把查询条件重新回到新增未执行
                        d.queryIndex--;
                        queryDB(d);
                    }

                });

        })
    }

    function stopJob(job){
        jobList = jobList.filter(function(d){
            return d!== job;
        });
        if(jobList.length === 0){
            sendResponse(res, ret);
        }
    }

    function queryDB(d){
    	querySq[d.queryIndex]["slaver.slaverMAC"] = slaverMAC;

        if (d._length > 0) {
            var query = querySq[d.queryIndex];
            query.jobId = d.job.id;
            req.db.get('task').find(query, { stream: true, limit: d._length - d.ret.length})
                .each(function(doc){

                    if(query.repeatTimes){
                        //这里设置二次激活的执行时间检查必须为上次执行成功的n个小时后
                        if(moment(doc.execEndTime).add(2, 'hours').isAfter(moment())){
                            //do nothing this time
                            return;
                        }
                    }
                    d.ret.push(doc);
                    req.db.get('task').update({_id: doc._id},{$set:{'status':'INPROGRESS'}})
                })
                .success(function(){
                    if(d.ret.length === d._length){
                        ret = ret.concat(d.ret);
                        if(ret.length===limit){
                            sendResponse(res, ret);
                        }
                    } else {
                        if(d.queryIndex < querySq.length-1){
                            d.queryIndex ++;
                            queryDB(d);
                        }else{
                        	logger.info("current task ["+ d.job.appId +"] count :["+d.ret.length+"], not enough so generate new");
                            generateNew(d);
                        }
                    }
                })
                .error(function(err){
                    sendResponse(res, ret);
                });
        }
    }

    req.db.get('job').find({
            '_status':'GO'
        },
        function(err, jobs) {
            if (err) {
            	logger.info("get job failed with err:" + err);
                res.status(500);
                return;
            }
            jobList = jobs;

            var length = jobs.length;
            if (jobs.length === 0) {
            	logger.info("get job failed with no data");
                res.status(500);
                return;
            }

            if(limit === 1){
            	logger.info("require only 1 task");
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
            var config = jobs.sort(function(job1,job2){
                var priority1 = job1.priority ? parseInt(job1.priority) : 0;
                var priority2 = job2.priority ?  parseInt(job2.priority) : 0;
                return priority2 - priority1;
            }).map(function(job,i){
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

            config.forEach(function(d, i){
                queryDB(d);
            });
        });

});

function sendResponse(res, doc){
    try{
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.send(doc);
    }catch(e){
        logger.info('Exception when sending response:' + e);
    }
    return;
}

module.exports = router;