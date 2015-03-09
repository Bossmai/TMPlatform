Ext.require([
     'tm.model.PhoneTypeViewModel'
]);

Ext.define('tm.view.PhoneTypeView', {
	extend: 'Ext.container.Container',
	alias:'widget.phoneTypeView',
	controller: Ext.create('tm.ViewController',{
		storeKey: 'phoneTypes'
	}),
	viewModel: {
        type: 'phoneTypes'
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
            { text: 'MANUFACTURER', dataIndex: 'MANUFACTURER',editor:{
                bind:'{current.MANUFACTURER}',
                selectOnFocus: true
            } },
            { text: 'BRAND', dataIndex: 'BRAND',editor:{
                bind:'{current.BRAND}',
                selectOnFocus: true
            } },
            { text: 'HARDWARE', dataIndex: 'HARDWARE',editor:{
                bind:'{current.HARDWARE}',
                selectOnFocus: true
            } },
            { text: 'MODEL', dataIndex: 'MODEL',editor:{
                bind:'{current.MODEL}',
                selectOnFocus: true
            } },
            { text: 'PRODUCT', dataIndex: 'PRODUCT',editor:{
                bind:'{current.PRODUCT}',
                selectOnFocus: true
            } },
            { text: 'DEVICE', dataIndex: 'DEVICE',editor:{
                bind:'{current.DEVICE}',
                selectOnFocus: true
            } },
            { text: 'mac6', dataIndex: 'mac6',editor:{
                bind:'{current.mac6}',
                selectOnFocus: true
            } },
            { text: 'fac', dataIndex:'fac',editor:{
                bind:'{current.fac}',
                selectOnFocus: true
            } },
            { text: 'tac', dataIndex:'tac',editor:{
                bind:'{current.tac}',
                selectOnFocus: true
            } },
            { text: 'mnc', dataIndex:'mnc',editor:{
                bind:'{current.mnc}',
                selectOnFocus: true
            } }, 
            { text: 'percent', dataIndex:'percent',editor:{
                bind:'{current.percent}',
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
        tbar:['机型列表','->',{
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
            fieldLabel: 'MANUFACTURER',
            name: 'MANUFACTURER',
            bind:'{current.MANUFACTURER}'
        },{
            fieldLabel: 'BRAND',
            name: 'BRAND',
            bind:'{current.BRAND}'
        },{
            fieldLabel: 'HARDWARE',
            name: 'HARDWARE',
            bind:'{current.HARDWARE}'
        },{
            fieldLabel: 'MODEL',
            name: 'MODEL',
            bind:'{current.MODEL}'
        },{
            fieldLabel: 'PRODUCT',
            name: 'PRODUCT',
            bind:'{current.PRODUCT}'
        },{
            fieldLabel: 'DEVICE',
            name: 'DEVICE',
            bind:'{current.DEVICE}'
        },{
            fieldLabel: 'mac6',
            name: 'mac6',
            bind:'{current.mac6}'
        },{
            fieldLabel: 'fac',
            name: 'fac',
            bind:'{current.fac}'
        },{
            fieldLabel: 'tac',
            name: 'tac',
            bind:'{current.tac}'
        },{
            fieldLabel: 'mnc',
            name: 'mnc',
            bind:'{current.mnc}'
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