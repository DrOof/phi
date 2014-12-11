/* simple random number */
var rand = function( x ) {
    return Math.round( Math.random() * x );
};

/* start generate random data */
var generateData = function( size ) {
    var data = [];
    for ( var i = 0; i < size; i++) {
        data.push( {
            label : phi.uuid(),
            a : 1 + rand( 99 ),
            b : 10 * i
        } );
    }
    
    return data;
}

var data = generateData( 20 );
/* end generate random data */




/* start pie graph */
var pie = phi.graph.factory.createGraph( 'PieGraph', document.getElementById( 'pie-graph' ), { 'axis-x-name' : 'a', 'point-color' : 'ff0000', 'point-color-shift' : 32 } );
pie.set( generateData( 10 ) );

// pie.addEventListener( 'pointenter', function( e ) { console.log( e ) } );
// pie.addEventListener( 'pointleave', function( e ) { console.log( e ) } );
// pie.addEventListener( 'pointselect', function( e ) { console.log( e ) } );
/* end pie graph */

/* start bar graph */
var bar = phi.graph.factory.createGraph( 'BarGraph', document.getElementById( 'bar-graph' ), { 'axis-x-name' : 'a', 'point-color' : '109900', 'point-color-shift' : 10 } );
bar.set( generateData( 20 ) );

// bar.addEventListener( 'pointenter', function( e ) { console.log( e ) } );
// bar.addEventListener( 'pointleave', function( e ) { console.log( e ) } );
// bar.addEventListener( 'pointselect', function( e ) { console.log( e ) } );
/* end bar graph */

/* start line graph */
var line = phi.graph.factory.createGraph( 'LineGraph', document.getElementById( 'line-graph' ), { 'axis-x-name' : 'a', 'axis-y-name' : 'b', 'point-color' : '109900', 'point-color-shift' : 16 } );
line.set( generateData( 20 ) );

var scatter = phi.graph.factory.createGraph( 'ScatterGraph', document.getElementById( 'scatter-graph' ), { 'axis-x-name' : 'a', 'axis-y-name' : 'b', 'point-color' : '109900', 'point-color-shift' : 16 } );
scatter.set( generateData( 50 ) );

// line.addEventListener( 'pointenter', function( e ) { console.log( e.explicitOriginalTarget ) } );
// line.addEventListener( 'pointleave', function( e ) { console.log( e.explicitOriginalTarget ) } );
// line.addEventListener( 'pointselect', function( e ) { console.log( e ) } );
/* end line graph */