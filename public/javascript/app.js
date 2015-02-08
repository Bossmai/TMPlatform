Ext.application({
    name: "ExtJSTest",
    launch: function(){

       Ext.create('Ext.panel.Panel',{
           width: 500,
           height: 300,
           title: "后台管理平台",
           layout: {
               type: 'vbox',
               align: 'stretch'
           },
           items:[{
               //header
               html:''
           },{
                //body
               layout: {
                   type: 'hbox',
                   align: 'stretch'
               },
               items:[{
                   //left panel
                   items:[{

                   }]

               },{
                   //right panel
                   html:"234"
               }]
           }],
           renderTo: Ext.getBody()
       })

    }
});  