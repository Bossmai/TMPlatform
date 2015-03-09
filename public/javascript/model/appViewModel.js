Ext.define('App',{
    extend: 'Ext.data.Model',
    fields :['_id','id','scriptName','lcModel'],
    proxy: {
        type: 'rest',
        url: 'slaver'
    },
    requires: ['Ext.data.identifier.Uuid'],
    identifier: 'uuid'
});

Ext.define('tm.model.AppViewModel', {
    extend: 'tm.model.TMViewModel',
    alias: 'viewmodel.apps',
    stores: {
    	data:{
    		model: 'App',
    		autoLoad: true
    	}
    }
});