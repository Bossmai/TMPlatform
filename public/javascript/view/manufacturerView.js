//厂商编号	厂商名称	占有率	联系人	联系电话	Email	是否有效	录入日期
//'id','name','percentage','contactorName','contactPhone', 'email', 'isValid', 'createDate'
Ext.require([
     'tm.model.ManufacturerViewModel'
]);

Ext.define('tm.view.ManufacturerView', {
	extend: 'Ext.container.Container',
	alias:'widget.manufactureryView',
	controller: Ext.create('tm.ViewController',{}),
	viewModel: {
        type: 'companies'
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
            { text: '厂商名称', dataIndex: 'name',editor:{
                bind:'{current.name}',
                selectOnFocus: true
            } },
            { text: '占有率', dataIndex: 'percentage',editor:{
                bind:'{current.percentage}',
                selectOnFocus: true
            } },
            { text: '是否有效', dataIndex:'isValid',editor:{
                bind:'{current.isValid}',
                selectOnFocus: true
            } }, 
            { text: '录入日期', dataIndex:'createDate',editor:{
                bind:'{current.createDate}',
                selectOnFocus: true
            } }, {
            	 xtype:'actioncolumn',
            	 items: [{
                     icon: '/img/remove.png',
                     tooltip: '删除',
                     selectOnFocus: true,
                     handler: 'onDelete'
                 }]
            }
        ],
        width: 800,
        autoScroll: true,
        height: 200,
        tbar:['厂商列表','->',{
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
            fieldLabel: '厂商名称',
            name: 'name',
            bind:'{current.name}'
        },{
            fieldLabel: '占有率',
            name: 'percentage',
            bind:'{current.percentage}'
        },{
            fieldLabel: '是否有效',
            name: 'isValid',
            bind:'{current.isValid}'
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