
Ext.define('PhoneType',{
    extend: 'Ext.data.Model',
    fields :['_id','id','manufacturerId','manufacturerName','type','display', 'percentage', 'TAC', 'madeIn', 'madeIn2', 'mac', 'brand', 'network', 'configFile', 'createDate'],
    proxy: {
        type: 'rest',
        url: 'phoneType'
    },
    requires: ['Ext.data.identifier.Uuid'],
    identifier: 'uuid'
});

Ext.define('tm.model.PhoneTypeViewModel', {
    extend: 'tm.model.TMViewModel',
    alias: 'viewmodel.phoneTypes',
    stores: {
    	data:{
    		model: 'PhoneType',
    		autoLoad: true
    	}
    }
});