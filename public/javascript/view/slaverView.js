Ext.require([
     'tm.model.SlaverViewModel'
]);

Ext.define('tm.view.SlaverView', {
	extend: 'Ext.container.Container',
	alias:'widget.slaverView',
	controller: Ext.create('tm.ViewController'),
	viewModel: {
        type: 'slavers'
    },
	items:[{
		xtype:'grid',
        modelValidation: true,
        bind:{
            store: '{data}'
        },
        requires:['Ext.grid.plugin.CellEditing'],
        plugins:[{
            ptype:'cellediting'
        }],
        reference:'grid',
        columns: [
            { text: 'slaverMAC', dataIndex: 'slaverMAC',editor:{
                bind:'{current.slaverMAC}',
                selectOnFocus: true
            } },
            { text: 'slaverIP', dataIndex: 'slaverIP',editor:{
                bind:'{current.slaverIP}',
                selectOnFocus: true
            } },
            { text: 'vpnMAC', dataIndex: 'vpnMAC',editor:{
                bind:'{current.vpnMAC}',
                selectOnFocus: true
            } },
            { text: 'vpnIP', dataIndex:'vpnIP',editor:{
                bind:'{current.vpnIP}',
                selectOnFocus: true
            } }, {
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
        tbar:['服务器列表','->',{
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
            fieldLabel: 'slaverMAC',
            name: 'slaverMAC',
            bind:'{current.slaverMAC}'
        },{
            fieldLabel: 'slaverIP',
            name: 'slaverIP',
            bind:'{current.slaverIP}'
        },{
            fieldLabel: 'vpnMAC',
            name: 'vpnMAC',
            bind:'{current.vpnMAC}'
        },{
            fieldLabel: 'vpnIP',
            name: 'vpnIP',
            bind:'{current.vpnIP}'
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