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
    
    var Graph = phi.graph.Graph = phi({
        
        __extends__ : phi.EventTarget,
        
        /**
         *
         * 
         *
         */
        
        __init__ : function( node, options ) {
            
            this.node = node;
            this.options = options;
            
            this.canvas = this.createCanvas( node );
            this.data = [];
            
        },
        
        resolveSigmaX: function() {
            
            var values = this.resolveValuesByName( this.options.x.name );
            return this.__sigma__( values );
            
        },
        
        resolveSigmaY: function() {
            
            var values = this.resolveValuesByName( this.options.y.name );
            return this.__sigma__( values );
            
        },
        
        resolveRangeX: function() {
            
            var values = this.resolveValuesByName( this.options.x.name );
            
            return {
                min: this.__min__( values ),
                max: this.__max__( values )
            }
            
        },
        
        resolveRangeY: function() {
            
            var values = this.resolveValuesByName( this.options.y.name );
            
            return {
                min: this.__min__( values ),
                max: this.__max__( values )
            }
            
        },
        
        resolveValueX: function( point ) {
            return point[ this.options.x.name ];
        },
        
        resolveValueY: function( point ) {
            return point[ this.options.y.name ];
        },
        
        resolveValuesByName : function( name ) {
            return this.data.map( function( a ) { return a[ name ] } )
        },
        
        createCanvas: function( node ) {
            
            var canvas = new phi.dom.SVGShapeElement( 'svg' );
            node.appendChild( canvas.element );
            
            return canvas;
            
        },
        
        add: function( data ) {
            
            this.set( this.data.join( data ) );
            
        },
        
        set: function( data ) {
            
            this.data = data;
            this.render( data );
            this.dispatchEvent( { type : 'dataupdate' } );
            
        },
        
        render: function( data ) {
            // console.log( data );
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
            return values.reduce( function( a, b ) { return Math.min( a, b ) } );
        },
        
        /**
         *
         * TODO : replace with functional js ( oliver steele )
         *
         */
        
        __sigma__: function( values ) {
            return values.reduce( function( a, b ) { return a + b; } );
        },
        
    });
    
} )( phi.dom );