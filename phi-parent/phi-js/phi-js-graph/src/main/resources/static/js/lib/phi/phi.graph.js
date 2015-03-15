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
    
    /* simple random number */
    var rand = function( x ) {
        return Math.round( Math.random() * x );
    };
    
    var graph = phi.graph = phi.graph || {};
    
    var GraphFactory = graph.GraphFactory = phi({
        
        __init__ : function() {

            this.__graphs__ = {};
            this.__registered__ = {};
            this.__relations__ = new phi.dom.AnimationRelations( /graph/ );
            this.__relations__.add( 'create', this.handleGraphCreate.bind( this ) );

        },
        
        registerGraph: function( type, clazz ) {
            this.__registered__[ type ] = clazz;
        },
        
        unregisterGraph: function( type ) {
            delete this.__registered__[ type ];
        },
        
        /**
         *
         * Create graph
         *
         */
        
        createGraph: function( type, node, options, data ) {
            
            var clazz = this.__registered__[ type ];

            var graph = new clazz( node, options );
            var id = node.getAttribute( 'id' );
            
            var name =  ( id ) ? id : 'graph-' + phi.uuid();
            node.setAttribute( 'id', name );
            
            if ( data ) {
                graph.set( data );
            }
            
            this.__graphs__[ name ] = graph;
            
            return graph;
            
        },
        
        /**
         *
         * Handle graph create
         *
         */

        handleGraphCreate: function( e ) {

            var node = e.target;

            var graph = this.getGraphById( node.id );
            
            if ( !graph ) {

                var type = node.getAttribute( 'type' );
                var options = JSON.parse( node.getAttribute( 'options' ) );
                var data = JSON.parse( node.getAttribute( 'data' ) );

                this.createGraph( type, node, options, data );

            }

        },

        getGraphById: function( id ) {
            return this.__graphs__[ id ];
        },

        /**
         *
         * Generate random data.
         *
         */

        generateData : function( size ) {
            var data = [];
            for ( var i = 0; i < size; i++) {
                data.push( {
                    label : phi.uuid(),
                    x : ( 10 * i ),
                    y : 1 + rand( 99 ),
                } );
            }
    
            return data;
        },

        /**
         *
         * Generate exponentional data.
         *
         */
        
        generateDataByFunction : function( size, fn ) {
            var data = [];
            for ( var i = 0; i < size; i++) {
                data.push( {
                    label : phi.uuid(),
                    x : i,
                    y : fn( i, 1, 0, 10 )
                } );
            }
    
            return data;
        }

    });
    
    GraphFactory.LIN_BEST_FIT = function( x, a, b ) { return ( a * x ) + ( b ) };
    GraphFactory.EXP_BEST_FIT = function( x, a, b, c ) { return ( a * x * x ) + ( b * x ) + ( c ) };
    
    graph.factory = new GraphFactory();
    
} )( phi.dom );