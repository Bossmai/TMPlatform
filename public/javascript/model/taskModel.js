Ext.define('Phone',{
    extend: 'Ext.data.Model',
    fields :['manufacturer','modelName','modelId','wifiMAC','imei','imsi']
});

Ext.define('OsVersion',{
    extend: 'Ext.data.Model',
    fields :['targetName','sdkLevel','customPlatform']
});

Ext.define('ScreenDensity',{
    extend: 'Ext.data.Model',
    fields :['dpi','customDensity']
});

Ext.define('ScreenResolution',{
    extend: 'Ext.data.Model',
    fields :['skinName','customResolution','dimensionString']
});

Ext.define('Emulator',{
    extend: 'Ext.data.Model',
    fields :['avdName',
        {name:'osVersion', reference:'OsVersion'},
        {name:'screenDensity', reference:'ScreenDensity'},
        {name:'screenResolution', reference:'ScreenResolution'}]
});

Ext.define('Slaver',{
    extend: 'Ext.data.Model',
    fields :['slaverMAC','slaverIP','vpnMAC','vpnIP']
});

Ext.define('AppRunner',{
    extend: 'Ext.data.Model',
    fields :['appId','packageName','appName','appType','scriptName','scriptType']
});

Ext.define('Task',{
    extend: 'Ext.data.Model',
    fields :['_id','id','jobId','planExecDate','planExecPeriod','status',
        {name:'phone', reference:'Phone'},
        {name:'emulator', reference:'Emulator'},
        {name:'slaver', reference:'Slaver'},
        {name:'appRunner', reference:'AppRunner'},
        'createTime','assignTime','execStartTime','exceEndTime','log','ports'],
    proxy: {
    type: 'rest',
        url: 'task'
}
});

Ext.define('taskViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.tasks',
    stores: {
    	tasks:{
    		model: 'Task',
    		autoLoad: true
    	}
    },

    formulas:{
        currentTask:{
            bind:{
                bindTo:'{taskgrid.selection}',
                deep: true
            },
            get: function(task){
                return task;
            },
            set: function(task){
                if(!task.isModel){
                    task =  this.get('tasks').getById(task);
                    this.set('currentTask', task);
                }
            }
        },

        status:{
            bind:{
                bindTo:'currentTask',
                deep:true
            },

            get: function(task){
                var ret = {
                    dirty:task?task.dirty:false,
                    valid:task && task.isModel? task.isValid() : false
                };
                ret.dirtyAndValid = ret.dirty && ret.valid;
                return ret;
            }
        }

    }
});