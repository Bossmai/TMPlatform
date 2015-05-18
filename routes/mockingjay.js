var express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    uuid = require('node-uuid');

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
            if (i % 2 === 1) {
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

    getSlaver : function(slaverMAC){
        var me = this;
        var temp = me.slaverList.filter(function(d){
            return d.slaverMAC === slaverMAC;
        });
        if(temp.length > 0){
        	return temp[0];
        }else{
        	return {
        		slaverMAC: slaverMAC
        	};
        }
       
    },

    getAppRunner : function(appId){
        var me = this;
        var app = me.appList.filter(function(d){
            return d.id === appId;
        })[0];
        return {
            "appId" : appId,
            "scriptName" : app.scriptName,
            "scriptType": "NEW",
			"needRepeat": app.needRepeat?app.needRepeat:true
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
            d.id = d.id + "_" + datIndex;
            d.appRunner.scriptType = "REPEAT";
        });
        return result;
    },

    generateTasks : function(job, slaverMAC){
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
                    id: job.appId + _phone.MODEL + i + uuid.v1() + (new Date()-0) ,
                    jobId : job.id,
                    isHold: false,
                    planExecDate : moment().format('YYYY/MM/DD'), //here uses new Date() for cycle creation
                    planExecPeriod : job.planExecPeriod,
                    status : "NONE",
                    phone: me.getPhone(_phone),
                    slaver : me.getSlaver(slaverMAC),
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
    
    var job = req.query.job;
    if(job === null || job === {}) {
    	logger.info("no job configured, return !");
        return;
    }
    var slaverMAC = req.query.slaverMAC;
    if(job === null || job === {}) {
    	logger.info("no slaverMAC configured, return !");
        return;
    }

    function fn(req, res){
        var allTasks = [];
        utils.generateTasks(job, slaverMAC).forEach(function(d){
            req.db.get('task').insert(d);
        });
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.send(allTasks);
    }
    utils.init(req ,res, fn);
});

router.get('/hold', function(req, res, next) {
	req.db.get('task').options.multi = true;
    req.db.get('task').update({jobId: req.query.id},{$set: {isHold: true}}, function(){
    	res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.send('DONE');
    })
    
});


router.get('/go', function(req, res, next) {
	req.db.get('task').options.multi = true;
    req.db.get('task').update({jobId: req.query.id},{$set: {isHold: false}}, function(){
    	res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.send('DONE');
    })
    
});

module.exports = router;