Ext.define('tm.ViewController',{

    extend:'Ext.app.ViewController',
    alias:'controller.controller',
    onSubmit: function(){
        var target = this.getViewModel().get('current');
        target.save();

    },
    onRevert: function(){
        var target = this.getViewModel().get('current');
        target.reject();
    },
    
    onDelete: function(view, rowIndex, colIndex, item,	e, record, row){
        var target = record;
        target.erase();
    },
    
    onAdd: function(){
    	var me = this;
		var store = this.getViewModel().getStore('data');
		store.add({});
    }
});