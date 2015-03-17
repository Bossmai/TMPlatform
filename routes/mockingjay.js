var express = require('express'),
    router = express.Router(),
    moment = require('moment');

var utils = {
    slaverList : undefined,
    appList : undefined,
    manufacturers : undefined,
    phoneTypeList: undefined,

    init: function(req, res, fn){
        var me = this;
        req.db.get('slaver').find({}, function(err, docs) {
            me.slaverList = docs;
            req.db.get('app').find({}, function(err, docs) {
            	me.appList =docs;
            	req.db.get('phoneType').find({},{sort:{percent:-1}}, function(err, docs) {
                    me.phoneTypeList = docs;
                    fn(req, res);
                });
            });
         });
    },

    random : function(max){
        return Math.ceil(Math.random() * max);
    },
    
    randomPick : function(d){
      var me = this;
      return d[me.random(d.length-1)];
    },

    getPhone: function (_phone) {
        var me = this;
        return {
            "getBSSID" : me.getRandom16(6, ":").toLowerCase(),
            "getDeviceId" : me.getIMEI(_phone), //imei
            "getMacAddress": me.getMAC(_phone).toLowerCase(),
            "getNetworkOperator" : '460' + _phone.mnc,
            "getPhoneType" : _phone.mnc,
            "getSimOperator" : '460' + _phone.mnc,
            "getSimSerialNumber" : '8986' + me.getRandom(16),
            "getSubscriberId" : '460' + _phone.mnc + me.getRandom(10), //imsi
            "BRAND" :  _phone.BRAND,
            "DEVICE" :  _phone.DEVICE,
            "HARDWARE" :  _phone.HARDWARE,
            "MANUFACTURER" : _phone.MANUFACTURER,
            "MODEL": _phone.MODEL,
            "PRODUCT" : _phone.PRODUCT,
            "RELEASE" : '4.3',
            "SDK" : "18",
            "getMetrics" : "720x1184",
            "getLine1Number" : me.randomPick(["13", "15", "18"]) + me.getRandom(9),
            "getString" : me.getRandom16(8,"")
        };
    },
    getRandom16: function(length, splitter){
        var me = this,
            result = '';
        for (var i = 0; i < length; i++) {
            var t = me.random(255).toString(16);
            if(t.length===1){
              t = "0"+t;
            }
            result += splitter + t;
        }
        if(splitter !== ""){
          result = result.substr(1);
        }
        
        return result;
    },

    getRandom: function(length){
        var me = this,
            result = '';
        for (var i = 0; i < length; i++) {
            result += me.random(9).toString();
        }
        return result;
    },

    getMAC: function (_phone) {
        var me = this,
            result ;
        if(_phone.mac6 instanceof Array){
            result = _phone.mac6[me.random( _phone.mac6.length-1)];
        }else{
            result = _phone.mac6;
        }
        result += ":" + me.getRandom16(3,":");
        return result;
    },

    getIMEI: function (_phone) {
        var me = this,
            result;
        if(_phone.tac instanceof Array){
            result = me.randomPick(_phone.tac);
        }else{
            result = _phone.tac;
        }
        
        result += _phone.fac;
        var snr = '';
        for (var i = 0; i < 6; i++) {
            snr += me.random(9).toString();
        }
        result += snr;
        
        var validation = 0;
        result.split('').forEach(function (d, i) {
            var temp = parseInt(d);
            if (i % 2 === 0) {
                temp = temp * 2;
                validation += (Math.floor(temp / 10) + temp % 10);
            } else {
                validation += temp;
            }
        });
        validation = validation % 10;
        if (validation === 0) {
            result += "0";
        } else {
            result += String(10 - validation);
        }
        return result;
    },

    getSlaver : function(i){
        var me = this;
        return me.slaverList[Math.floor(i/15)% me.slaverList.length];
    },

    getAppRunner : function(appId){
        var me = this;
        var app = me.appList.filter(function(d){
            return d.id === appId;
        })[0];
        return {
            "appId" : appId,
            "scriptName" : app.scriptName,
            "scriptType": "NEW"
        };
    },

    getLCModel : function(jobId){
        var me = this;
        return me.appList.filter(function(d){
            return d.id === jobId
        })[0]['lcModel'].split(",");
    },

    getSubList : function(taskList, endIndex, dayIndex){
        var result =  JSON.parse(JSON.stringify(taskList.slice(0, endIndex)));
        result.forEach(function(d){
            var planExecDate = moment(d.planExecDate, 'YYYY/MM/DD');
            d.planExecDate = planExecDate.add(dayIndex+1,'d').format('YYYY/MM/DD');
            d.id = d.id.substr(0, d.id.length-1) + (dayIndex+1);
            d.appRunner.scriptType = "REPEAT";
        });
        return result;
    },

    generateTasks : function(job){
        var me = this;
        var taskList = [];
        var usersToCreate = parseFloat(job.newUsers);
        me.phoneTypeList.forEach(function(_phone, index){
            if(taskList.length > usersToCreate){
                return;
            }
            var count = Math.ceil(_phone.percent /100 * usersToCreate);
            for(var i=0; i< count; i++){
                var task = {
                    id: job.appId + _phone.MODEL + '_' + i + '_0',
                    jobId : job.id,
                    planExecDate : moment().format('YYYY/MM/DD'), //here uses new Date() for cycle creation
                    planExecPeriod : job.planExecPeriod,
                    status : "NONE",
                    phone: me.getPhone(_phone),
                    slaver : me.getSlaver(index * count + i),
                    appRunner: me.getAppRunner(job.appId),
                    createTime: moment().format('YYYY/MM/DD')
                };
                taskList.push(task);
            }
        });
        
        me.getLCModel(job.appId).forEach(function(percent, dayIndex){
            var list = me.getSubList(taskList, Math.ceil(parseFloat(percent) * usersToCreate/100), dayIndex);
            taskList = taskList.concat(list);
        });
        return taskList;
    }
};

router.get('/', function(req, res, next) {
    
    var job = req.query;
    if(job === null || job === {}) {
        return;
    }

    function fn(req, res){
        var allTasks = [];
        utils.generateTasks(job).forEach(function(d){
            req.db.get('task').insert(d);
        });
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.send(allTasks);
    }
    utils.init(req ,res, fn);
});

router.get('/all', function(req, res, next) {
	console.log('generate tasks for all jobs');
	var count = 0;
    function fn(req, res){
        req.db.get('job').find({status: 'GO'}, { stream: true})
	    .each(function(job){
	    	count++;
	    	utils.generateTasks(job).forEach(function(d){
	            req.db.get('task').insert(d);
	        });
	    })
	    .success(function(){
	    	res.setHeader('Content-Type', 'application/json;charset=utf-8');
	    	if(count === 0){
	    		res.send('NO_DATA');
	    	}else{
	    		res.send('DONE');
	    	}
	        
	    })
	    .error(function(err){
	        res.setHeader('Content-Type', 'application/json;charset=utf-8');
	        res.send(err);
	    });
        
    }
    utils.init(req ,res, fn);
});


router.get('/hold', function(req, res, next) {
	req.db.get('task').options.multi = true;
    req.db.get('task').update({jobId: req.query.id},{$set: {status: 'HOLD'}}, function(){
    	res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.send('DONE');
    })
    
});


router.get('/go', function(req, res, next) {
	req.db.get('task').options.multi = true;
    req.db.get('task').update({jobId: req.query.id},{$set: {status: 'NONE'}}, function(){
    	res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.send('DONE');
    })
    
});

module.exports = router;