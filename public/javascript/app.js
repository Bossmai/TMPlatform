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

        Ext.define('taskViewModel', {
            extend: 'Ext.app.ViewModel',
            alias: 'viewmodel.tasks',
            stores: {
            	tasks:{
            		model: 'Task',
            		autoLoad: true,
            		proxy: {
                      type: 'rest',
                      url: 'task'
            		}
            	}
            }
        });
        
        Ext.define('singleTaskViewModel', {
            extend: 'Ext.app.ViewModel',
            alias: 'viewmodel.singleTask'
        });
        
        var singleTask = new singleTaskViewModel();

        Ext.create('Ext.grid.Panel', {
            
            viewModel: {
            	type: 'tasks'
            },
            bind:{
            	store: '{tasks}'
            },
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
            width: 1200,
            renderTo: Ext.getBody(),
            listeners: {
            	rowclick: function(el,record, tr, rowIndex, e, eOpts){
            		 singleTask.setData(record.data);
            	}
            }
        });
        
        
        Ext.create('Ext.form.Panel', {
            title: 'task Form',
            bodyPadding: 5,
            width: 350,
            // Fields will be arranged vertically, stretched to full width
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            viewModel: singleTask,
            // The fields
            defaultType: 'textfield',
            items: [{
                fieldLabel: 'jobId',
                name: 'jobId',
                bind:{
                	value: '{jobId}'
                },
                allowBlank: false
            },{
                fieldLabel: 'planExecDate',
                name: 'planExecDate',
                bind:{
                	value: '{planExecDate}'
                },
                allowBlank: false
            },{
                xtype:'button',
                text:'submit',
                handler: function(){
                	var data =singleTask.getData();
                	Ext.Ajax.request({
                		method: 'post',
                	    url: 'task/update/'+data.id,
                	    params: {jobId:2},
                	    success: function(response){
                	        var text = response.responseText;
                	        
                	    }
                	});
                }
            }],
            
            renderTo: Ext.getBody()
        });
    }
});  