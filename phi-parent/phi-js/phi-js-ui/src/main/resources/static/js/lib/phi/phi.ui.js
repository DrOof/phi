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

(function( phi, dom ) {

    phi.ui = {};

    // TODO : move Progres, Slider and other ui-ish components to this library and fix dependencies ( i.e. Player )

    /**
     *
     * @class Tabs
     *
     */

    var Tabs = phi.ui.Tabs = phi({
        
        __extends__: phi.EventTarget,
        
        __init__: function( node ) {

            this.__node__       = node;
            this.__tab_links__  = this.__node__.querySelectorAll( '.tabs-list-link' );
            this.__panels__     = this.__node__.querySelectorAll( '.tabs-panel' );

            this.__panels__[0].setAttribute( 'class', this.__panels__[0].getAttribute( 'class' ).replace(/\s*active/, '') + ' active' );
            this.__tab_links__[0].setAttribute( 'class', this.__tab_links__[0].getAttribute( 'class' ).replace(/\s*active/, '') + ' active' );

            this.__links__ = this.createLinkRelations();

        },

        /**
         *
         * @method createLinkRelations
         *
         * @description
         * Add events to the Tabs component
         *
         */

        createLinkRelations: function ( ) {

            var links  = new phi.dom.LinkRelations( /tabs/ , this.__node__ );
            links.add( 'panel', this.handleTab.bind( this ) );
            
            return links;

        },

        /**
         *
         * TODO : Write JSDoc
         *
         */

        handleTab: function ( e ) { e.preventDefault();
            
            var tab = parseInt( e.target.getAttribute( 'data-tab' ) , 10 ) - 1;

            var panel, link;
            for ( var i = 0; i < this.__panels__.length; i++ ) {

                panel = this.__panels__[i];
                link = this.__tab_links__[i];

                panel.className = panel.className.replace( /\s*active/, '' );
                link.className = link.className.replace( /\s*active/, '' );

                if ( tab === i ) { 
                    panel.className += ' active';
                    link.className += ' active';
                }

            }

        }

    } );

})( phi, phi.dom );
