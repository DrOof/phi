(function(phi) {
    
    var svg = phi.svg = {};
    var SVGNS = 'http://www.w3.org/2000/svg';

    var SVGShapeElement = svg.SVGShapeElement = phi({
    
        __init__ : function( element, attributes ) {
        
            this.element = ( typeof element === 'string' ) ? document.createElementNS( SVGNS, element ) : element;
            this.attr( attributes || {} )
        
        },
    
        attr: function( attributes ) {
            
            for( var key in attributes ) {
                
                this.element[key] = attributes[ key ];
                this.element.setAttribute( key, attributes[ key ] );
                
            }
        
        },
        
        appendChild: function( svg ) {
            
            this.element.appendChild( svg.element )
            
        }
    
    });
    
}(phi));