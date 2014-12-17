/* start pie graph */
var pie = phi.graph.factory.createGraph( 'PieGraph', document.getElementById( 'pie-graph' ), { 'axis-x-name' : 'a', 'point-color' : 'ff0000', 'point-color-shift' : 32 } );
pie.set( phi.graph.factory.generateData( 10 ) );

// pie.addEventListener( 'pointenter', function( e ) { console.log( e ) } );
// pie.addEventListener( 'pointleave', function( e ) { console.log( e ) } );
// pie.addEventListener( 'pointselect', function( e ) { console.log( e ) } );
/* end pie graph */

/* start bar graph */
var bar = phi.graph.factory.createGraph( 'BarGraph', document.getElementById( 'bar-graph' ), { 'axis-x-name' : 'b', 'point-color' : '109900', 'point-color-shift' : 20 } );
bar.set( phi.graph.factory.generateData( 10 ) );

// bar.addEventListener( 'pointenter', function( e ) { console.log( e ) } );
// bar.addEventListener( 'pointleave', function( e ) { console.log( e ) } );
// bar.addEventListener( 'pointselect', function( e ) { console.log( e ) } );
/* end bar graph */

/* start line graph */
var line = phi.graph.factory.createGraph( 'LineGraph', document.getElementById( 'line-graph' ), { 'axis-x-name' : 'a', 'axis-y-name' : 'b', 'point-color' : '109900', 'point-color-shift' : 16 } );
line.set( phi.graph.factory.generateData( 20 ) );

// line.addEventListener( 'pointenter', function( e ) { console.log( e.explicitOriginalTarget ) } );
// line.addEventListener( 'pointleave', function( e ) { console.log( e.explicitOriginalTarget ) } );
// line.addEventListener( 'pointselect', function( e ) { console.log( e ) } );
/* end line graph */

var scatter = phi.graph.factory.createGraph( 'ScatterGraph', document.getElementById( 'scatter-graph' ), { 'axis-x-name' : 'a', 'axis-y-name' : 'b', 'point-color' : 'ff0000', 'point-color-shift' : 2, 'point-best-fit' : 'linear' } );
scatter.set( phi.graph.factory.generateScatterData( 20 ) );