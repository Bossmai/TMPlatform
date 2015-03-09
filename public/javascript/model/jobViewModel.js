Ext.define('Job',{
    extend: 'Ext.data.Model',
    fields :['_id','id','appId','planExecDate', 'planExecPeriod', 'newUsers', '_status'],
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