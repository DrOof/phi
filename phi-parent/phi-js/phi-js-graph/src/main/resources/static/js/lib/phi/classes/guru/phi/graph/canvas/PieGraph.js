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
    
    var cos = Math.cos;
    var sin = Math.sin;
    var min = Math.min;
    var PI  = Math.PI;
    
    var PieGraph = phi.graph.PieGraph = phi({
        
        __extends__ : phi.graph.Graph,
        
        __init__ : function( node, options ) {
            
            this.__path__ = new phi.dom.Template( PieGraph.PATH );
            this.__count__;
            
        },
        
        render: function( data ) {
            
            var box = this.resolveCanvasDimensions();
            
            // TODO : calculate the sum and shift from there... doh...
            var a = 0, a0 = 0, 
                A = PI * 2;
                S = this.resolveSigmaX( data ), 
                R = min( box.width, box.height ) / 2;
                
            var point, v, large;
            for ( var n = 0; n < data.length; n++ ) {
                
                point = data[n];
                v = this.resolveValueX( point );
                
                a += ( ( v / S ) * A );
                
                large = ( v / S * 360 ) > 180;
                
                this.renderPoint( point, box, R, n, large, a, a0 );
                
                a0 = a;
                
            }
            
        },
        
        renderPoint: function( point, box, R, n, large, a, a0 ) {
            
            var x1 = box.cx, 
                y1 = box.cy;
            
            var x2 = ( cos( a0 ) * R ) + x1, 
                y2 = ( sin( a0 ) * R ) + y1;
            
            var x3 = ( cos( a ) * R ) + x1, 
                y3 = ( sin( a ) * R ) + y1;
            
            this.renderPointShape( point, R, n, large, x1, y1, x2, y2, x3, y3 );
            
        },
        
        renderPointShape: function( point, R, n, large, x1, y1, x2, y2, x3, y3 ) {
            
            var shape = new phi.dom.svg.SVGShapeElement( 'path' );
            
            this.processSVGShapeElement( shape );
            
            shape.attr( { 'class' : 'graph-point graph-point-' + n, 'point' : point } );
            shape.attr( { 'd' : this.__path__.parse( { R : R, x1 : x1, y1 : y1, x2 : x2, y2 : y2, x3 : x3, y3 : y3, 'large-arc-flag' : large ? 1 : 0, 'sweep-flag' : 1 } ) } );
            
            this.__canvas__.appendChild( shape );
            
        }
        
    });
    
    PieGraph.PATH = 'M{{x1}},{{y1}} L{{x2}},{{y2}} A{{R}},{{R}} 0 {{large-arc-flag}},{{sweep-flag}} {{x3}},{{y3}} Z';
                    
} )( phi.dom );