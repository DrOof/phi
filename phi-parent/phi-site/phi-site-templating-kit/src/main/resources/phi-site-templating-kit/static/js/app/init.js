( function( phi ) {
    
    // phi.dom.register( '.player', phi.media.Player );
    // phi.dom.register( '.slider', phi.dom.Slider );
    var nodes = document.querySelectorAll( '.player' );
    for ( var i = nodes.length - 1; i >= 0; i--) {
        new phi.media.player.Player( nodes[i] );
    }
    
} )( phi );

( function( phi ) {

    var nodes = document.querySelectorAll( '.slider' );
    for ( var i = nodes.length - 1; i >= 0; i--) {
        new phi.slider.Slider( nodes[i] );
    }
    
} )( phi );
    
( function( phi ) {
    
    var nodes = document.querySelectorAll( '.pie-graph' );
    var options = { 'axis-y-name' : 'y', 'point-color' : 'ff0000', 'point-color-shift' : 32 };
    for ( var i = nodes.length - 1; i >= 0; i--) {
        phi.graph.factory.createGraph( 'PieGraph', nodes[i], options ).set( phi.graph.factory.generateData( 10 ) );
    }
    
} )( phi );

( function( phi ) {
    
    var nodes = document.querySelectorAll( '.bar-graph' );
    var options = { 'axis-y-name' : 'y', 'point-color' : '109900', 'point-color-shift' : 10 };
    for ( var i = nodes.length - 1; i >= 0; i--) {
        phi.graph.factory.createGraph( 'BarGraph', nodes[i], options ).set( phi.graph.factory.generateData( 20 ) );
    }
    
} )( phi );

( function( phi ) {
    
    var nodes = document.querySelectorAll( '.point-line-graph' );
    var options = { 'axis-x-name' : 'x', 'axis-y-name' : 'y', 'point-color' : '109900', 'point-color-shift' : 16 };
    for ( var i = nodes.length - 1; i >= 0; i--) {
        phi.graph.factory.createGraph( 'LineGraph', nodes[i], options ).set( phi.graph.factory.generateData( 50 ) );
    }
    
} )( phi );

( function( phi ) {
    
    var nodes = document.querySelectorAll( '.point-graph' );
    var options = { 'axis-x-name' : 'x', 'axis-y-name' : 'y', 'point-color' : 'ff0000', 'point-color-shift' : 0, 'point-best-fit' : 'linear' };
    for ( var i = nodes.length - 1; i >= 0; i--) {
        phi.graph.factory.createGraph( 'ScatterGraph', nodes[i], options ).set( phi.graph.factory.generateDataByFunction( 100 ), phi.graph.GraphFactory.EXP_BEST_FIT );
    }
    
} )( phi );