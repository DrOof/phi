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
    
    var PointGraph = phi.graph.PointGraph = phi({
        
        __extends__ : phi.graph.Graph,
        
        __applies__ : phi.graph.Renderable,
        
        __init__ : function( node, options ) {
            
            this.__options__ = phi.extend( {}, PointGraph.DEFAULTS, options );
            
        },

        /**
         *
         * Render
         * FIXME : refactor
         * TODO : write JSDoc
         *
         */

        render: function( data ) {
            
            var colors = this.resolveColorRange( this.__options__[ 'point-color' ], this.__options__[ 'point-color-shift' ] );
            
            
            var rx = this.resolveRangeX( data );
            var ry = this.resolveRangeY( data );
            
            var ix = this.__options__[ 'axis-x-interval' ] || this.resolveAxisInterval( rx.delta );
            var iy = this.__options__[ 'axis-y-interval' ] || this.resolveAxisInterval( ry.delta );
            
            rx = this.stretchRangeToFit( rx, ix );
            ry = this.stretchRangeToFit( ry, iy );
            
            var d = this.resolveCanvasDimensions();
            
            if ( this.__options__[ 'axis-x-visible' ]) {
                this.renderAxisX( d, rx, ix );
            }
            
            if ( this.__options__[ 'axis-y-visible' ]) {
                this.renderAxisY( d, ry, iy );
            }
            
            var p0 = null;
            var point = null;
            for ( var n = 0; n < data.length; n++ ) {
                
                point = data[n];
                
                p0 = this.resolvePointPosition( point, rx, ry, d );
                this.renderPointShape( point, p0.x, p0.y, n, colors[n] );
                
            }
            
        },

        /**
         *
         * Render point shape
         * FIXME : refactor
         * TODO : write JSDoc
         *
         */

        renderPointShape: function( point, x, y, n, color ) {

            var shape = phi.svg.shape( 'circle' );
            this.processShape( shape );

            var inrx = new phi.graph.ValueRange( this.__options__[ 'axis-x-range' ] || [ -Infinity, Infinity ] ).isWithinRange( point[ this.__options__[ 'axis-x-name' ] ] );
            var inry = new phi.graph.ValueRange( this.__options__[ 'axis-y-range' ] || [ -Infinity, Infinity ] ).isWithinRange( point[ this.__options__[ 'axis-y-name' ] ] );

            var clazz = [];
                clazz.push( 'graph-point' );
                clazz.push( 'graph-point-' + n );
                clazz.push( inrx ? '' : 'graph-point-outside-x-range' );
                clazz.push( inry ? '' : 'graph-point-outside-y-range' );

            shape.attr( { cx : x, cy : y, r : this.__options__[ 'point-width' ], fill : color } );
            shape.attr( { 'class' : clazz.join(' '), point : point } );

            this.__canvas__.appendChild( shape );
            
        },

        /**
         *
         * Resolve point position
         * FIXME : refactor
         * TODO : write JSDoc
         *
         */

        resolvePointPosition: function( point, rx, ry, d ) {

            // top, right, bottom, left
            var p = this.__options__[ 'canvas-padding' ];
            
            var w = d.width - p[1] - p[3];
            var h = d.height - p[0] - p[2];

            var vx = this.resolveValueX( point );
            var vy = this.resolveValueY( point );

            var x = ( w / rx.delta ) * ( vx - rx.min ) + p[3];
            var y = - ( h / ry.delta ) * ( vy - ry.min ) + p[0] + h; 

            return { x : x, y: y };

        }

    });
    
    PointGraph.DEFAULTS = {

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

    graph.factory.registerGraph( 'point-graph', PointGraph );

} )( phi.dom );