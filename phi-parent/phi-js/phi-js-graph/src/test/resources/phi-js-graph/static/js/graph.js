/* start pie graph */
var pie = phi.graph.factory.createGraph( phi.graph.PieGraph, document.getElementById( 'pie-graph' ), { 'axis-y-name' : 'y', 'point-color' : 'ff0000', 'point-color-shift' : 32 } );
pie.set( phi.graph.factory.generateDataByFunction( 10, phi.graph.GraphFactory.EXP_BEST_FIT ) );

/* start bar graph */
var bar = phi.graph.factory.createGraph( phi.graph.BarGraph, document.getElementById( 'bar-graph' ), { 'axis-y-name' : 'y', 'point-width' : 100, 'point-color' : '109900', 'point-color-shift' : 20 } );
bar.set( phi.graph.factory.generateData( 10 ) );

/* start line graph */
var line = phi.graph.factory.createGraph( phi.graph.LineGraph, document.getElementById( 'line-graph' ), { 'axis-x-name' : 'x', 'axis-y-name' : 'y', 'point-color' : '109900', 'point-color-shift' : 16 } );
line.set( phi.graph.factory.generateData( 20 ) );

var scatter = phi.graph.factory.createGraph( phi.graph.ScatterGraph, document.getElementById( 'scatter-graph' ), { 'axis-x-name' : 'x', 'axis-y-name' : 'y', 'point-color' : 'ff0000', 'point-color-shift' : 2, 'point-best-fit' : 'linear' } );
scatter.set( phi.graph.factory.generateDataByFunction( 20, phi.graph.GraphFactory.EXP_BEST_FIT ) );

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
            var field, options = {};
            for (var i = 0; i < e.target.length; i++) {
                field = e.target[i];
                options[ field.name ] = field.value;
            }
            
            graph.options( options );
            graph.set( phi.graph.factory.generateDataByFunction( 5, phi.graph.GraphFactory.EXP_BEST_FIT ) );
            
        
        }
    
    });

    var nodes = document.querySelectorAll( 'form.graph-options' );
    for (var i = nodes.length - 1; i >= 0; i--) {
        new GraphManager( nodes[i] );
    }
    
} )( phi );

