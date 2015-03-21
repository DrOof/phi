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

            this.__options__['first-day'] = ( this.__options__['first-day'] < 1 || this.__options__['first-day'] > 7 ) ? 7 : this.__options__['first-day'];
            this.__options__['days-in-week'] = this.__options__['days-in-week'].slice( this.__options__['first-day'] - 1 ).concat( this.__options__['days-in-week'].slice( 0, this.__options__['first-day'] - 1 ) );

            this.__calendar__ = null

            this.__id__ = this.__options__['id'] || phi.uuid();
            this.__date__ = this.__options__['date'];

            this.build( );

            this.__relations__ = new phi.dom.LinkRelations( new RegExp('calendar' + this.__id__) , this.__calendar__ );
            
            this.createEventListeners( );

        },

        /**
        *
        *
        **/
        
        createEventListeners: function ( ) {

            this.__node__.addEventListener( 'focus', this.handleFocus.bind(this), true );
            this.__node__.addEventListener( 'blur',  this.handleBlur.bind(this),  true );

            this.__relations__.add('prev', this.handleCalendarPrevClick.bind( this ) );
            this.__relations__.add('next', this.handleCalendarNextClick.bind( this ) );
            this.__relations__.add('date', this.handleCalendarDayClick.bind( this ) );
        
        },


        /**
        *
        *
        *
        */

        handleCalendarPrevClick: function ( e ) {
            var node = e.target;
        },

        /**
        *
        *
        *
        */

        handleCalendarNextClick: function ( e ) {
            var node = e.target;
        },

        /**
        *
        *
        *
        */

        handleCalendarDayClick: function ( e ) {

            var node = e.target;

            var year  = parseInt( node.getAttribute( 'data-year' ), 10 );
            var month = parseInt( node.getAttribute( 'data-month' ), 10 );
            var day   = parseInt( node.getAttribute( 'data-day' ), 10 );

            this.__date__ = new Date( year, month, day );

            this.__node__.value = this.__date__.getDate() + '/' + ( this.__date__.getMonth() + 1 ) + '/' + this.__date__.getFullYear();

            this.hide();

        },

        /**
        *
        *
        */        

        build: function ( ) {

            this.__calendar__ = document.createElement( 'div' );
            this.__calendar__.setAttribute( 'class', this.__options__[ 'root-class' ] );
            this.__calendar__.setAttribute( 'id', this.__id__);

            document.body.appendChild( this.__calendar__ );

            this.render();        
        },

        /**
        *
        *
        *
        */
        
        render: function () {

            var calendarHeader = this.buildHeader();

            var calendarTable = '<table>';
            calendarTable += this.buildTableHead();
            calendarTable += this.buildTableBody();
            calendarTable += '</table>';

            this.__calendar__.innerHTML = calendarHeader + calendarTable;

        },        

        /**
        *
        *
        *
        */
        
        buildHeader: function () {
            var id = this.__id__;

            return new phi.dom.Template( Calendar.HEADER_TEMPLATE ).parse( {
                month: Calendar.MONTHS[ this.__date__.getMonth() ],
                year: this.__date__.getFullYear(),
                id: this.__id__
            } );

        },

        /**
        *
        * 
        *
        */
        
        buildTableHead: function () {

            var thead = '<thead><tr>';

            for (var i = 0; i < this.__options__[ 'days-in-week' ].length; i++ ) {
                thead += '<th><span>' + this.__options__[ 'days-in-week' ][ i ] + '</span></th>';
            }
            thead += '</tr></thead>';

            return thead;

        },

        /**
        *
        * 
        *
        */
        
        buildTableBody: function () {

            var daysInMonth = this.getNumberOfDaysInMonth( this.__date__ );
            var blankDays = daysInMonth % 7 + 1;

            var tbody = '<tbody>';

            for ( var i = 1; i <= daysInMonth; i++ ) {

                if( i % 7 === 1 ) {
                    tbody += '<tr>';
                }

                tbody += '<td><a href="#" ' +
                         'data-day="'    + i + '"' + 
                         'data-month="'  + this.__date__.getMonth() + '"' + 
                         'data-year="'   + this.__date__.getFullYear() + '"' + 
                         'rel="calendar' + this.__id__ + '-date">' 
                         + i + '</a></td>';


                if( i % 7 === 0) {
                    tbody += '</tr>';
                }

            }

            if ( /\/tr>$/.test( tbody ) === false ) {
                tbody += this.appendBlankDays( blankDays );
                tbody += '</tr>';
            }

            tbody += '<tbody>';

            return tbody;
        },

        /**
        *
        *
        *
        */
        
        appendBlankDays: function ( days ) {
            
            var html = '';

            for (var i = 1; i <= days; i++) {
                html += '<td>&nbsp;</td>';
            }

            return html;
        },

        

        /**
         *
         * Handle input focus
         *
         */

        handleFocus: function( e ) {

            this.show();
            // this.dispatchEvent( { type : 'inputfocus', explicitOriginalTarget : e.target } );
        },

        /**
        *
        * Handle input blur
        *
        */
        
        handleBlur: function ( e ) {
            // this.dispatchEvent( { type : 'inputblur',  explicitOriginalTarget : e.target } );
        },

        /**
        *
        *
        *
        */
        
        getNumberOfDaysInMonth: function ( date ) {

            var date = new Date( date.getTime() );

            date.setMonth( date.getMonth() + 1);
            return (new Date( date.getFullYear(), date.getMonth(), 0 ) ).getDate();
        },

        /**
        *
        *
        *
        */

        show: function () {
            this.__calendar__.setAttribute('class', this.__calendar__.getAttribute('class').replace(' active', '') + ' active');
        },

        /**
        *
        *
        *
        */
        
        hide: function () {
            this.__calendar__.setAttribute('class', this.__calendar__.getAttribute('class').replace(' active', ''));
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

    Calendar.HEADER_TEMPLATE = '<div><a href="#" rel="calendar{{id}}-prev" class="calendar-header-prev"> < </a><span class="calendar-header-month">{{month}}</span> <span class="calendar-header-year">{{year}}</span><a href="#" rel="calendar{{id}}-next" class="calendar-header-next"> > </a></div>'
    Calendar.MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    Calendar.DEFAULTS = {
        'id'           : undefined,
        'root-class'   : 'calendar',
        'days-in-week' : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        'first-day'    : 7, // Start with Sunday
        'date'         : new Date()
    };
    
    
})( phi, phi.dom );
