Ext.require([
     'tm.model.JobViewModel'
]);

Ext.define('tm.view.JobView', {
	extend: 'Ext.container.Container',
	alias:'widget.jobView',
	controller: Ext.create('tm.ViewController'),
	viewModel: {
        type: 'jobs'
    },
	items:[{
		xtype:'grid',
        modelValidation: true,
        bind:{
            store: '{data}'
        },
        requires:['<ext class="grid plugin CellEdit"></ext>ing'],
        plugins:[{
            ptype:'cellediting'
        }],
        reference:'grid',
        columns: [
            { text: 'id', dataIndex: 'id',editor:{
                bind:'{current.id}',
                selectOnFocus: true
            } },
            { text: 'appId', dataIndex: 'appId',editor:{
                bind:'{current.appId}',
                selectOnFocus: true
            } },
            { text: 'planExecDate', dataIndex: 'planExecDate',editor:{
                bind:'{current.planExecDate}',
                selectOnFocus: true
            } },
            { text: 'planExecPeriod', dataIndex: 'planExecPeriod',editor:{
                bind:'{current.planExecPeriod}',
                selectOnFocus: true
            } },
            { text: 'newUsers', dataIndex: 'newUsers',editor:{
                bind:'{current.newUsers}',
                selectOnFocus: true
            } },
            { text: 'status', dataIndex: 'status'},
            {
            	 xtype:'actioncolumn',
            	 items: [{
                     icon: '/img/remove.png',
                     tooltip: 'Delete',
                     selectOnFocus: true,
                     handler: 'onDelete'
                 }]
            }
        ],
        width: 800,
        autoScroll: true,
        height: 200,
        tbar:['任务列表','->',{
            text:'新增',
            handler: 'onAdd'
        
        }]
	},{
		xtype:'form',
        title: '详细信息',
        bodyPadding: 5,
        width: 350,
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },

        defaultType: 'textfield',
        items: [{
            fieldLabel: 'id',
            name: 'id',
            bind:'{current.id}'
        },{
            fieldLabel: 'appId',
            name: 'appId',
            bind:'{current.appId}'
        },{
            fieldLabel: 'planExecDate',
            name: 'planExecDate',
            bind:'{current.planExecDate}'
        },{
            fieldLabel: 'planExecPeriod',
            name: 'planExecPeriod',
            bind:'{current.planExecPeriod}'
        },{
            fieldLabel: 'newUsers',
            name: 'newUsers',
            bind:'{current.newUsers}'
        }],
        buttons:[{
            text:'提交',
            handler: 'onSubmit',
            disabled: true,
            bind:{
                disabled:'{!status.dirtyAndValid}'
            }
        },{
            text:'还原',
            handler:'onRevert',
            disabled: true,
            bind:{
                disabled:'{!status.dirty}'
            }
        }]
	}]
});