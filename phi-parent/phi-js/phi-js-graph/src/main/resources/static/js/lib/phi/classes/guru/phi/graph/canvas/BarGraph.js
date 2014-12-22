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
    
    var BarGraph = phi.graph.BarGraph = phi({
        
        __extends__ : phi.graph.Graph,
        
        __applies__ : phi.graph.Renderable,
        
        __init__ : function( node, options ) {
            
            this.__options__ = phi.extend( BarGraph.DEFAULTS, options );
            
        },
        
        render: function( data ) {
            
            var values = this.resolveValuesByName( this.__options__[ 'axis-y-name' ] );
            var colors = this.resolveColorRange( this.__options__[ 'point-color' ], this.__options__[ 'point-color-shift' ] );
            
            var range = this.resolveRangeY( data );
            var interval = this.resolveAxisInterval( range.delta );
            
            range = this.stretchRangeToFit( range, interval );
            
            var d = this.resolveCanvasDimensions();
            
            this.renderAxisY( d, range, interval );
            
            var d = this.resolveCanvasDimensions();
            
            for ( var n = 0; n < data.length; n++ ) {
                this.renderPoint( data[n], range, values, d, n, colors[n] );
            }
            
        },
        
        renderPoint: function( point, range, values, d, n, c ) {
            
            // step
            var p = [ 40, 40, 40, 80 ];
            var s = ( ( d.width - p[1] - p[3] ) / values.length ); 
            
            var v = this.resolveValueY( point );
            var w = this.__options__[ 'point-width' ]; // FIXME : add as an option
            var h = ( ( d.height - p[0] - p[2] ) / range.max ) * v;
            var x = ( ( s * n ) + ( s / 2 ) ) + p[3];
            var y = d.height - h - p[2];
            
            this.renderPointShape( point, x, y, w, h, n, c );
            
        },
        
        renderPointShape: function( point, x, y, w, h, n, c ) {
            
            var rect = new phi.dom.svg.SVGShapeElement( 'rect' );
            this.processSVGShapeElement( rect );
            
            rect.attr( { x : x - ( w / 2 ), y : y, width : w, height : h, fill : c } );
            rect.attr( { 'class' : 'graph-point graph-point-' + n, point : point } );
            
            this.__canvas__.appendChild( rect );
            
        },
        
        /**
         *
         * FIXME : Refactor code.
         * 
         */
        
        renderAxisY: function( d, range, i ) {
            
            var p = [ 40, 40, 40, 40 ];
            
            var w = d.width - p[1] - p[3];
            var h = d.height - p[0] - p[2];
            
            var line = new phi.dom.svg.SVGShapeElement( 'line' );
            line.attr( { x1 : p[3], y1: p[0], x2 : p[3], y2 : h + p[0] } );
            line.attr( { 'class' : 'graph-axis graph-axis-y' } );
            
            this.__canvas__.appendChild( line );
            
            var l = range.delta / i;
            var s = h / l;
            var m = range.min;
            
            for ( var n = 0; n < l+1; n++) {
                this.renderAxisYInterval( p, w, h, l, s, i, n, m );
            }
            
        },
        
        /**
         *
         * FIXME : refactor
         * FIXME : deal with large numbers on intervals
         *
         */
        
        renderAxisYInterval: function( p, w, h, l, s, i, n, m ) {
            
            var x1 = p[3],
                y1 = p[0] + h - ( n * s ),
                x2 = p[3] + w,
                y2 = y1;
            
            var line = new phi.dom.svg.SVGShapeElement( 'line' );
            line.attr( { x1 : x1, y1 : y1, x2 : x2, y2: y2 } );
            line.attr( { 'class' : 'graph-axis-interval graph-axis-interval-' + n } );
            
            this.__canvas__.appendChild( line );
            
            var text = new phi.dom.svg.SVGShapeElement( 'text' );
            text.attr( { x : x1 - 20, y : y2 + 3, textContent : m + ( n * i ) } );
            text.attr( { 'class' : 'graph-axis-interval-text graph-axis-y-interval-text' } );
            
            this.__canvas__.appendChild( text );
            
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
        
        /**
         *
         * FIXME : move to parent
         *
         */
        
        stretchRangeToFit : function( range, interval ) {
            
            var min = Math.floor( range.min / interval ) * interval, 
                max = Math.ceil( range.max / interval ) * interval;
            
            return {
                min : min, max : max,
                delta : max - min
            }
            
        },
        
        /**
         *
         * FIXME : move to parent
         *
         */
        
        resolveAxisIntervalProximity : function( optimal, real ) {
            return Math.abs( optimal - real );
        }
        
    });
    
    BarGraph.DEFAULTS = {
        'axis-x-name'       : undefined,
        'axis-x-interval'   : 10,
        'point-color'       : '#ff0099',
        'point-color-shift' : 0,
        'point-width'       : 50
    };
    
} )( phi.dom );