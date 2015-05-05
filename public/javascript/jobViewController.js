Ext.define('tm.JobViewController',{

    extend:'tm.ViewController',
    alias:'controller.controller',
    onAdd: function(){
    	var me = this;
		var store = this.getViewModel().getStore('data');
		store.add({_status: 'GO'});
    },

    onGo: function(view, rowIndex, colIndex, item, e, record ){
        var target = record;
//        Ext.Ajax.request({
//            url:'/mockingjay/go',
//            params : target.data,
//            method: 'get',
//            success: function(response){
                alert('done!');
                target.set('_status', 'GO');
                target.save();
//            }
//        })
    },
    
    onHold: function(view, rowIndex, colIndex, item, e, record){
    	var target = record;
//        Ext.Ajax.request({
//            url:'/mockingjay/hold',
//            params : target.data,
//            method: 'get',
//            success: function(response){
                alert('done!');
                target.set('_status', 'HOLD');
                target.save();
//            }
//        })
    },
    
    onGenerateNew: function(view, rowIndex, colIndex, item, e, record){
    	var target = record;
        Ext.Ajax.request({
            url:'/mockingjay',
            params : target.data,
            method: 'get',
            success: function(response){
                alert('done!');
            }
        })
    }
});