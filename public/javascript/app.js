Ext.application({
    name: "ExtJSTest",
    launch: function(){

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
                'createTime','assignTime','execStartTime','exceEndTime','log','ports']
        });

        var store = Ext.create('Ext.data.Store', {
            storeId:'taskStore',
            model: 'Task',
            proxy: {
                type: 'rest',
                url: 'task'
            }
        });

        store.load();

        Ext.create('Ext.grid.Panel', {
            title: 'Tasks',
            store: store,
            columns: [
                { text: 'jobId',  dataIndex: 'jobId' },
                { text: 'planExecDate', dataIndex: 'planExecDate'},
                { text: 'planExecPeriod', dataIndex: 'planExecPeriod'},
                { text: 'status', dataIndex: 'status' },
                { text: 'manufacturer', dataIndex:'phone', renderer: function(phone){return phone.manufacturer}},
                { text: 'modelName', dataIndex:'phone', renderer: function(phone){return phone.modelName}},
                { text: 'modelId', dataIndex:'phone', renderer: function(phone){return phone.modelId}},
                { text: 'wifiMAC', dataIndex:'phone', renderer: function(phone){return phone.wifiMAC}},
                { text: 'imei', dataIndex:'phone', renderer: function(phone){return phone.imei}},
                { text: 'imsi', dataIndex:'phone', renderer: function(phone){return phone.imsi}},
                { text: 'slaverMAC', dataIndex:'slaver', renderer: function(slaver){return slaver.slaverMAC}}
            ],
            height: 400,
            width: 1200,
            renderTo: Ext.getBody()
        });
    }
});  