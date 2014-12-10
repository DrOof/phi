/**
 *
 * Phi Core - A multi-paradigm JavaScript library
 *
 * // Externalized source: javascript/phi/src/main/javascript
 *
 * Copyright (c) 2010 Authors of PHI
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 *
 */

( function( dom ) {
    
    var graph = phi.graph = phi.graph || {};
    
    var BarGraph = phi.graph.BarGraph = phi({
        
        __extends__ : phi.graph.Graph,
        
        __init__ : function( node ) {
            
        },
        
        render: function( data ) {
            
            var values = this.resolveValuesByName( this.__options__[ 'axis-x-name' ] );
            var colors = this.resolveColorRange( this.__options__[ 'point-color' ], this.__options__[ 'point-color-shift' ] );
            var range = this.resolveRangeX();
            var d = this.resolveCanvasDimensions();
            
            for ( var n = 0; n < data.length; n++ ) {
                this.renderPoint( data[n], range, values, d, n, colors[n] );
            }
            
        },
        
        renderPoint: function( point, range, values, d, n, c ) {
            
            // step
            var s = ( d.width / values.length ); 
            
            var v = this.resolveValueX( point );
            var w = 30; // FIXME : add as an option
            var h = ( d.height / range.max ) * v;
            var x = ( s * n ) + ( s / 2 );
            var y = d.height - h;
            
            this.renderPointRect( point, x, y, w, h, n, c );
            
        },
        
        renderPointRect: function( point, x, y, w, h, n, c ) {
            
            var rect = new phi.dom.svg.SVGShapeElement( 'rect' );
            this.processSVGShapeElement( rect );
            
            rect.attr( { x : x - ( w / 2 ), y : y, width : w, height : h, fill : c } );
            rect.attr( { class : 'graph-point graph-point-' + n, point : point } );
            
            this.__canvas__.appendChild( rect );
            
        }
        
    });
    
} )( phi.dom );