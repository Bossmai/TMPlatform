//���̱��	��������	ռ����	��ϵ��	��ϵ�绰	Email	�Ƿ���Ч	¼������

Ext.define('Company',{
    extend: 'Ext.data.Model',
    fields :['_id','id','name','percentage','contactorName','contactPhone', 'email', 'isValid', 'createDate'],
    proxy: {
    type: 'rest',
        url: 'company'
}
});

Ext.define('tm.model.CompanyViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.companies',
    stores: {
    	companies:{
    		model: 'Company',
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
                	company =  this.get('companies').getById(company);
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