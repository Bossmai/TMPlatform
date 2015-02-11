//序号	厂商编号	厂商名称	机型	分辨率	占有率	TAC	产地1	产地2	MAC6	品牌	网	配置文件	创建时间
//'_id','id','companyId','companyName','type','display', 'percentage', 'TAC', 'madeIn', 'madeIn2', 'mac', 'brand', 'network', 'configFile', 'createDate'
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
			{ text: '厂商编号', dataIndex: 'companyId',editor:{
			    bind:'{current.companyId}',
			    selectOnFocus: true
			} },
            { text: '厂商名称', dataIndex: 'companyName',editor:{
                bind:'{current.companyName}',
                selectOnFocus: true
            } },
            { text: '机型', dataIndex: 'type',editor:{
                bind:'{current.type}',
                selectOnFocus: true
            } },
            { text: '分辨率', dataIndex: 'display',editor:{
                bind:'{current.display}',
                selectOnFocus: true
            } },
            { text: 'TAC', dataIndex: 'TAC',editor:{
                bind:'{current.TAC}',
                selectOnFocus: true
            } },
            { text: '产地1', dataIndex: 'madeIn',editor:{
                bind:'{current.madeIn}',
                selectOnFocus: true
            } },
            { text: '产地2', dataIndex:'madeIn2',editor:{
                bind:'{current.madeIn2}',
                selectOnFocus: true
            } },
            { text: 'Email', dataIndex:'email',editor:{
                bind:'{current.email}',
                selectOnFocus: true
            } },
            { text: 'mac', dataIndex:'mac',editor:{
                bind:'{current.mac}',
                selectOnFocus: true
            } }, 
            { text: '品牌', dataIndex:'brand',editor:{
                bind:'{current.brand}',
                selectOnFocus: true
            } }, 
            { text: '网', dataIndex:'network',editor:{
                bind:'{current.network}',
                selectOnFocus: true
            } },
            { text: '配置文件', dataIndex:'configFile',editor:{
                bind:'{current.configFile}',
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
      //序号	厂商编号	厂商名称	机型	分辨率	占有率	TAC	产地1	产地2	MAC6	品牌	网	配置文件	创建时间
      //'_id','id','companyId','companyName','type','display', 'percentage', 'TAC', 'madeIn', 'madeIn2', 'mac', 'brand', 'network', 'configFile', 'createDate'
        defaultType: 'textfield',
        items: [{
            fieldLabel: '厂商编号',
            name: 'companyId',
            bind:'{current.companyId}'
        },{
            fieldLabel: '厂商名称',
            name: 'companyName',
            bind:'{current.companyName}'
        },{
            fieldLabel: '机型',
            name: 'type',
            bind:'{current.type}'
        },{
            fieldLabel: '分辨率',
            name: 'display',
            bind:'{current.display}'
        },{
            fieldLabel: '占有率',
            name: 'percentage',
            bind:'{current.percentage}'
        },{
            fieldLabel: 'TAC',
            name: 'TAC',
            bind:'{current.TAC}'
        },{
            fieldLabel: '产地1',
            name: 'madeIn',
            bind:'{current.madeIn}'
        },{
            fieldLabel: '产地2',
            name: 'madeIn2',
            bind:'{current.madeIn2}'
        },{
            fieldLabel: 'MAC6',
            name: 'mac',
            bind:'{current.mac}'
        },{
            fieldLabel: '品牌',
            name: 'brand',
            bind:'{current.brand}'
        },{
            fieldLabel: '网',
            name: 'network',
            bind:'{current.network}'
        },{
            fieldLabel: '配置文件',
            name: 'configFile',
            bind:'{current.configFile}'
        },{
            fieldLabel: '创建时间',
            name: 'createDate',
            bind:'{current.createDate}'
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