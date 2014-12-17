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
        
        __applies__ : phi.graph.Renderable,
        
        __init__ : function( node, options ) {
            
            // console.log( options );
            
        },
        
        render: function( data ) {
            
            var colors = this.resolveColorRange( this.__options__[ 'point-color' ], this.__options__[ 'point-color-shift' ] );
            
            var rx = this.resolveRangeX( data );
            var ry = this.resolveRangeY( data );
            
            var d = this.resolveCanvasDimensions();
            
            this.renderAxisX( d, rx );
            this.renderAxisY( d, ry );
            
            var p0 = null;
            var point = null;
            for ( var n = 0; n < data.length; n++ ) {
                
                point = data[n];
                
                p0 = this.resolvePointPosition( point, rx, ry, d );
                
                this.renderPointCircle( point, p0.x, p0.y, n, colors[n] );
                
            }
            
        },
        
        resolvePointPosition: function( point, rx, ry, d ) {
            
            // top, right, bottom, left
            var p = [ 40, 40, 40, 40 ];
            
            var w = d.width - p[1] - p[3];
            var h = d.height - p[0] - p[2];
            
            var vx = this.resolveValueX( point );
            var vy = this.resolveValueY( point );
            
            var x = ( w / rx.delta ) * ( vx - rx.min ) + p[3];
            var y = ( h / ry.delta ) * ( vy - ry.min ) + p[0];
            
            return { x : x, y: y };
            
        },
        
        renderPointCircle: function( point, x, y, n, color ) {
            
            var circle = new phi.dom.svg.SVGShapeElement( 'circle' );
            this.processSVGShapeElement( circle );
            
            circle.attr( { cx : x, cy : y, r : 5, fill : color } );
            circle.attr( { class : 'graph-point graph-point-' + n, point : point } );
            
            this.__canvas__.appendChild( circle );
            
        },
        
        /**
         *
         * FIXME : Refactor code.
         * 
         */
        
        renderAxisX: function( d, rx ) {
            
            var p = [ 40, 40, 40, 40 ];
            
            var interval = this.resolveAxisFactor( rx );
            // start at less than...
            // end at more than max..
            
            var w = d.width - p[1] - p[3];
            var h = d.height - p[0] - p[2];
            
            var line = new phi.dom.svg.SVGShapeElement( 'line' );
            line.attr( { x1 : p[3], y1: p[0] + h, x2 : p[3] + w, y2 : p[0] + h } );
            line.attr( { class : 'graph-axis graph-axis-x' } );
            
            
            
            this.__canvas__.appendChild( line );
            
        },
        
        /**
         *
         * FIXME : Refactor code.
         * 
         */
        
        renderAxisY: function( d, ry ) {
            
            var p = [ 40, 40, 40, 40 ];
            
            var interval = this.resolveAxisFactor( ry );
            // start at less than...
            // end at more than max..
            
            var w = d.width - p[1] - p[3];
            var h = d.height - p[0] - p[2];
            
            var line = new phi.dom.svg.SVGShapeElement( 'line' );
            line.attr( { x1 : p[3], y1: p[0], x2 : p[3], y2 : h + p[0] } );
            line.attr( { class : 'graph-axis graph-axis-y' } );
            
            this.__canvas__.appendChild( line );
            
        },
        
        /**
         *
         * FIXME : Refactor code.
         * 
         */
        
        resolveAxisFactor : function( range ) {
            
            var factors = [ 1, 2, 5 ];
            var exponent = 1;
            
            var optimum = 10, closest = Infinity, factor, last, proximity, delta = range.delta;
            
            // what is the best factor that comes closest to the optimum?
            while ( true ) {
                
                for ( var i = 0; i < factors.length; i++ ) {
                    
                    factor = factors[ i ] * exponent;
                    proximity = this.resolveAxisFactorProximity( optimum, delta, factor );
                    if ( proximity < closest ) {
                        closest = proximity;
                        last = factor;
                    } else {
                        return last;
                    }
                    
                }
                
                exponent *= 10;
                
            }
            
            return undefined;
            
        },
        
        resolveAxisFactorProximity : function( optimum, delta, factor ) {
            return Math.abs( optimum - ( delta / factor ) );
        }
        
    });
    
} )( phi.dom );