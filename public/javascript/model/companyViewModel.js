
Ext.define('Company',{
    extend: 'Ext.data.Model',
    fields :['_id','id','name','percentage','contactorName','contactPhone', 'email', 'isValid', 'createDate'],
    proxy: {
        type: 'rest',
        url: 'company'
    },
    requires: ['Ext.data.identifier.Uuid'],
    identifier: 'uuid'
});

Ext.define('tm.model.CompanyViewModel', {
    extend: 'tm.model.TMViewModel',
    alias: 'viewmodel.companies',
    stores: {
    	data:{
    		model: 'Company',
    		autoLoad: true
    	}
    }
});