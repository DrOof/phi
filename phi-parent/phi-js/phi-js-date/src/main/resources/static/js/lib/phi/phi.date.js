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

(function( phi, dom, form ) {

    phi.date = {};
     /**
     *
     * 
     *
     */
    
    var Calendar = phi.date.Calendar = phi({
        
        __extends__: phi.EventTarget,
        
        __init__: function( node, options ) {

            this.__node__       = node;
            this.__options__    = phi.extend( {}, Calendar.DEFAULTS, options );
            // this.__nodeForm__   = new form.Form(node);
            this.__calendar__   = {};

            this.buildCalendar( this.__options__ );
            this.createEventListeners( this.__node__, this.__calendar__ );
        },

        /**
        *
        *
        */        

        buildCalendar: function ( options ) {
            this.__calendar__ = document.createElement('div');
            this.__calendar__.setAttribute('class', 'phi-calendar');

            document.body.appendChild( this.__calendar__ );
        },

        /**
        *
        *
        **/
        
        createEventListeners: function ( node, calendar ) {
            node.addEventListener( 'focus',        this.handleFocus.bind(this), true );
            node.addEventListener( 'blur',         this.handleBlur.bind(this), true );
        },

        /**
         *
         * Handle input focus
         *
         */

        handleFocus: function( e ) {

            this.__calendar__.setAttribute('class', this.__calendar__.getAttribute('class').replace(' active', '') + ' active');

            // this.dispatchEvent( { type : 'inputfocus', explicitOriginalTarget : e.target } );
        },

        /**
        *
        * Handle input blur
        *
        */
        
        handleBlur: function ( e ) {
            // this.dispatchEvent( { type : 'inputblur',  explicitOriginalTarget : e.target } );
        }
    } );

    Calendar.KEY_CODE = {
        BACKSPACE : 8,
        COMMA     : 188,
        DELETE    : 46,
        DOWN      : 40,
        END       : 35,
        ENTER     : 13,
        ESCAPE    : 27,
        HOME      : 36,
        LEFT      : 37,
        PAGE_DOWN : 34,
        PAGE_UP   : 33,
        PERIOD    : 190,
        RIGHT     : 39,
        SPACE     : 32,
        TAB       : 9,
        UP        : 38
    };

    Calendar.DEFAULTS = {

    };
    
    
})( phi, phi.dom, phi.form );
