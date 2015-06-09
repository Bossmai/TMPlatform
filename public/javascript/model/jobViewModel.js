Ext.define('Job',{
    extend: 'Ext.data.Model',
    fields :['_id','id','appId', 'newUsers', '_status', 'priority'],
    proxy: {
        type: 'rest',
        url: 'job'
    },
    requires: ['Ext.data.identifier.Uuid'],
    identifier: 'uuid'
});

Ext.define('tm.model.JobViewModel', {
    extend: 'tm.model.TMViewModel',
    alias: 'viewmodel.jobs',
    stores: {
    	data:{
    		model: 'Job',
    		autoLoad: true
    	}
    }
});