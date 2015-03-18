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
    
    var PointLineGraph = phi.graph.PointLineGraph = phi({
        
        __extends__ : phi.graph.PointGraph,
        
        __applies__ : phi.graph.Renderable,
        
        __init__ : function( node, options ) {
            this.__options__ = phi.extend( {}, PointLineGraph.DEFAULTS, options );
        },

        /**
         *
         * Render
         * FIXME : refactor
         * TODO : write JSDoc
         *
         */

        render: function( data ) {
            
            var sorted = this.resolveSortOrderByName( data, this.__options__[ 'axis-x-name' ] );
            var colors = this.resolveColorRange( this.__options__[ 'point-color' ], this.__options__[ 'point-color-shift' ] );
            
            var rx = this.resolveRangeX( data );
            var ry = this.resolveRangeY( data );
            
            var ix = this.__options__[ 'axis-x-interval' ] || this.resolveAxisInterval( rx.delta );
            var iy = this.__options__[ 'axis-y-interval' ] || this.resolveAxisInterval( ry.delta );
            
            rx = this.stretchRangeToFit( rx, ix );
            ry = this.stretchRangeToFit( ry, iy );

            var d = this.resolveCanvasDimensions();
            
            if ( this.__options__[ 'axis-x-visible' ] ) {
                this.renderAxisX( d, rx, ix );
            }
            
            if ( this.__options__[ 'axis-y-visible' ]) {
                this.renderAxisY( d, ry, iy );
            }
            
            var p0, p1, point;
            for ( var n = 0; n < sorted.length; n++ ) {
                
                point = sorted[n];
                
                p0 = this.resolvePointPosition( point, rx, ry, d );

                if ( p0 && p1 ) {
                    this.renderPointToPointLine( p0.x, p0.y, p1.x, p1.y, colors[n] );
                }

                p1 = p0;
                
            }

            for ( var n = 0; n < sorted.length; n++ ) {

                point = sorted[n];
                p0 = this.resolvePointPosition( point, rx, ry, d );
                this.renderPointShape( point, p0.x, p0.y, n, colors[n] );

            }
            
        },

        /**
         *
         * Render point to point line
         * FIXME : refactor
         * TODO : write JSDoc
         *
         */

        renderPointToPointLine: function( x1, y1, x2, y2, color ) {
            
            var line = phi.svg.shape( 'line' )
            line.attr( { x1 : x1, y1 : y1, x2 : x2, y2 : y2, 'class' : 'graph-point-line' } );

            this.__canvas__.appendChild( line );
            
        }
        
    });

    PointLineGraph.DEFAULTS = {

        'axis-x-name'           : undefined,
        'axis-x-interval'       : undefined,
        'axis-x-type'           : undefined,
        'axis-x-format'         : undefined,
        'axis-x-min'            : undefined,
        'axis-x-max'            : undefined,
        'axis-x-range'          : undefined,
        'axis-x-visible'        : 'visible',

        'axis-y-name'           : undefined,
        'axis-y-interval'       : undefined,
        'axis-y-type'           : undefined,
        'axis-y-format'         : undefined,
        'axis-y-min'            : undefined,
        'axis-y-max'            : undefined,
        'axis-y-range'          : undefined,
        'axis-y-visible'        : 'visible',

        'point-width'           : 5,
        'point-color'           : undefined,
        'point-color-shift'     : undefined,

        'canvas-padding'        : [ 40, 40, 40, 40 ]

    };

    graph.factory.registerGraph( 'point-line-graph', PointLineGraph );

} )( phi.dom );