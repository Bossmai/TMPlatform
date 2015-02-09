Ext.require([
     'tm.model.SlaverViewModel'
]);

Ext.define('tm.view.SlaverView', {
	extend: 'Ext.container.Container',
	alias:'widget.slaverView',
	controller: Ext.create('tm.ViewController',{
		targetKey: 'currentSlaver'
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
                bind:'{currentGrid.name}',
                selectOnFocus: true
            } },
            { text: '描述', dataIndex: 'desc',editor:{
                bind:'{currentGrid.desc}',
                selectOnFocus: true
            } },
            { text: 'ip', dataIndex: 'ip',editor:{
                bind:'{currentGrid.ip}',
                selectOnFocus: true
            } },
            { text: 'MAC', dataIndex:'mac',editor:{
                bind:'{currentGrid.mac}',
                selectOnFocus: true
            } },
            { text: '初始百分比', dataIndex:'initialPercentage',editor:{
                bind:'{currentGrid.initialPercentage}',
                selectOnFocus: true
            } },
            { text: '创建时间', dataIndex:'createDate',editor:{
                bind:'{currentGrid.createDate}',
                selectOnFocus: true
            } }, {
            	 xtype:'actioncolumn',
            	 items: [{
                     icon: 'extjs/examples/restful/images/delete.png',
                     tooltip: 'Delete',
                     selectOnFocus: true,
                     handler: 'onDelete'
                 }]
            }
        ],
        width: 800,
        fbar: ['->',{
        	xtype: 'button',
        	text: '新增'
        }]
	},{
		xtype:'form',
        title: 'grid Form',
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
            bind:'{currentSlaver.name}'
        },{
            fieldLabel: 'desc',
            name: 'desc',
            bind:'{currentSlaver.desc}'
        },{
            fieldLabel: 'ip',
            name: 'ip',
            bind:'{currentSlaver.ip}'
        },{
            fieldLabel: 'mac',
            name: 'mac',
            bind:'{currentSlaver.mac}'
        },{
            fieldLabel: 'initialPercentage',
            name: 'initialPercentage',
            bind:'{currentSlaver.initialPercentage}'
        }],
        buttons:[{
            text:'submit',
            handler: 'onSubmit'
        },{
            text:'revert',
            handler:'onRevert'
        }]
	}]
});