var mongojs = require('mongojs'),
	express = require('express'),
	router = express.Router(),
	db = mongojs.connect('localhost:27017/test', ['task']);

router.get('/', function(req, res, next) {
//	var jobId = req.query.jobId;
	var mapper = function () {
//		if((jobId && (this.jobId===jobId)) || !jobId){
			emit(this.planExecDate, {
	            status: this.status,
	            scriptType: this.appRunner.scriptType
	        });
//		} 
    };

    var reducer = function (key, values) {
        var ret = {
        	planExecDate : key,
        	newCount : 0,
        	newSuccessCount :0,
        	repeatCount: 0,
        	repeatSuccessCount:0
        };
        values.forEach(function(d){
        	if(d.scriptType==='NEW'){
        		ret.newCount++;
        		if(d.status==="SUCCESS"){
        			ret.newSuccessCount++;
        		}
        	}else{
        		ret.repeatCount++;
        		if(d.status==="SUCCESS"){
        			ret.repeatSuccessCount++;
        		}
        	}
        })
        return ret;
    };
    
    console.log("calling mapReduce " + db);
    db.task.mapReduce(
        mapper,
        reducer, {
            out: {replace:'tempCollctions'}
        },
        function(err, collection){
        	if(err){
        		console.log(err);
        	}
        	collection.find().toArray(function(err, docs){
        		res.setHeader('Content-Type', 'application/json;charset=utf-8');
                res.send(docs);
        	})
        }
    );
    
});


module.exports = router;