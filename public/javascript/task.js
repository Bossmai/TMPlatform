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

        Ext.define('taskController',{
            extend:'Ext.app.ViewController',
            alias:'controller.taskcontroller',
            onSubmit: function(){
                var task = this.getViewModel().get('currentTask');
                task.save();

            },
            onRevert: function(){
                var task = this.getViewModel().get('currentTask');
                task.reject();
            }
        });

        Ext.create('Ext.container.Container', {
            viewModel: {
                type: 'tasks'
            },
            controller: 'taskcontroller',
            items:[{
                xtype:'grid',
                title:'Task Grid',
                modelValidation: true,
                bind:{
                    store: '{tasks}',
                    title:'{currentTask.id}'
                },
                requires:['Ext.grid.plugin.CellEditing'],
                plugins:[{
                    ptype:'cellediting'
                }],
                reference:'taskgrid',
                columns: [
                    { text: 'jobId',  dataIndex: 'jobId',editor:{
                        bind:'{currentGrid.jobId}',
                        selectOnFocus: true
                    } },
                    { text: 'planExecDate', dataIndex: 'planExecDate'},
                    { text: 'planExecPeriod', dataIndex: 'planExecPeriod'},
                    { text: 'status', dataIndex: 'status' },
                    { text: 'manufacturer', dataIndex:'phone', renderer: function(phone){return phone.manufacturer}},
                    { text: 'modelName', dataIndex:'phone', renderer: function(phone){return phone.modelName}},
                    { text: 'modelId', dataIndex:'phone', renderer: function(phone){return phone.modelId}},
                    { text: 'wifiMAC', dataIndex:'phone', renderer: function(phone){return phone.wifiMAC}},
                    { text: 'imei', dataIndex:'phone', renderer: function(phone){return phone.imei}},
                    { text: 'imsi', dataIndex:'phone', renderer: function(phone){return phone.imsi}},
                    { text: 'slaverMAC', dataIndex:'slaver', renderer: function(slaver){return slaver.slaverMAC}},
                    {}
                ],
                width: 1200
            },{
                xtype:'form',
                title: 'task Form',
                bodyPadding: 5,
                width: 350,
                // Fields will be arranged vertically, stretched to full width
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },

                // The fields
                defaultType: 'textfield',
                items: [{
                    fieldLabel: 'jobId',
                    name: 'jobId',
                    bind:{
                        value: '{currentTask.jobId}'
                    },
                    allowBlank: false
                },{
                    fieldLabel: 'planExecDate',
                    name: 'planExecDate',
                    bind:{
                        value: '{currentTask.planExecDate}'
                    },
                    allowBlank: false
                }],
                buttons:[{
                    text:'submit',
                    handler: 'onSubmit'/*,
                    disabled: true,
                    bind:{
                        disabled:'{!status.dirtyAndValid}'
                    }*/

                },{
                    text:'revert',
                    handler:'onRevert'/*,
                    disabled: true,
                    bind:{
                        disabled:'{!status.dirty}'
                    }*/
                }]

            }],
            renderTo: Ext.getBody()
        });

    }
});  