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
            
            var d = this.resolveCanvasDimensions();
            this.renderCircle( d.cx, d.cy );
            
            for ( var i = 0; i < data.length; i++ ) {
                this.renderPoint( data[i], sigma, d );
            }
            
        },
        
        renderPoint: function( point, sigma, d ) {
            
            var v = this.resolveValueX( point );
            var a = ( ( v / sigma ) * 360 );
            
            var R = 100; // FIXME : resolve from actual viewport
            var x = Math.cos( a ) * R;
            var y = Math.sin( a ) * R;
            
            this.renderPointCircle( point, x + d.cx, y + d.cy );
            this.renderPointLine( d.cx, d.cy, x + d.cx, y + d.cy );
            
        },
        
        renderCircle: function( cx, cy ) {
            
            // draw a circle in the background
            this.canvas.appendChild( new phi.dom.svg.SVGShapeElement( 'circle', { cx : cx, cy : cy, r : 100, stroke: '#09f', fill : 'none' } ) );
        },
        
        renderPointCircle: function( point, x, y ) {
            
            // draw a circle at the position of the point
            var circle = new phi.dom.svg.SVGShapeElement( 'circle', { cx : x, cy : y, r : 5, fill : '#09f', point : point, id : phi.uuid() } );
            circle.element.addEventListener( 'mouseenter', this.handlePointEnter.bind( this ), true );
            circle.element.addEventListener( 'mouseleave', this.handlePointLeave.bind( this ), true );
            
            this.canvas.appendChild( circle );
            
        },
        
        renderPointLine: function( x1, y1, x2, y2 ) {
            
            // draw a line from the center of the canvas to the position of the point
            this.canvas.appendChild( new phi.dom.svg.SVGShapeElement( 'line', { x1 : x1, y1 : y1, x2 : x2, y2 : y2, stroke : '#09f' } ) );
            
        }
        
    });
    
} )( phi.dom );