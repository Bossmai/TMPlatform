Ext.define('tm.JobViewController',{

    extend:'tm.ViewController',
    alias:'controller.controller',
    onAdd: function(){
    	var me = this;
		var store = this.getViewModel().getStore('data');
		store.add({_status: 'NEW'});
    },

    onGo: function(view, rowIndex, colIndex, item, e, record ){
        var target = record;
        if(target.data.status === "GO"){
            return;
        }
        Ext.Ajax.request({
            url:'http://localhost:3000/mockingjay',
            params : target.data,
            method: 'get',
            success: function(response){
                alert('done!');
                target.set('_status', 'GO');
                target.save();
            }
        })
    },
    onHold: function(){
        return false;
    }
});