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
    
    var Renderable = phi.graph.Renderable = phi.aspect( {
        render: {
            before : function() {
                this.clear();
            } 
        }
    } );
    
    var Graph = phi.graph.Graph = phi({
        
        __extends__ : phi.EventTarget,
        
        /**
         *
         * @constructor
         * @param node
         * @paran options 
         *
         */
        
        __init__ : function( node, options ) {

            this.__node__       = node;
            this.__options__    = options;

            this.__canvas__ = this.createCanvas( this.__node__ );
            this.__tooltip__    = this.createTooltip();
            this.__data__       = [];

            this.addEventListener( 'pointenter',  this.__tooltip__.handlePointEnter.bind(   this.__tooltip__ ) );
            this.addEventListener( 'pointleave',  this.__tooltip__.handlePointLeave.bind(   this.__tooltip__ ) );
            this.addEventListener( 'pointselect', this.__tooltip__.handlePointSelect.bind(  this.__tooltip__ ) );
            
            window.addEventListener( 'resize', this.handleResize.bind( this ) );
            
        },

        /**
         *
         * TODO : write JavaDoc
         *
         */

        createCanvas: function( node ) {

            var w = node.clientWidth;
            var h = node.clientHeight;

            var canvas = phi.svg.shape( 'svg', { width : '100%', height: '100%' } );

            // calculate viewbox
            canvas.attr( { viewBox : new phi.dom.Template( '0 0 {{w}} {{h}}' ).parse( { w : w, h : h } ) } );
            canvas.attr( { preserveAspectRatio : 'xMinYMin slice' } );
            node.appendChild( canvas.element );

            return canvas;
            
        },
        
        /**
         *
         * TODO : write JavaDoc
         *
         */
        
        createTooltip: function( template ) {
            
            var tooltip = new phi.graph.Tooltip( this.__options__[ 'point-info' ] );
            return tooltip;
            
        },

        /**
         *
         * TODO : write JavaDoc
         *
         */
        
        resolveSigmaX: function() {
            
            var values = this.resolveValuesByName( this.__options__[ 'axis-x-name' ] );
            return this.__sigma__( values );
            
        },
        
        /**
         *
         * TODO : write JavaDoc
         *
         */
        
        resolveSigmaY: function() {
            
            var values = this.resolveValuesByName( this.__options__[ 'axis-y-name' ] );
            return this.__sigma__( values );
            
        },
        
        /**
         *
         * TODO : write JavaDoc
         *
         */
        
        resolveRangeX: function() {
            return new phi.graph.ValueRange( this.resolveValuesByName( this.__options__[ 'axis-x-name' ] ), this.__options__[ 'axis-x-min' ], this.__options__[ 'axis-x-max' ] );
        },
        
        /**
         *
         * TODO : write JavaDoc
         *
         */
        
        resolveRangeY: function() {
            return new phi.graph.ValueRange( this.resolveValuesByName( this.__options__[ 'axis-y-name' ] ), this.__options__[ 'axis-y-min' ], this.__options__[ 'axis-y-max' ] );
        },
        
        /**
         *
         * TODO : write JavaDoc
         *
         */
        
        resolveValueX: function( point ) {
            return point[ this.__options__[ 'axis-x-name' ] ];
        },
        
        /**
         *
         * TODO : write JavaDoc
         *
         */
        
        resolveValueY: function( point ) {
            return point[ this.__options__[ 'axis-y-name' ] ];
        },
        
        /**
         *
         * TODO : write JavaDoc
         *
         */
        
        resolveValuesByName : function( name ) {
            return this.__data__.map( function( a ) { return a[ name ] } );
        },
        
        /**
         *
         * TODO : write JavaDoc
         *
         */
        
        resolveCanvasDimensions: function() {
            
            var w = this.__canvas__.element.clientWidth;
            var h = this.__canvas__.element.clientHeight;
            
            return {
                width : w,
                height : h,
                cx : w / 2,
                cy : h / 2
            }
        },
        
        /**
         *
         * TODO : write JavaDoc
         *
         */
        
        resolveSortOrderByName: function( data, name ) {
            return data.sort( function( a, b ) { return a[name] - b[name]; } );
        },
        
        /**
         *
         * TODO : write JavaDoc
         *
         */
        
        resolveColorRange: function( color, shift ) {

            // inspect rgb from css.
            var c = parseInt( color, 16 );
            var colors = [];
            for ( var i = this.__data__.length - 1; i >= 0; i-- ) {
                colors.push( '#' + c.toString( 16 ) );
                c = parseInt( c + parseInt( shift ) );
            }

            return colors;

        },
        
        /**
         *
         * Add data
         *
         */
        
        add: function( data ) {
            this.set( this.__data__.concat( data ) );
        },
        
        /**
         *
         * Set data
         *
         */
        
        set: function( data ) {
            
            this.__data__ = data;
            this.render( data );
            this.dispatchEvent( { type : 'dataupdate' } );
            
        },
        
        options: function( options ) {
            
            phi.extend( this.__options__, options );
            
        },
            
        /**
         *
         * Empty the canvas
         *
         */
        
        clear: function() {
            
            var element = this.__canvas__.element;
            
            while ( element.lastChild ) {
                element.removeChild( element.lastChild );
            }
            
        },
        
        refresh: function() {
            this.render( this.__data__ );
        },
        
        render: function( data ) {
            
            /**
             *
             * Implement this method to render a graph.
             *
             */
            
        },
        
        /**
         *
         * TODO : refactor
         *
         */

        format: function( value, type, format ) {
            
            var type    = type || 'none';
            var format  = format || '';

            var result;
            switch ( type ) {
                
                case 'date' : {
                    result = new phi.dom.DateFormat( format ).format( new Date( value ) );
                    break;
                }
                
                case 'number' : 
                case 'text' : 
                default : {
                    result = value;
                    break;
                }

            }

            return result;

        },

        label: function( point ) {
            return new phi.dom.Template( this.__options__[ 'point-info' ] ).parse( point.getAttribute( 'point' ) );
        },
        

        sort: function( data ) {
            return data.sort( function( a, b ) {  } );  
        },
        
        /**
         *
         * TODO : replace with functional js ( oliver steele )
         *
         */
        
        __sigma__: function( values ) {
            return values.reduce( function( a, b ) { return a + b; } );
        },
        
        processSVGShapeElement: function( shape ) {
            
            shape.element.addEventListener( 'mouseenter',   this.handleMouseEnter.bind( this ), true );
            shape.element.addEventListener( 'mouseleave',   this.handleMouseLeave.bind( this ), true );
            shape.element.addEventListener( 'mouseup',      this.handleMouseUp.bind( this ), true );
            
        },
        
        /**
         *
         * Handle point enter
         *
         */
        
        handleMouseEnter: function( e ) {
            this.dispatchEvent( { type : 'pointenter', explicitOriginalTarget : e.target } );
        },
        
        /**
         *
         * Handle point leave
         *
         */
        
        handleMouseLeave: function( e ) {
            this.dispatchEvent( { type : 'pointleave', explicitOriginalTarget : e.target } );
        },
        
        /**
         *
         * Handle point select
         *
         */
        
        handleMouseUp: function( e ) {
            this.dispatchEvent( { type : 'pointselect', explicitOriginalTarget : e.target } );
        },
        
        handleResize: function( e ) {
            this.render( this.__data__ );
        },

        /**
         *
         * Render axis x
         * FIXME : refactor
         * TODO : write JSDoc
         *
         */

        renderAxisX: function( d, range, i ) {
            
            var p = this.__options__[ 'canvas-padding' ];
            
            var w = d.width - p[1] - p[3];
            var h = d.height - p[0] - p[2];
            
            var line = phi.svg.shape( 'line' );
            line.attr( { x1 : p[3], y1: p[0] + h, x2 : p[3] + w, y2 : p[0] + h } );
            line.attr( { 'class' : 'graph-axis graph-axis-x' } );
            
            this.__canvas__.appendChild( line );
            
            var l = range.delta / i;
            var s = w / l;
            var m = range.min;
            
            for ( var n = 0; n < l+1; n++) {
                this.renderAxisXInterval( p, w, h, l, s, i, n, m );
            }
            
        },

        /**
         *
         * Render axis x interval
         * FIXME : refactor
         * TODO : write JSDoc
         *
         */

        renderAxisXInterval: function( p, w, h, l, s, i, n, m ) {
            
            var x1 = p[3] + ( n * s ),
                y1 = p[0] + h,
                x2 = x1,
                y2 = p[0];
            
            var line = phi.svg.shape( 'line' );
            line.attr( { x1 : x1, y1 : y1, x2 : x2, y2: y2 } );
            line.attr( { 'class' : 'graph-axis-interval graph-axis-interval-' + n } );
            
            this.__canvas__.appendChild( line );
            
            var text = phi.svg.shape( 'text' );
            text.attr( { x : x2, y : y1 + 20, textContent : this.format( m + ( n * i ), this.__options__[ 'axis-x-type' ], this.__options__[ 'axis-x-format' ] ) } );
            text.attr( { 'class' : 'graph-axis-interval-text graph-axis-x-interval-text' } );
            
            this.__canvas__.appendChild( text );
            
        },

        /**
         *
         * Render axis y
         * FIXME : refactor
         * TODO : write JSDoc
         *
         */

        renderAxisY: function( d, range, i ) {
            
            var p = this.__options__[ 'canvas-padding' ];
            
            var w = d.width - p[1] - p[3];
            var h = d.height - p[0] - p[2];
            
            var line = phi.svg.shape( 'line' );
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
         * Render axis y interval
         * FIXME : refactor
         * TODO : write JSDoc
         *
         */

        renderAxisYInterval: function( p, w, h, l, s, i, n, m ) {

            var x1 = p[3],
                y1 = p[0] + h - ( n * s ),
                x2 = p[3] + w,
                y2 = y1;

            var line = phi.svg.shape( 'line' );
            line.attr( { x1 : x1, y1 : y1, x2 : x2, y2: y2 } );
            line.attr( { 'class' : 'graph-axis-interval graph-axis-interval-' + n } );

            this.__canvas__.appendChild( line );

            var text = phi.svg.shape( 'text' );
            text.attr( { x : x1 - 20, y : y2 + 3, textContent : this.format( m + ( n * i ), this.__options__[ 'axis-y-type' ], this.__options__[ 'axis-y-format' ] ) } );
            text.attr( { 'class' : 'graph-axis-interval-text graph-axis-y-interval-text' } );

            this.__canvas__.appendChild( text );

        },

        /**
         *
         * Stretch range to fit
         * FIXME : refactor
         * TODO : write JSDoc
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
         * Resolve axis interval
         * FIXME : refactor
         * TODO : write JSDoc
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
         * Resolve axis interval proximity
         * FIXME : refactor
         * TODO : write JSDoc
         *
         */

        resolveAxisIntervalProximity : function( optimal, real ) {
            return Math.abs( optimal - real );
        }

    });
    
    Graph.DEFAULTS = {

        'axis-x-name'           : undefined,
        'axis-x-interval'       : undefined,
        'axis-x-type'           : undefined,
        'axis-x-format'         : undefined,
        'axis-x-min'            : undefined,
        'axis-x-max'            : undefined,
        'axis-x-visible'        : 'visible',

        'axis-y-name'           : undefined,
        'axis-y-interval'       : undefined,
        'axis-y-type'           : undefined,
        'axis-y-format'         : undefined,
        'axis-y-min'            : undefined,
        'axis-y-max'            : undefined,
        'axis-y-visible'        : 'visible',

        'point-color'           : undefined,
        'point-color-shift'     : undefined,

        'canvas-padding'        : [ 40, 40, 40, 40 ]

    }
    
} )( phi.dom );