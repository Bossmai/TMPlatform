Ext.define('tm.ViewController',{
	formularKey: 'current',
	storeKey: undefined,
    extend:'Ext.app.ViewController',
    alias:'controller.controller',
    onSubmit: function(){
        var target = this.getViewModel().get(this.formularKey);
        target.save();

    },
    onRevert: function(){
        var target = this.getViewModel().get(this.formularKey);
        target.reject();
    },
    
    onDelete: function(view, rowIndex, colIndex, item,	e, record, row){
        var target = record;
        target.erase();
    },
    
    onAdd: function(){
    	var me = this;
		var store = this.getViewModel().getStore(this.storeKey);
		store.add({});
    }
});