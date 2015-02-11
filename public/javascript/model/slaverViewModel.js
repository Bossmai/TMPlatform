
Ext.define('Salver',{
    extend: 'Ext.data.Model',
    fields :['_id','id','name','desc','ip','mac', 'initialPercentage', 'createDate'],
    proxy: {
        type: 'rest',
        url: 'slaver'
    },
    requires: ['Ext.data.identifier.Uuid'],
    identifier: 'uuid'
});

Ext.define('tm.model.SlaverViewModel', {
    extend: 'tm.model.TMViewModel',
    alias: 'viewmodel.slavers',
    stores: {
    	data:{
    		model: 'Salver',
    		autoLoad: true
    	}
    }
});