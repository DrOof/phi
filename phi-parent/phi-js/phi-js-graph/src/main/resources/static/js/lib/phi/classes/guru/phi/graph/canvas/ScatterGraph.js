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
    
    var ScatterGraph = phi.graph.ScatterGraph = phi({
        
        __extends__ : phi.graph.Graph,
        
        __init__ : function( node, options ) {
            
            // console.log( options );
            
        },
        
        render: function( data ) {
            
            this.clear();
            
            var colors = this.resolveColorRange( this.__options__[ 'point-color' ], this.__options__[ 'point-color-shift' ] );
            
            var rx = this.resolveRangeX( data );
            var ry = this.resolveRangeY( data );
            
            var d = this.resolveCanvasDimensions();
            
            var p0 = null;
            var point = null;
            for ( var n = 0; n < data.length; n++ ) {
                
                point = data[n];
                
                p0 = this.resolvePosition( point, rx, ry, d );
                
                this.renderPointCircle( point, p0.x, p0.y, n, colors[n] );
                
            }
            
        },
        
        resolvePosition: function( point, rx, ry, d ) {
            
            var vx = this.resolveValueX( point );
            var vy = this.resolveValueY( point );
            
            var x = ( d.width / rx.delta ) * ( vx - rx.min );
            var y = ( d.height / ry.delta ) * ( vy - ry.min );
            
            return { x : x, y: y };
            
        },
        
        renderPointCircle: function( point, x, y, n, color ) {
            
            var circle = new phi.dom.svg.SVGShapeElement( 'circle' );
            this.processSVGShapeElement( circle );
            
            circle.attr( { cx : x, cy : y, r : 5, fill : color } );
            circle.attr( { class : 'graph-point graph-point-' + n, point : point } );
            
            this.__canvas__.appendChild( circle );
            
        }
        
    });
    
} )( phi.dom );