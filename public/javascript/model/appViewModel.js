Ext.define('App',{
    extend: 'Ext.data.Model',
    fields :['_id','id','scriptName','lcModel', 'needRepeat'],
    proxy: {
        type: 'rest',
        url: 'app'
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