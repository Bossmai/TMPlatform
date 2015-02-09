Ext.define('tm.ViewController',{
	targetKey: undefined,
    extend:'Ext.app.ViewController',
    alias:'controller.controller',
    onSubmit: function(){
        var target = this.getViewModel().get(this.targetKey);
        target.save();

    },
    onRevert: function(){
        var target = this.getViewModel().get(this.targetKey);
        target.reject();
    },
    
    onDelete: function(view, rowIndex, colIndex, item,	e, record, row){
        var target = record;
        target.erase();
    }
});