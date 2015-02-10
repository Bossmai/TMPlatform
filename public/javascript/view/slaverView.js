Ext.require([
     'tm.model.SlaverViewModel'
]);

Ext.define('tm.view.SlaverView', {
	extend: 'Ext.container.Container',
	alias:'widget.slaverView',
	controller: Ext.create('tm.ViewController',{
		formularKey: 'current',
		storeKey: 'slavers'
	}),
	viewModel: {
        type: 'slavers'
    },
	items:[{
		xtype:'grid',
        modelValidation: true,
        bind:{
            store: '{slavers}'
        },
        requires:['Ext.grid.plugin.CellEditing'],
        plugins:[{
            ptype:'cellediting'
        }],
        reference:'slavergrid',
        columns: [
            { text: '名称', dataIndex: 'name',editor:{
                bind:'{current.name}',
                selectOnFocus: true
            } },
            { text: '描述', dataIndex: 'desc',editor:{
                bind:'{current.desc}',
                selectOnFocus: true
            } },
            { text: 'ip', dataIndex: 'ip',editor:{
                bind:'{current.ip}',
                selectOnFocus: true
            } },
            { text: 'MAC', dataIndex:'mac',editor:{
                bind:'{current.mac}',
                selectOnFocus: true
            } },
            { text: '初始百分比', dataIndex:'initialPercentage',editor:{
                bind:'{current.initialPercentage}',
                selectOnFocus: true
            } },
            { text: '创建时间', dataIndex:'createDate',editor:{
                bind:'{current.createDate}',
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
            fieldLabel: 'name',
            name: 'name',
            bind:'{current.name}',
        },{
            fieldLabel: 'desc',
            name: 'desc',
            bind:'{current.desc}'
        },{
            fieldLabel: 'ip',
            name: 'ip',
            bind:'{current.ip}'
        },{
            fieldLabel: 'mac',
            name: 'mac',
            bind:'{current.mac}'
        },{
            fieldLabel: 'initialPercentage',
            name: 'initialPercentage',
            bind:'{current.initialPercentage}'
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