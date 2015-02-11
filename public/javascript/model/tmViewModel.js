
Ext.define('tm.model.TMViewModel', {
    extend: 'Ext.app.ViewModel',

    formulas:{
        current:{
            bind:{
                bindTo:'{grid.selection}',
                deep: true
            },
            get: function(obj){
                return obj;
            },
            set: function(obj){
                if(!obj.isModel){
                    obj =  this.get('data').getById(obj);
                    this.set('current', obj);
                }
            }
        },

        status:{
            bind:{
                bindTo:'{current}',
                deep:true
            },

            get: function(obj){
                var ret = {
                    dirty:obj?obj.dirty:false,
                    valid:obj && obj.isModel? obj.isValid() : false
                };
                ret.dirtyAndValid = ret.dirty && ret.valid;
                return ret;
            }
        }
    }
});