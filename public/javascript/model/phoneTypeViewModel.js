Ext.define('PhoneType',{
    extend: 'Ext.data.Model',
    fields :['_id', 'MANUFACTURER','BRAND','HARDWARE','MODEL', 'PRODUCT', 'DEVICE', 'mac6', 'fac', 'mac', 'tac', 'mnc', 'percent'],
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