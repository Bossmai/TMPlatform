//���	���̱��	��������	����	�ֱ���	ռ����	TAC	����1	����2	MAC6	Ʒ��	��	�����ļ�	����ʱ��

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