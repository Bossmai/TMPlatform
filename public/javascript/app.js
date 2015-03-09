Ext.Loader.setPath('tm.view','javascript/view');
Ext.Loader.setPath('tm.model','javascript/model');
Ext.Loader.setPath('tm','javascript');
Ext.require([
    'tm.ViewController',
    'tm.view.SlaverView',
    'tm.view.PhoneTypeView',
    'tm.view.AppView'
]);

Ext.application({
    name: "ExtJSTest",
    launch: function(){
    	
    	Ext.create('Ext.panel.Panel',{
    	  
           title: "后台管理平台",
           layout: {
               type: 'vbox',
               align: 'stretch'
           },
           items:[{
        	   xtype:'tabpanel',
        	   width: 'auto',
        	   tabStretchMax: true,
        	   tabPosition: 'left',
        	   tabRotation: 0,
        	   items:[{
        		   tabConfig: {
        			   title: '子服务器管理'
        	       },
        	       items:[{xtype:'slaverView'}]
        			   
        	   },{
        		   tabConfig: {
        			   title: '机型管理'
        	       },
                   items:[{xtype:'phoneTypeView'}]
        			   
        	   },{
        		   tabConfig: {
        			   title: '应用类型管理'
        	       },
        	       items:[{xtype:'appView'}]
        	   }]
           }],
           renderTo: Ext.getBody()
       })

    }
});  