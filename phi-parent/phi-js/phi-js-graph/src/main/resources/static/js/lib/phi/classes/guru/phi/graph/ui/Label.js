( function( phi ) {
    
    var graph = phi.graph = phi.graph || {};

    var Label = phi.graph.Label = phi({
    
        __extends__ : phi.EventTarget,
        
        __init__ : function(  ) {
            
        }
        
    });
    
    Label.TEMPLATE =    '<div class="graph-point-label">' +
                            '<h4>{{label}}</h4>' +
                        '</div>';
        
})( phi );


    