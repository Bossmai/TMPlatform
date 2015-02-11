
Ext.define('Salver',{
    extend: 'Ext.data.Model',
    fields :['_id','id','name','desc','ip','mac', 'initialPercentage', 'createDate'],
    proxy: {
        type: 'rest',
        url: 'slaver'
    },
    requires: ['Ext.data.identifier.Uuid'],
    identifier: 'uuid'
});

Ext.define('tm.model.SlaverViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.slavers',
    stores: {
    	data:{
    		model: 'Salver',
    		autoLoad: true
    	}
    },

    formulas:{
        current:{
            bind:{
                bindTo:'{slavergrid.selection}',
                deep: true
            },
            get: function(slaver){
                return slaver;
            },
            set: function(slaver){
                if(!slaver.isModel){
                	slaver =  this.get('data').getById(slaver);
                    this.set('current', slaver);
                }
            }
        },

        status:{
            bind:{
                bindTo:'{current}',
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