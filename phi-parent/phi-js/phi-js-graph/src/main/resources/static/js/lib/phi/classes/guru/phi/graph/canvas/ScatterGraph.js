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
            
            this.__options__ = phi.extend( ScatterGraph.DEFAULTS, options );
            
        },
        
        render: function( data ) {
            
            var colors = this.resolveColorRange( this.__options__[ 'point-color' ], this.__options__[ 'point-color-shift' ] );
            
            var rx = this.stretchRangeToFit( this.resolveRangeX( data ) );
            var ry = this.stretchRangeToFit( this.resolveRangeY( data ) );
            
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
            
            var interval = this.resolveAxisInterval( rx );
            // start at less than...
            // end at more than max..
            
            var w = d.width - p[1] - p[3];
            var h = d.height - p[0] - p[2];
            
            var line = new phi.dom.svg.SVGShapeElement( 'line' );
            line.attr( { x1 : p[3], y1: p[0] + h, x2 : p[3] + w, y2 : p[0] + h } );
            line.attr( { 'class' : 'graph-axis graph-axis-x' } );
            
            
            
            this.__canvas__.appendChild( line );
            
        },
        
        /**
         *
         * FIXME : Refactor code.
         * 
         */
        
        renderAxisY: function( d, ry ) {
            
            var p = [ 40, 40, 40, 40 ];
            
            var interval = this.resolveAxisInterval( ry );
            // start at less than...
            // end at more than max..
            
            var w = d.width - p[1] - p[3];
            var h = d.height - p[0] - p[2];
            
            var line = new phi.dom.svg.SVGShapeElement( 'line' );
            line.attr( { x1 : p[3], y1: p[0], x2 : p[3], y2 : h + p[0] } );
            line.attr( { 'class' : 'graph-axis graph-axis-y' } );
            
            this.__canvas__.appendChild( line );
            
        },
        
        /**
         *
         * FIXME : Refactor code.
         * 
         */
        
        resolveAxisInterval : function( delta, exponent, closest, factor ) {
            
            var optimal = 10;
            var proper = [ 1, 2, 5 ];
            
            exponent = exponent || 1;
            closest  = closest || Infinity;
            
            var f, p;
            for ( var i = 0; i < proper.length; i++ ) {
                
                f = proper[ i ] * exponent;
                p = this.resolveAxisIntervalProximity( optimal, delta / f );
                
                if ( p < closest ) {
                    closest = p;
                    factor = f;
                } else {
                    return factor;
                }
                
            }
            
            return this.resolveAxisInterval( delta, exponent * 10, closest, factor );
            
        },
        
        resolveAxisIntervalProximity : function( optimal, real ) {
            return Math.abs( optimal - real );
        },
        
        stretchRangeToFit : function( range ) {
            
            var interval = this.resolveAxisInterval( range.delta );
            var min = Math.floor( range.min / interval ) * interval, 
                max = Math.ceil( range.max / interval ) * interval;
            
            return {
                min : min,
                max : max,
                delta : max - min
            }
            
        },
        
    });
    
    ScatterGraph.DEFAULTS = {
        'axis-x-name'       : undefined,
        'axis-x-interval'   : 10,
        'axis-y-name'       : undefined,
        'axis-y-interval'   : 10,
        'point-color'       : '#ff0099',
        'point-color-shift' : 0
    };
    
} )( phi.dom );