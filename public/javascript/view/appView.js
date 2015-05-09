Ext.require([
     'tm.model.AppViewModel'
]);

Ext.define('tm.view.AppView', {
	extend: 'Ext.container.Container',
	alias:'widget.appView',
	controller: Ext.create('tm.ViewController'),
	viewModel: {
        type: 'apps'
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
            { text: 'scriptName', dataIndex: 'scriptName',editor:{
                bind:'{current.scriptName}',
                selectOnFocus: true
            } },
            { text: 'lcModel', dataIndex: 'lcModel',editor:{
                bind:'{current.lcModel}',
                selectOnFocus: true
            } },{ text: 'needRepeat', dataIndex: 'needRepeat'/*,editor:{
                bind:'{current.needRepeat}',
                selectOnFocus: true
            }*/ }, {
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
        tbar:['应用列表','->',{
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
            fieldLabel: 'scriptName',
            name: 'scriptName',
            bind:'{current.scriptName}'
        },{
            fieldLabel: 'lcModel',
            name: 'lcModel',
            bind:'{current.lcModel}'
        },{
			xtype:'checkbox',
            fieldLabel: 'needRepeat',
            name: 'needRepeat',
            bind:'{current.needRepeat}'
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