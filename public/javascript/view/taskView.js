Ext.application({
    name: "ExtJSTest",
    launch: function(){

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