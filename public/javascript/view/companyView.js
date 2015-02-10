//厂商编号	厂商名称	占有率	联系人	联系电话	Email	是否有效	录入日期
//'id','name','percentage','contactorName','contactPhone', 'email', 'isValid', 'createDate'
Ext.require([
     'tm.model.CompanyViewModel'
]);

Ext.define('tm.view.CompanyView', {
	extend: 'Ext.container.Container',
	alias:'widget.companyView',
	controller: Ext.create('tm.ViewController',{
		storeKey: 'companies'
	}),
	viewModel: {
        type: 'companies'
    },
	items:[{
		xtype:'grid',
        modelValidation: true,
        bind:{
            store: '{companies}'
        },
        requires:['Ext.grid.plugin.CellEditing'],
        plugins:[{
            ptype:'cellediting'
        }],
        reference:'companygrid',
        columns: [
            { text: '厂商名称', dataIndex: 'name',editor:{
                bind:'{current.name}',
                selectOnFocus: true
            } },
            { text: '占有率', dataIndex: 'percentage',editor:{
                bind:'{current.percentage}',
                selectOnFocus: true
            } },
            { text: '联系人', dataIndex: 'contactorName',editor:{
                bind:'{current.contactorName}',
                selectOnFocus: true
            } },
            { text: '联系电话', dataIndex:'contactPhone',editor:{
                bind:'{current.contactPhone}',
                selectOnFocus: true
            } },
            { text: 'Email', dataIndex:'email',editor:{
                bind:'{current.email}',
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
                     tooltip: 'Delete',
                     selectOnFocus: true,
                     handler: 'onDelete'
                 }]
            }
        ],
        width: 800,
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
      //厂商编号	厂商名称	占有率	联系人	联系电话	Email	是否有效	录入日期
      //'id','name','percentage','contactorName','contactPhone', 'email', 'isValid', 'createDate'
        defaultType: 'textfield',
        items: [{
            fieldLabel: '厂商名称',
            name: 'name',
            bind:'{current.name}',
        },{
            fieldLabel: '占有率',
            name: 'percentage',
            bind:'{current.percentage}'
        },{
            fieldLabel: '联系人',
            name: 'contactorName',
            bind:'{current.contactorName}'
        },{
            fieldLabel: '联系电话',
            name: 'contactPhone',
            bind:'{current.contactPhone}'
        },{
            fieldLabel: 'Email',
            name: 'email',
            bind:'{current.email}'
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