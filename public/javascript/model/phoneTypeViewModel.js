//序号	厂商编号	厂商名称	机型	分辨率	占有率	TAC	产地1	产地2	MAC6	品牌	网	配置文件	创建时间

Ext.define('PhoneType',{
    extend: 'Ext.data.Model',
    fields :['_id','id','companyId','companyName','type','display', 'percentage', 'TAC', 'madeIn', 'madeIn2', 'mac', 'brand', 'network', 'configFile', 'createDate'],
    proxy: {
    type: 'rest',
        url: 'company'
}
});

Ext.define('tm.model.PhoneTypeViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.phoneTypes',
    stores: {
    	phoneTypes:{
    		model: 'PhoneType',
    		autoLoad: true
    	}
    },

    formulas:{
        current:{
            bind:{
                bindTo:'{companygrid.selection}',
                deep: true
            },
            get: function(company){
                return company;
            },
            set: function(company){
                if(!company.isModel){
                	company =  this.get('phoneTypes').getById(company);
                    this.set('current', company);
                }
            }
        },

        status:{
            bind:{
                bindTo:'{current}',
                deep:true
            },

            get: function(company){
                var ret = {
                    dirty:company?company.dirty:false,
                    valid:company && company.isModel? company.isValid() : false
                };
                ret.dirtyAndValid = ret.dirty && ret.valid;
                return ret;
            }
        }

    }
});