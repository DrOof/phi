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
    
    var LineGraph = phi.graph.LineGraph = phi({
        
        __extends__ : phi.graph.Graph,
        
        __init__ : function( node, options ) {
            
            // console.log( options );
            
        },
        
        render: function( data ) {
            
            var rx = this.resolveRangeX( data );
            var ry = this.resolveRangeY( data );
            
            var d = this.resolveCanvasDimensions();
            
            for ( var i = 0; i < data.length; i++ ) {
                this.renderPoint( data[i], rx, ry, d );
            }
            
        },
        
        renderPoint: function( point, rx, ry, d ) {
            
            var vx = this.resolveValueX( point );
            var vy = this.resolveValueY( point );
            
            var x = ( d.width / rx.delta ) * ( vx - rx.min );
            var y = ( d.height / ry.delta ) * ( vy - ry.min );
            
            this.renderPointCircle( x, y );
            
        },
        
        renderPointCircle: function( x, y ) {
            
            var circle = new phi.dom.svg.SVGShapeElement( 'circle', { cx : x, cy : y, r : 5, fill : '#09f', stroke: 'none' } );
            this.canvas.appendChild( circle );
            
        }
        
    });
    
} )( phi.dom );