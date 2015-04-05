var mongojs = require('mongojs'),
    express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    db = mongojs.connect('localhost:27017/test', ['task', 'temp']);

router.get('/', function(req, res, next) {
    var mapper = function () {
        if(this.isHold == false){
            emit({
                planExecDate:this.planExecDate,
                jobId : this.jobId
            }, {
                status: this.status,
                scriptType: this.appRunner.scriptType
            });
        }


    };

    var reducer = function (key, values) {


        var ret = {
            isRtn : true,
            newSuccessCount :0,
            repeatSuccessCount:0
        };

        values.forEach(function(d){
            if(d.isRtn){
                ret.newSuccessCount += d.newSuccessCount;
                ret.repeatSuccessCount += d.repeatSuccessCount;
                return;
            }
            if(d.scriptType==='NEW'){

                if(d.status==="SUCCESS"){
                    ret.newSuccessCount ++;
                }
            }else if(d.scriptType==='REPEAT') {

                if(d.status==="SUCCESS"){
                    ret.repeatSuccessCount ++;
                }
            }
        })
        return ret;
    };

    console.log("calling mapReduce " + db);
    db.task.mapReduce(
        mapper,
        reducer, {
            out: 'temp'
        },
        function(err, collection){
            if(err){
                console.log(err);
            }
            collection.find().toArray(function(err, docs){
                var ret = docs.filter(function(d){
                    return !moment(d._id.planExecDate, 'YYYY/MM/DD').isAfter();
                }).map(function(d){
                    return {

                        date : d._id.planExecDate,
                        job: d._id.jobId,
                        newCount: d.value.newSuccessCount,
                        repeatCount: d.value.repeatSuccessCount
                    };
                })
                res.setHeader('Content-Type', 'application/json;charset=utf-8');
                res.send(ret);
            })
        }
    );

});


module.exports = router;