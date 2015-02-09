
Ext.define('Salver',{
    extend: 'Ext.data.Model',
    fields :['_id','id','name','desc','ip','mac', 'initialPercentage', 'createDate'],
    proxy: {
    type: 'rest',
        url: 'slaver'
}
});

Ext.define('tm.model.SlaverViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.slavers',
    stores: {
    	slavers:{
    		model: 'Salver',
    		autoLoad: true
    	}
    },

    formulas:{
        currentSlaver:{
            bind:{
                bindTo:'{slavergrid.selection}',
                deep: true
            },
            get: function(slaver){
                return slaver;
            },
            set: function(slaver){
                if(!slaver.isModel){
                	slaver =  this.get('slavers').getById(slaver);
                    this.set('currentSlaver', slaver);
                }
            }
        },

        status:{
            bind:{
                bindTo:'currentSlaver',
                deep:true
            },

            get: function(slaver){
                var ret = {
                    dirty:slaver?slaver.dirty:false,
                    valid:slaver && slaver.isModel? slaver.isValid() : false
                };
                ret.dirtyAndValid = ret.dirty && ret.valid;
                return ret;
            }
        }

    }
});