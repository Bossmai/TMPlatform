Ext.require([
     'tm.model.JobViewModel'
]);

Ext.define('tm.view.JobView', {
	extend: 'Ext.container.Container',
	alias:'widget.jobView',
	controller: Ext.create('tm.JobViewController'),
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
            { text: 'newUsers', dataIndex: 'newUsers',editor:{
                bind:'{current.newUsers}',
                selectOnFocus: true
            } },
            { text: 'status', dataIndex: '_status'},
            { text: 'priority', dataIndex: 'priority'},
            {
            	 xtype:'actioncolumn',
            	 items: [{
                     icon: '/img/go.gif',
                     tooltip: 'go',
                     selectOnFocus: true,
                     handler: 'onGo'
                 },{
                     icon: '/img/hold.gif',
                     tooltip: 'hold',
                     selectOnFocus: true,
                     handler: 'onHold'
                 },{
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
            fieldLabel: 'newUsers',
            name: 'newUsers',
            bind:'{current.newUsers}'
        },{
            fieldLabel: 'status',
            name: '_status',
            bind:'{current._status}'
        },{
            fieldLabel: 'priority',
            name: 'priority',
            bind:'{current.priority}'
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