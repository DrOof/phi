/**
 *
 * Value range
 *
 */

( function( phi ) {

    var ValueRange = phi.graph.ValueRange = phi({
    
        __init__ : function( values, min, max ) {
        
            this.__values__ = values;

            this.min = ( min !== 'auto' && min !== undefined ) ? min : this.resolveMinValue( values );
            this.max = ( max !== 'auto' && max !== undefined ) ? max : this.resolveMaxValue( values );

            this.sigma = this.resolveSigma( values );
            this.delta = this.max - this.min;

        },
    
        resolveMinValue: function( values ) {
        
            var min = ( values ).reduce( function( a, b ) { return Math.min( a, b ) } )
            min = ( values.length > 1 ) ? min : Math.floor( min * 0.98 ) ; // safety for graphs with single value
            return min;

        },
    
        resolveMaxValue: function( values ) {
            var max = ( values ).reduce( function( a, b ) { return Math.max( a, b ) } )
            max = ( values.length > 1 ) ? max : Math.ceil( max * 1.02 ); // safety for graphs with single value
            return max;
        },
    
        resolveSigma: function( values ) {
            return ( values ).reduce( function( a, b ) { return a + b; } );
        },
        
        isWithinRange: function( value ) {
            return value >= this.min && value <= this.max;
        }
    
    })

})( phi );