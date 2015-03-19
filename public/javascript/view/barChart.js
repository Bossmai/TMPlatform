
Ext.define('tm.view.BarChart', {
	extend: 'Ext.Component', 
	alias:'widget.chartView',
	
	initComponent : function(){
		var me = this;
		tm.view.BarChart.superclass.initComponent.call(me);
		me.id='chart';
		me.data= [{"_id":"2015/03/19","value":{"planExecDate":"2015/03/19","newCount":51,"newSuccessCount":0,"repeatCount":0,"repeatSuccessCount":0}},
		       {"_id":"2015/03/20","value":{"planExecDate":"2015/03/20","newCount":0,"newSuccessCount":0,"repeatCount":13,"repeatSuccessCount":0}},
		       {"_id":"2015/03/21","value":{"planExecDate":"2015/03/21","newCount":0,"newSuccessCount":0,"repeatCount":13,"repeatSuccessCount":0}},
		       {"_id":"2015/03/22","value":{"planExecDate":"2015/03/22","newCount":0,"newSuccessCount":0,"repeatCount":13,"repeatSuccessCount":0}}];
		me.stackColor = ["#99e7e7", "#c0c0c0", 'red'];
	},
	
	
	afterRender : function (){
		var me = this;
		me.drawChart();
		
	},

	drawChart : function (){
		var me = this;
		var containerId = me.id;
		
		var xScale = d3.scale.ordinal().rangeBands(me.data.map(function(d){return d._id}));
		var yScale = d3.scale.linear().range([400, 0]).domain([0, 100]);
		
		var svg = d3.select('#' + containerId)
			.append("svg")
			.attr("width", 400)
			.attr("height", 300);
		
		svg.append("g")
			.attr("class", "chart-body")
			.data(me.data)
			.enter()
			.append("g")
			append("rect")
			.attr("class", "clickable eid-refinement-link")
			.attr("x", function(d) {
				return xScale(d._id); 
			})
			.attr("width", xScale.rangeBand()/4)
			.attr("y", function(d) {
		    	return yScale(d.value.newCount);
		    })
		    .attr("height", function(d) { 
		    	return 10;
		    });
		
		svg.append("g")
			.attr("class", "x axis")
			.call(me.xAxis);
		
	}

});