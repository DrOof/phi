/* start pie graph */
var pie = phi.graph.factory.createGraph( 'PieGraph', document.getElementById( 'pie-graph' ), { 'axis-y-name' : 'y', 'point-color' : 'ff0000', 'point-color-shift' : 32 } );
pie.set( phi.graph.factory.generateData( 10 ) );

/* start bar graph */
var bar = phi.graph.factory.createGraph( 'BarGraph', document.getElementById( 'bar-graph' ), { 'axis-y-name' : 'y', 'point-color' : '109900', 'point-color-shift' : 20 } );
bar.set( phi.graph.factory.generateData( 10 ) );

/* start line graph */
var line = phi.graph.factory.createGraph( 'LineGraph', document.getElementById( 'line-graph' ), { 'axis-x-name' : 'x', 'axis-y-name' : 'y', 'point-color' : '109900', 'point-color-shift' : 16 } );
line.set( phi.graph.factory.generateData( 20 ) );

var scatter = phi.graph.factory.createGraph( 'ScatterGraph', document.getElementById( 'scatter-graph' ), { 'axis-x-name' : 'x', 'axis-y-name' : 'y', 'point-color' : 'ff0000', 'point-color-shift' : 2, 'point-best-fit' : 'linear' } );
scatter.set( phi.graph.factory.generateScatterData( 20 ) );