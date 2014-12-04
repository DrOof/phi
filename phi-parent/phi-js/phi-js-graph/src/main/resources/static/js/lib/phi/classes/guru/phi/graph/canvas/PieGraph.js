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
            
            this.__poly__ = new phi.dom.Template( PieGraph.POLY );
            
        },
        
        render: function( data ) {
            
            var sigma = this.resolveSigmaX( data );
            var box = this.resolveCanvasDimensions();
            
            // TODO : calculate the sum and shift from there... doh...
            var p1, p2;
            for ( var i = 0; i < data.length; i++ ) {
                
                p1 = data[i];
                p2 = data[i+1] ? data[i+1] : data[0];
                
                this.renderPoint( p1, p2, sigma, box, i );
                
            }
            
        },
        
        renderPoint: function( p1, p2, sigma, box, i ) {
            
            var v1 = this.resolveValueX( p1 );
            var a1 = ( ( v1 / sigma ) );
            
            var v2 = this.resolveValueX( p2 );
            var a2 = ( ( v2 / sigma ) );
            
            this.renderPointShape( p1, box, v1, a1, v2, a2, i );
            
        },
        
        renderPointShape: function( p1, box, v1, a1, v2, a2, i ) {
            
            /*
            // draw a line from the center of the __canvas__ to the position of the point
            
            */
            
            var R = Math.min( box.width, box.height ) / 2;
            
            var x1 = Math.round( box.cx ), 
                y1 = Math.round( box.cy ), 
                x2 = Math.round( ( Math.cos( 360 * a1 ) * R ) + box.cx ),
                y2 = Math.round( ( Math.sin( 360 * a1 ) * R ) + box.cy ),
                x3 = Math.round( ( Math.cos( 360 * a2 ) * R ) + box.cx ),
                y3 = Math.round( ( Math.sin( 360 * a2 ) * R ) + box.cy );
            
            /*
            var line = new phi.dom.svg.SVGShapeElement( 'line', { x1 : x1, y1 : y1, x2 : x2, y2 : y2, class : 'graph-point' } );
            this.processSVGShapeElement( line );
            
            this.__canvas__.appendChild( line );
            */
            
            var shape = new phi.dom.svg.SVGShapeElement( 'path' );
            this.processSVGShapeElement( shape );
            
            // fix poly
            
            shape.attr( { point : p1 } );
            shape.attr( { class : 'graph-point graph-point-' + i } );
            shape.attr( { d : this.__poly__.parse( { x1 : x1, y1 : y1, x2 : x2, y2 : y2, x3 : x3, y3 : y3, v1 : v1, v2 : v2, rx : R, ry : R } ) } );
            
            this.__canvas__.appendChild( shape );
            
        }
        
    });
    
    PieGraph.POLY = 'M {{x1}} {{y1}}' + // move to center
                    'L {{x2}} {{y2}}' + // line to value
                    'L {{x3}} {{y3}}' + // arc to next value
                    'L {{x1}} {{y1}}' + // line to center
                    'Z'; // close
    
} )( phi.dom );