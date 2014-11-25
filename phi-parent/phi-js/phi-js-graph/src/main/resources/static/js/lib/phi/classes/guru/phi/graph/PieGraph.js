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
    
    var PieGraph = phi.graph.PieGraph = phi({
        
        __extends__ : phi.graph.Graph,
        
        __init__ : function( node, options ) {
            
        },
        
        render: function( data ) {
            
            var sigma = this.resolveSigmaX( data );
            
            var point;
            for ( var i = 0; i < data.length; i++ ) {
                point = data[i];
                this.renderPoint( point, sigma );
            }
            
        },
        
        renderPoint: function( point, sigma ) {
            
            var v = this.resolveValueX( point );
            var p = ( ( v / sigma ) * 100 );
            var a = ( p / 100 ) * 360;
            var R = 50; // FIXME : resolve from actual viewport
            
            var x = Math.sin( a ) * R;
            var y = Math.cos( a ) * R;
            
            this.renderPointCircle( x, y );
            
        },
        
        renderPointCircle: function( x, y ) {
            
            // draw a circle at the position of the point
            this.canvas.appendChild( new phi.dom.SVGShapeElement( 'circle', { cx : x, cy : y, r : 5 } ) );
            
        },
        
        renderPointLine: function( x, y ) {
            
            // draw a line from the center of the canvas to the position of the point
            
            
        }
        
    });
    
} )( phi.dom );