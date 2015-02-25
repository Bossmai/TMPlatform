var express = require('express'),
    router = express.Router(),
    moment = require('moment');

var companyList = [{
    id:'D008',
    percentage: 73
},{
    id: 'D000',
    percentage: 27
}];

var phoneTypeList = [{
    id: '1',
    companyId: 'D008',
    tac: '861698',
    fac1: '00',
    mac6: '56:32:11 ',
    "manufacturer" : "联想",
    "modelName" : "V880",
    "modelId" : "V880",
    MNC : '02',
    percentage: 30
},{
    id: '2',
    companyId: 'D008',
    fac1: '01',
    tac: '865316',
    mac6: '32:22:11',
    "manufacturer" : "联想",
    "modelName" : "U795",
    "modelId" : "U795",
    MNC : '02',
    percentage: 70
},{
    id: '3',
    companyId: 'D000',
    tac: '353614',
    mac6: '22:32:11',
    fac1: '04',
    "manufacturer" : "三星",
    "modelName" : "T328w",
    "modelId" : "T328w",
    MNC : '02',
    percentage: 15
},{
    id: '4',
    companyId: 'D000',
    tac: '355868',
    mac6: '34:56:90',
    fac1: '05',
    "manufacturer" : "三星",
    "modelName" : "802w-2",
    "modelId" : "802w-2",
    MNC : '02',
    percentage: 30
},{
    id: '4',
    companyId: 'D000',
    tac: '359788',
    mac6: '70:34:28',
    "manufacturer" : "三星",
    "modelName" : "Desire-HD-2",
    "modelId" : "Desire-HD-2",
    MNC : '02',
    percentage: 55
}];

var project = {
    pId : "ifengnews001",
    appId : 'ifengnews',
    planExecDate : '2015-01-01',
    planExecPeriod : '7-22',
    newUsers: 100
};

function generateTasks(project){
    var taskList = [];
    var temp = {};
    companyList.map(function(c){
        temp[c.id]= c.percentage;
    });
    phoneTypeList.forEach(function(_phone, index){
        var count = Math.ceil(_phone.percentage * temp[_phone.companyId]/10000 * project.newUsers);
        for(var i=0; i< count; i++){
            var task = {
                id: project.appId + _phone.modelId + i + '_1',
                projectId : project.pId,
                planExecDate : project.planExecDate,
                planExecPeriod : project.planExecPeriod,
                status : "NONE",
                phone: getPhone(_phone),
                slaver : getSlaver(index * count + i),
                appRunner: getAppRunner(project.appId),
                createTime: moment().format('YYYY-MM-DD')
            };
            taskList.push(task);
        }
    });

    var lcModel = appList.filter(function(d){
        return d.id === project.appId;
    })[0].lcModel;
    lcModel.forEach(function(percent, dayIndex){
        var list = getSubList(taskList, Math.ceil(percent * project.newUsers/100), dayIndex);
        taskList = taskList.concat(list);
    });
    return taskList;
}

function getSubList(taskList, endIndex, dayIndex){
    var result =  JSON.parse(JSON.stringify(taskList.slice(0, endIndex)));
    result.forEach(function(d){
        var planExecDate = moment(d.planExecDate);
        d.planExecDate = planExecDate.add(dayIndex+1,'d').format('YYYY-MM-DD');
    });
    return result;
}

function getSlaver(i){
    var slaverList = [{
        "slaverMAC" : "8C-70-5A-9C-71-C4",
        "slaverIP" : "192.168.3.105",
        "vpnMAC" : "08-00-27-00-A0-17",
        "vpnIP" : "192.168.56.1"
    },{
        "slaverMAC" : "1C-70-5A-9C-71-C5",
        "slaverIP" : "192.168.3.106",
        "vpnMAC" : "08-00-27-00-A0-16",
        "vpnIP" : "192.168.56.2"
    }];

    var x = 15;
    return slaverList[Math.floor(i/15)% slaverList.length];
}

var appList = [{
    id: 'ifengnews',
    "packageName" : "com.ifeng.new2",
    "scriptName" : "ifeng.bat",
    lcModel : [45,44,43,42,41,41,41,41,41,41,41,41,41,41,41]
}];

function getAppRunner(appId){

    var app = appList.filter(function(d){
        return d.id === appId;
    })[0];

    return {
        "appId" : appId,
        "packageName" : app.packageName

    };
}

function getPhone(_phone){

    function getMAC(_phone){
        var result = _phone.mac6.trim();
        for(var i=0; i<3; i++){
            result += ":" + Math.round(Math.random() * 255).toString(16);
        }
        return result;
    }

    function getIMEI(_phone){
        var result = _phone.tac;
        result += _phone.fac1;
        var snr = '';
        for(var i=0; i< 6; i++){
            snr += Math.round(Math.random() * 9).toString();
        }
        result += snr;
        var validation = 0;
        result.split('').forEach(function(d, i){
            var temp = parseInt(d);
            if(i%2===0){
                temp = temp*2;
                validation += (Math.floor(temp/10) + temp%10);
            }else{
                validation += temp;
            }
        });
        validation =  validation %10;
        if(validation === 0){
            result += "0";
        }else{
            result += String(10-validation);
        }
        return result;
    }

    function getIMSI(_phone){
        var MCC = 460; // china
        var MNC = _phone.MNC;
        var temp = "1111111111";
        return MCC + MNC + temp;
    }

    return {
        manufacturer: _phone.manufacturer,
        modelName : _phone.modelName,
        modelId : _phone.modelId,
        wifiMAC : getMAC(_phone),
        imei : getIMEI(_phone),
        imsi : getIMSI(_phone)
    };
}

router.get('/', function(req, res, next) {

    var tasks = generateTasks(project);
    tasks.forEach(function(d){
        req.db.get('task').insert(d);
    });
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.send(tasks);
});

module.exports = router;