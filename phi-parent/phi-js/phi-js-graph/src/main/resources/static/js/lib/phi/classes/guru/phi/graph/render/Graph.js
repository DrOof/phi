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
            
            this.__canvas__     = this.createCanvas( node );
            this.__label__      = this.createLabel( node );
            this.__data__       = [];

        },

        /**
         *
         * TODO : write JavaDoc
         *
         */
        
        createCanvas: function( node ) {
            
            var w = node.clientWidth;
            var h = node.clientHeight;
            
            var canvas = new phi.dom.svg.SVGShapeElement( 'svg', { width : '100%', height: '100%' } );
            
            // calculate viewbox
            canvas.attr( { viewBox : '0 0 {{w}} {{h}}'.replace( '{{w}}', w ).replace( '{{h}}', h ) } );
            node.appendChild( canvas.element );
            
            return canvas;
            
        },
        
        /**
         *
         * TODO : write JavaDoc
         *
         */
        
        createLabel: function( node ) {
            
            var label = new phi.dom.Template( Graph.LABEL );
            return label;
            
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
            return new ValueRange( this.resolveValuesByName( this.__options__[ 'axis-x-name' ] ), this.__options__[ 'axis-x-min' ], this.__options__[ 'axis-x-max' ] );s
        },
        
        /**
         *
         * TODO : write JavaDoc
         *
         */
        
        resolveRangeY: function() {
            return new ValueRange( this.resolveValuesByName( this.__options__[ 'axis-y-name' ] ), this.__options__[ 'axis-y-min' ], this.__options__[ 'axis-y-max' ] );s
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

        format: function( value, type, format ) {
            
            var type = type || 'none';
            var format = format || '';

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

        sort: function( data ) {
            return data.sort( function( a, b ) {  } );  
        },
        
        /**
         *
         * Range
         *
         */
        
        __range__: function( values, min, max ) {
            return new ValueRange( values, min, max );
        },
        
        /**
         *
         * TODO : replace with functional js ( oliver steele )
         *
         */
        
        __min__: function( values ) {
            return values.reduce( function( a, b ) { return Math.min( a, b ) } );
        },
        
        /**
         *
         * TODO : replace with functional js ( oliver steele )
         *
         */
        
        __max__: function( values ) {
            return values.reduce( function( a, b ) { return Math.max( a, b ) } );
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
        }

    });


    /**
     *
     * Value range
     *
     */
    
    var ValueRange = phi({
        
        __init__ : function( values, min, max ) {

            this.min = ( min !== 'auto' && min !== undefined ) ? min : this.resolveMinValue( values );
            this.max = ( max !== 'auto' && max !== undefined ) ? max : this.resolveMaxValue( values );

            this.delta = this.max - this.min;

        },
        
        resolveMinValue: function( values ) {
            return values.reduce( function( a, b ) { return Math.min( a, b ) } );
        },
        
        resolveMaxValue: function( values ) {
            return values.reduce( function( a, b ) { return Math.max( a, b ) } );
        }
        
    })
    
} )( phi.dom );