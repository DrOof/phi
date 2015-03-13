// var t = new Date().getTime();

/* start pie graph */
var pie = phi.graph.factory.createGraph( 'pie-graph', document.getElementById( 'pie-graph' ), { 'axis-y-name' : 'y', 'point-color' : 'ff0000', 'point-color-shift' : 32 } );
pie.set( phi.graph.factory.generateDataByFunction( 10, phi.graph.GraphFactory.EXP_BEST_FIT ) );

/* start bar graph */
var bar = phi.graph.factory.createGraph( 'bar-graph', document.getElementById( 'bar-graph' ), { 'axis-y-name' : 'y', 'point-width' : 100, 'point-color' : '109900', 'point-color-shift' : 20 } );
bar.set( phi.graph.factory.generateData( 10 ) );

/* start line graph */
var line = phi.graph.factory.createGraph( 'line-graph', document.getElementById( 'line-graph' ), { 'axis-x-name' : 'x', 'axis-y-name' : 'y', 'point-color' : '109900', 'point-color-shift' : 16 } );
line.set( phi.graph.factory.generateData( 20 ) );

var scatter = phi.graph.factory.createGraph( 'scatter-graph', document.getElementById( 'scatter-graph' ), { 'axis-x-name' : 'x', 'axis-y-name' : 'y', 'point-color' : 'ff0000', 'point-color-shift' : 2, 'point-best-fit' : 'linear' } );
scatter.set( phi.graph.factory.generateDataByFunction( 20, phi.graph.GraphFactory.EXP_BEST_FIT ) );

// console.log( (new Date().getTime()) - t );

( function( phi ) {
    
    var GraphManager = phi({
    
        __init__ : function( node ) {
            
            this.node = node;
            this.node.addEventListener( 'submit', this.handleSubmit.bind( this ) );
        
        },
    
        handleSubmit: function( e ) { e.preventDefault();
            
            // serialize options and create a new graph
            var id = e.target.getAttribute( 'action' );
            var graph = phi.graph.factory.findGraphById( id.replace( '#', '' ) );
            
            // serialize form
            var option, options = {};
            for ( var i = 0; i < e.target.length; i++ ) {
                option = e.target[i];
                if ( option.name ) {
                    options[ option.name ] = option.value;
                }
            }
            
            graph.options( options );
            graph.refresh();
            
        }
    
    });

    var nodes = document.querySelectorAll( 'form.graph-options' );
    for (var i = nodes.length - 1; i >= 0; i--) {
        new GraphManager( nodes[i] );
    }
    
} )( phi );