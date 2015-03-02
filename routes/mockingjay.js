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
            me.appList = [{
                id: 'ifengnews',
                "packageName" : "com.ifeng.new2",
                "scriptName" : "ifeng.bat",
                lcModel : [45,44,43,42,41,41,41,41,41,41,41,41,41,41,41]
            }];

            //TODO need add sort by percent;
            req.db.get('phoneType').find({},{sort:{percent:-1}}, function(err, docs) {
                me.phoneTypeList = docs;
                fn(req, res);
            });
        });
    },

    random : function(max){
        return Math.ceil(Math.random() * max);
    },

    getPhone: function (_phone) {
        var me = this;
        return {
            "getBSSID" : me.getRandom16(5),
            "getDeviceId" : me.getRandom(15),
            "getMacAddress": me.getMAC(_phone),
            "getNetworkOperator" : '460' + _phone.mnc,
            "getPhoneType" : _phone.mnc,
            "getSimOperator" : '460' + _phone.mnc,
            "getSimSerialNumber" : me.getRandom(18),
            "getSubscriberId" : me.getIMEI(_phone),
            "BRAND" :  _phone.BRAND,
            "DEVICE" :  _phone.DEVICE,
            "HARDWARE" :  _phone.HARDWARE,
            "MANUFACTURER" : _phone.MANUFACTURER,
            "MODEL": _phone.MODEL,
            "PRODUCT" : _phone.PRODUCT
        };
    },
    getRandom16: function(length){
        var me = this,
            result = '';
        for (var i = 0; i < length; i++) {
            result += "-" + me.random(255).toString(16);
        }
        return result.substr(1);
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
            result = _phone.mac6[me.random( _phone.mac6.length)];
        }else{
            result = _phone.mac6;
        }
        for (var i = 0; i < 3; i++) {
            result += "-" + me.random(255).toString(16);
        }
        return result;
    },

    getIMEI: function (_phone) {
        var me = this,
            result;
        if(_phone.tac instanceof Array){
            result = _phone.tac[me.random( _phone.tac.length)];
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
        var x = 15;
        return me.slaverList[Math.floor(i/15)% me.slaverList.length];
    },

    getAppRunner : function(appId){
        var me = this;
        var app = me.appList.filter(function(d){
            return d.id === appId;
        })[0];
        return {
            "appId" : appId,
            "packageName" : app.packageName

        };
    },

    getLCModel : function(jobId){
        var me = this;
        return me.appList.filter(function(d){
            return d.id === jobId
        })[0]['lcModel'];
    },

    getSubList : function(taskList, endIndex, dayIndex){
        var result =  JSON.parse(JSON.stringify(taskList.slice(0, endIndex)));
        result.forEach(function(d){
            var planExecDate = moment(d.planExecDate);
            d.planExecDate = planExecDate.add(dayIndex+1,'d').format('YYYY-MM-DD');
        });
        return result;
    },

    generateTasks : function(job){
        var me = this;
        var taskList = [];
        me.phoneTypeList.forEach(function(_phone, index){
            var count = Math.ceil(_phone.percent /100 * job.newUsers);
            for(var i=0; i< count; i++){
                var task = {
                    id: job.appId + _phone.modelId + i + '_1',
                    jobId : job.pId,
                    planExecDate : job.planExecDate,
                    planExecPeriod : job.planExecPeriod,
                    status : "NONE",
                    phone: me.getPhone(_phone),
                    slaver : me.getSlaver(index * count + i),
                    appRunner: me.getAppRunner(job.appId),
                    createTime: moment().format('YYYY-MM-DD')
                };
                taskList.push(task);
            }
        });

        me.getLCModel(job.appId).forEach(function(percent, dayIndex){
            var list = me.getSubList(taskList, Math.ceil(percent * job.newUsers/100), dayIndex);
            taskList = taskList.concat(list);
        });
        return taskList;
    }
};

router.get('/', function(req, res, next) {

    var job = {
        pId : "ifengnews001",
        appId : 'ifengnews',
        planExecDate : '2015-01-01',
        planExecPeriod : '7-22',
        newUsers: 300
    };

//    var jon = JSON.stringify(req.body);

    function fn(req, res){
        var tasks = utils.generateTasks(job);
        tasks.forEach(function(d){
            req.db.get('task').insert(d);
        });
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.send(tasks);
    };
    utils.init(req ,res, fn);
});

module.exports = router;