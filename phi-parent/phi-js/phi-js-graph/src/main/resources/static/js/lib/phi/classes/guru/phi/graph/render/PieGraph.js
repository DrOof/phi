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
    var PI2 = PI * 2;
    
    var PieGraph = phi.graph.PieGraph = phi({
        
        __extends__ : phi.graph.Graph,
        
        __applies__ : phi.graph.Renderable,
        
        __init__ : function( node, options ) {
            
            this.__options__ = phi.extend( PieGraph.DEFAULTS, options );
            this.__path__ = new phi.dom.Template( PieGraph.PATH );
            
        },
        
        render: function( data ) {
            
            var colors = this.resolveColorRange( this.__options__[ 'point-color' ], this.__options__[ 'point-color-shift' ] );
            var box = this.resolveCanvasDimensions();
            
            // TODO : calculate the sum and shift from there... doh...
            var sigma = this.resolveSigmaY( data ), 
                radius = this.resolveRadius( box );
                
            var a = 0, point, large, d, color;
            
            for ( var n = 0; n < data.length; n++ ) {
                
                point = data[ n ];
                color = colors[ n ];
                
                d = ( this.resolveValueY( point ) / sigma ) * PI2;
                large = d > PI;
                
                a += d;
                
                this.renderPoint( point, n, box, radius, a, a - d, color, large );
                
            }
            
        },
        
        renderPoint: function( point, n, box, radius, a, a1, color, large ) {
            
            var cx = box.cx, 
                cy = box.cy;
            
            var Ro = radius, 
                Ri = radius - this.__options__[ 'point-width' ];
            
            var p1 = this.resolvePathPosition( a1,  Ri,  cx,  cy ),
                p2 = this.resolvePathPosition( a1,  Ro,  cx,  cy ),
                p3 = this.resolvePathPosition( a,   Ro,  cx,  cy ),
                p4 = this.resolvePathPosition( a,   Ri,  cx,  cy );
            
            this.renderPointShape( point, n, Ro, Ri, p1, p2, p3, p4, color, large );
            
        },
        
        resolvePathPosition : function( a, R, cx, cy ) {
            
            return {
                x : ( cos( a ) * ( R ) ) + cx,
                y : ( sin( a ) * ( R ) ) + cy
            }
            
        },
        
        resolveRadius: function( box ) {
            var p = [ 40, 40, 40, 40 ];
            var w = box.width - p[1] - p[3];
            var h = box.height - p[0] - p[2];
            return min( w, h ) / 2;
        },
        
        renderPointShape: function( point, n, Ro, Ri, p1, p2, p3, p4, color, large ) {
            
            var shape = new phi.dom.svg.SVGShapeElement( 'path' );
            
            this.processSVGShapeElement( shape );
            
            shape.attr( { 'class' : 'graph-point graph-point-' + n, 'point' : point, fill : color } );
            shape.attr( { 'd' : this.__path__.parse( { Ro : Ro, Ri: Ri, p1 : p1, p2 : p2, p3 : p3, p4 : p4, 'large-arc-flag' : large ? 1 : 0, 'sweep-flag' : 1 } ) } );
            
            this.__canvas__.appendChild( shape );
            
        }
        
    });
    
    PieGraph.DEFAULTS = {
        'axis-y-name'           : undefined,
        'point-width'           : 100,
        'point-color'           : '#ff0099',
        'point-color-shift'     : 0
    };
    
    PieGraph.PATH = 'M{{p1.x}},{{p1.y}} L{{p2.x}},{{p2.y}} A{{Ro}},{{Ro}} 0 {{large-arc-flag}},{{sweep-flag}} {{p3.x}},{{p3.y}} L{{p4.x}},{{p4.y}} A{{Ri}},{{Ri}} 0 {{large-arc-flag}},0 {{p1.x}},{{p1.y}} Z';
                    
} )( phi.dom );