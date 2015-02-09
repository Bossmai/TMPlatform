Ext.Loader.setPath('tm.view','javascript/view');
Ext.Loader.setPath('tm.model','javascript/model');
Ext.Loader.setPath('tm','javascript');
Ext.require([
     'tm.view.SlaverView',
     'tm.ViewController'
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
               //header
               html:'vvvvvvv'
           },{
        	   xtype:'tabpanel',
        	   height: 400,
        	   width: 'auto',
        	   tabStretchMax: true,
        	   tabPosition: 'left',
        	   tabRotation: 0,
        	   items:[{
        		   tabConfig: {
        			   title: '子服务器管理',
        			   
        	       },
        	       items:[{xtype:'slaverView'}]
        			   
        	   },{
        		   html:'test',
        		   tabConfig: {
        			   title: '厂商管理'
        	       }
        	   },{
        		   html:'tttt',
        		   tabConfig: {
        			   title: '机型管理'
        	       }
        			   
        	   },{
        		   html:'tttt',
        		   tabConfig: {
        			   title: '应用类型管理'
        	       }
        			   
        	   },{
        		   html:'tttt',
        		   tabConfig: {
        			   title: '留存率模型管理'
        	       }
        			   
        	   },{
        		   html:'tttt',
        		   tabConfig: {
        			   title: '时间段活跃度设置'
        	       }
        			   
        	   },{
        		   html:'tttt',
        		   tabConfig: {
        			   title: '用户百分比设置'
        	       }
        			   
        	   }]
           }],
           renderTo: Ext.getBody()
       })

    }
});  