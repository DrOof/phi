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
            this.__graphs__ = [];
        },
        
        createGraph: function( className, node, options ) {
            return new phi.graph[ className ]( node, options );
        },
        
        /* start generate random data */
        generateData : function( size ) {
            var data = [];
            for ( var i = 0; i < size; i++) {
                data.push( {
                    label : phi.uuid(),
                    a : ( 10 * i ),
                    b : 1 + rand( 99 ),
                } );
            }
    
            return data;
        },
        
        generateScatterData : function( size ) {
            var data = [];
            for ( var i = 0; i < size; i++) {
                data.push( {
                    label : phi.uuid(),
                    a : i,
                    b : GraphFactory.EXP_BEST_FIT( i, -1, 0, 400 )
                } );
            }
    
            return data;
        }
        
    });
    
    GraphFactory.LIN_BEST_FIT = function( x, a, b ) { return ( a * x ) + ( b ) };
    GraphFactory.EXP_BEST_FIT = function( x, a, b, c ) { return ( a * x * x ) + ( b * x ) + ( c ) };
    
    var factory = graph.factory = new GraphFactory();
    
} )( phi.dom );