var express = require('express'),
    router = express.Router(),
    moment = require('moment');

var utils = {
    slaverList : undefined,
    appList : undefined,
    companies : undefined,
    phoneTypeList: undefined,

    init: function(req){
        var me = this;
        req.db.get('slaver').find({}, function(err, docs) {
            me.slaverList = docs;
        });

        req.db.get('app').find({}, function(err, docs) {
            me.appList = docs;
        });

        req.db.get('company').find({}, function(err, docs) {
            docs.map(function(c){
                me.companies[c.id]= c.percentage;
            });
        });

        req.db.get('phoneType').find({}, function(err, docs) {
            me.phoneTypeList = docs;
        });

//        me.companies = {
//            'D008': 73,
//            'D000': 27
//        };
//
//        me.slaverList = [{
//            "slaverMAC" : "8C-70-5A-9C-71-C4",
//            "slaverIP" : "192.168.3.105",
//            "vpnMAC" : "08-00-27-00-A0-17",
//            "vpnIP" : "192.168.56.1"
//        },{
//            "slaverMAC" : "1C-70-5A-9C-71-C5",
//            "slaverIP" : "192.168.3.106",
//            "vpnMAC" : "08-00-27-00-A0-16",
//            "vpnIP" : "192.168.56.2"
//        }];
//
//        me.phoneTypeList = [{
//            id: '1',
//            companyId: 'D008',
//            tac: '861698',
//            fac1: '00',
//            mac6: '56:32:11 ',
//            "manufacturer" : "联想",
//            "modelName" : "V880",
//            "modelId" : "V880",
//            MNC : '02',
//            percentage: 30
//        },{
//            id: '2',
//            companyId: 'D008',
//            fac1: '01',
//            tac: '865316',
//            mac6: '32:22:11',
//            "manufacturer" : "联想",
//            "modelName" : "U795",
//            "modelId" : "U795",
//            MNC : '02',
//            percentage: 70
//        },{
//            id: '3',
//            companyId: 'D000',
//            tac: '353614',
//            mac6: '22:32:11',
//            fac1: '04',
//            "manufacturer" : "三星",
//            "modelName" : "T328w",
//            "modelId" : "T328w",
//            MNC : '02',
//            percentage: 15
//        },{
//            id: '4',
//            companyId: 'D000',
//            tac: '355868',
//            mac6: '34:56:90',
//            fac1: '05',
//            "manufacturer" : "三星",
//            "modelName" : "802w-2",
//            "modelId" : "802w-2",
//            MNC : '02',
//            percentage: 30
//        },{
//            id: '4',
//            companyId: 'D000',
//            tac: '359788',
//            mac6: '70:34:28',
//            "manufacturer" : "三星",
//            "modelName" : "Desire-HD-2",
//            "modelId" : "Desire-HD-2",
//            MNC : '02',
//            percentage: 55
//        }];
//
//        me.appList = [{
//            id: 'ifengnews',
//            "packageName" : "com.ifeng.new2",
//            "scriptName" : "ifeng.bat",
//            lcModel : [45,44,43,42,41,41,41,41,41,41,41,41,41,41,41]
//        }];

    },

    getPhone: function (_phone) {
        var me = this;
        return {
            manufacturer: _phone.manufacturer,
            modelName: _phone.modelName,
            modelId: _phone.modelId,
            wifiMAC: me.getMAC(_phone),
            imei: me.getIMEI(_phone),
            imsi: me.getIMSI(_phone)
        };

    },
    getMAC: function (_phone) {
        var result = _phone.mac6.trim();
        for (var i = 0; i < 3; i++) {
            result += ":" + Math.round(Math.random() * 255).toString(16);
        }
        return result;
    },

    getIMEI: function (_phone) {
        var result = _phone.tac;
        result += _phone.fac1;
        var snr = '';
        for (var i = 0; i < 6; i++) {
            snr += Math.round(Math.random() * 9).toString();
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

    getIMSI: function (_phone) {
        var MCC = 460; // china
        var MNC = _phone.MNC;
        var temp = "1111111111";
        return MCC + MNC + temp;
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
            var count = Math.ceil(_phone.percentage * me.companies[_phone.companyId]/10000 * job.newUsers);
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
    utils.init(req);

    var job = {
        pId : "ifengnews001",
        appId : 'ifengnews',
        planExecDate : '2015-01-01',
        planExecPeriod : '7-22',
        newUsers: 100
    };

    var tasks = utils.generateTasks(job);
    tasks.forEach(function(d){
        req.db.get('task').insert(d);
    });
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.send(tasks);
});

module.exports = router;