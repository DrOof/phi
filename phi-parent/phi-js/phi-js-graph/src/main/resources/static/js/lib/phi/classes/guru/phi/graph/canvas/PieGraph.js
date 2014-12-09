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
            
            var colors = this.resolveColorRange( this.__options__[ 'point-color' ], this.__options__[ 'point-color-shift' ] );
            var box = this.resolveCanvasDimensions();
            
            // TODO : calculate the sum and shift from there... doh...
            var a = 0, a1 = 0, 
                A = PI * 2;
                S = this.resolveSigmaX( data ), 
                R = min( box.width, box.height ) / 2;
                
            var point, v, large;
            for ( var n = 0; n < data.length; n++ ) {
                
                point = data[n];
                v = this.resolveValueX( point );
                
                a += ( ( v / S ) * A );
                
                large = ( v / S * 360 ) > 180;
                
                this.renderPoint( point, box, R, n, large, a, a1, colors[n] );
                
                a1 = a;
                
            }
            
        },
        
        renderPoint: function( point, box, R, n, large, a, a1, c ) {
            
            var cx = box.cx, cy = box.cy;
            
            var x1 = ( cos( a1 ) * ( R - 100 ) ) + cx,
                y1 = ( sin( a1 ) * ( R - 100 ) ) + cy;
            
            var x2 = ( cos( a1 ) * R ) + cx, 
                y2 = ( sin( a1 ) * R ) + cy;
            
            var x3 = ( cos( a ) * R ) + cx,
                y3 = ( sin( a ) * R ) + cy;
            
            var x4 = ( cos( a ) * ( R - 100 ) ) + cx, 
                y4 = ( sin( a ) * ( R - 100 ) ) + cy;
            
            this.renderPointShape( point, R, n, large, x1, y1, x2, y2, x3, y3, x4, y4, c );
            
        },
        
        renderPointShape: function( point, R, n, large, x1, y1, x2, y2, x3, y3, x4, y4, c ) {
            
            var shape = new phi.dom.svg.SVGShapeElement( 'path' );
            
            this.processSVGShapeElement( shape );
            
            shape.attr( { 'class' : 'graph-point graph-point-' + n, 'point' : point, fill : c } );
            shape.attr( { 'd' : this.__path__.parse( { R : R, x1 : x1, y1 : y1, x2 : x2, y2 : y2, x3 : x3, y3 : y3, x4 : x4, y4 : y4, 'large-arc-flag' : large ? 1 : 0, 'sweep-flag' : 1 } ) } );
            
            this.__canvas__.appendChild( shape );
            
        }
        
    });
    
    PieGraph.PATH = 'M{{x1}},{{y1}} L{{x2}},{{y2}} A{{R}},{{R}} 0 {{large-arc-flag}},{{sweep-flag}} {{x3}},{{y3}} L{{x4}},{{y4}} Z';
                    
} )( phi.dom );