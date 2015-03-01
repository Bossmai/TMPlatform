
Ext.define('Manufacturer',{
    extend: 'Ext.data.Model',
    fields :['_id','id','name','percentage', 'isValid', 'createDate'],
    proxy: {
        type: 'rest',
        url: 'manufacturer'
    },
    requires: ['Ext.data.identifier.Uuid'],
    identifier: 'uuid'
});

Ext.define('tm.model.ManufacturerViewModel', {
    extend: 'tm.model.TMViewModel',
    alias: 'viewmodel.manufacturers',
    stores: {
    	data:{
    		model: 'Manufacturer',
    		autoLoad: true
    	}
    }
});