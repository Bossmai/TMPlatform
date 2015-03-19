Ext.require([
    'tm.view.BarChart',
]);
Ext.define('tm.view.ReportView', {
	extend: 'Ext.container.Container',
	alias:'widget.reportView',
	items:[{
		width: 800,
        autoScroll: true,
        xtype:'chartView'
	}]
	
});