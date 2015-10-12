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
            
            this.__options__ = phi.extend( {}, BarGraph.DEFAULTS, options );
            
        },

        /**
         *
         * Render
         * FIXME : refactor
         * TODO : write JSDoc
         *
         */

        render: function( data ) {
            
            var values = this.resolveValuesByName( this.__options__[ 'axis-y-name' ] );
            var colors = this.resolveColorRange( this.__options__[ 'point-color' ], this.__options__[ 'point-color-shift' ] );
            
            var range = this.resolveRangeY( data );
            var interval = this.__options__[ 'axis-y-interval' ] || this.resolveAxisInterval( range.delta );
            
            range = this.stretchRangeToFit( range, interval );
            
            var d = this.resolveCanvasDimensions();
            var w = this.resolvePointWidth( d, data.length );
            
            if ( this.__options__[ 'axis-y-visible' ] ) {
                this.renderAxisY( d, range, interval );
            }

            for ( var n = 0; n < data.length; n++ ) {
                this.renderPoint( data[n], range, values, d, w, n, colors[n] );
            }
            
        },

        /**
         *
         * Render point
         * FIXME : refactor
         * TODO : write JSDoc
         *
         */

        renderPoint: function( point, range, values, d, w, n, c ) {

            var p = this.__options__[ 'canvas-padding' ];
            var s = ( ( d.width - p[1] - p[3] ) / values.length ); 
            var v = this.resolveValueY( point );
            var h = ( ( d.height - p[0] - p[2] ) / range.max ) * v;
            var x = ( ( s * n ) ) + ( s / 2 ) + p[3];
            var y = d.height - h - p[2];

            this.renderPointShape( point, x, y, w, h, n, c );

        },

        /**
         *
         * Render point shape
         * FIXME : refactor
         * TODO : write JSDoc
         *
         */

        renderPointShape: function( point, x, y, w, h, n, c ) {

            var shape = new phi.svg.Shape( 'rect' );
            this.processShape( shape );

            shape.attr( { x : x - ( w / 2 ), y : y, width : w, height : h, fill : c } );
            shape.attr( { 'class' : 'graph-point graph-point-' + n, point : point } );

            this.__canvas__.appendChild( shape );

        },

        /**
         *
         * Resolve point width
         * FIXME : refactor
         * TODO : write JSDoc
         *
         */

        resolvePointWidth : function( d, s ) {
            var p = this.__options__[ 'canvas-padding' ];
            var w = this.__options__[ 'point-width' ];
            var max = ( d.width - p[1] - p[3] ) / s;
            return w === 'auto' ? max : ( w > max ? max : w );
        }

    });
    
    BarGraph.DEFAULTS = {
        'axis-y-name'       : undefined,
        'axis-y-interval'   : undefined,
        'axis-y-type'       : undefined,
        'axis-y-format'     : undefined,
        'axis-y-min'        : undefined,
        'axis-y-max'        : undefined,
        'axis-y-visible'    : 'visible',
        'point-width'       : 'auto',
        'point-color'       : undefined,
        'point-color-shift' : undefined,
        'canvas-padding'    : [ 40, 40, 40, 40 ]
    };
    
    graph.factory.registerGraph( 'bar-graph', BarGraph );
    
} )( phi.dom );