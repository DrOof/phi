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
            this.__selectedDate__ = this.__options__['date'];
            this.__activeDate__ = new Date( this.__selectedDate__.getTime() );
            this.__currentDate__ = new Date( );

            this.__templates__ = {
                head          : new phi.dom.Template( Calendar.TEMPLATES.HEAD ),
                day           : new phi.dom.Template( Calendar.TEMPLATES.DAY ),
                headerDay     : new phi.dom.Template( Calendar.TEMPLATES.HEADER_DAY ),
                select        : new phi.dom.Template( Calendar.TEMPLATES.SELECT ),
                selectOption  : new phi.dom.Template( Calendar.TEMPLATES.SELECT_OPTION )
            };

            this.setInputDate( this.__selectedDate__ );
            this.build( );

            this.__linkRelations__  = new phi.dom.LinkRelations( /calendar/ , this.__calendar__ );
            this.__fieldRelations__ = new phi.dom.FieldRelations( /calendar/ , this.__calendar__ );
            
            this.createEventListeners( );

        },

        /**
        *
        *
        **/
        
        createEventListeners: function ( ) {

            this.__node__.addEventListener( 'focus', this.handleFocus.bind( this ), true );
            this.__node__.addEventListener( 'blur',  this.handleBlur.bind( this ),  true );
            this.__node__.addEventListener( 'keydown',  this.handleKeyDown.bind( this ),  true );

            this.__linkRelations__.add('prev', this.handleCalendarPrevClick.bind( this ) );
            this.__linkRelations__.add('next', this.handleCalendarNextClick.bind( this ) );
            this.__linkRelations__.add('date', this.handleCalendarDayClick.bind( this ) );
            this.__linkRelations__.add('today', this.handleCalendarTodayClick.bind( this ) );
        
            this.__fieldRelations__.add('year',  this.handleYearChange.bind( this ) );
            this.__fieldRelations__.add('month', this.handleMonthChange.bind( this ) );
        },


        /**
        *
        *
        *
        */

        handleYearChange: function ( e ) {

            var target = e.target;

            this.__activeDate__.setYear( target[ target.selectedIndex ].value );

            this.render();

        },


        /**
        *
        *
        *
        */

        handleMonthChange: function ( e ) {

            var target = e.target;

            this.__activeDate__.setMonth( target[ target.selectedIndex ].value );

            this.render();

        },

        /**
        *
        *
        *
        */

        handleCalendarPrevClick: function ( e ) {

            this.__activeDate__.setMonth( this.__activeDate__.getMonth() - 1 );

            this.render();

        },

        /**
        *
        *
        *
        */

        handleCalendarNextClick: function ( e ) {
            
            this.__activeDate__.setMonth( this.__activeDate__.getMonth() + 1 );

            this.render();

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

            this.__selectedDate__ = new Date( year, month, day );

            this.setInputDate( this.__selectedDate__ ); 

            this.render();
            this.hide();

        },

        /**
        *
        *
        *
        */

        handleCalendarTodayClick: function ( e ) {

           
            this.__selectedDate__ = new Date( );
            this.__activeDate__   = new Date( );

            this.setInputDate( this.__selectedDate__ ); 

            this.render();
            this.hide();

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
        * Handle input keydown
        *
        */
        
        handleKeyDown: function ( e ) {

            e.preventDefault();

            if( e.which ===  Calendar.KEY_CODE.LEFT ) {
                this.prevDay();
            }

            if( e.which ===  Calendar.KEY_CODE.RIGHT ) {
                this.nextDay();
            }

            if( e.which ===  Calendar.KEY_CODE.UP ) {
                this.nextMonth();
            }

            if( e.which ===  Calendar.KEY_CODE.DOWN ) {
                this.prevMonth();
            }

        },

        /**
        *
        *
        *
        */

        prevDay: function ( ) {

            this.__selectedDate__.setDate( this.__selectedDate__.getDate() - 1 );
            this.__activeDate__ = new Date( this.__selectedDate__.getFullYear(), this.__selectedDate__.getMonth(), 1 );
            this.setInputDate( this.__selectedDate__ );

            this.render();
            
        },


        /**
        *
        *
        *
        */
        
        nextDay: function ( ) {

            this.__selectedDate__.setDate( this.__selectedDate__.getDate() + 1 );
            this.__activeDate__ = new Date( this.__selectedDate__.getFullYear(), this.__selectedDate__.getMonth(), 1 );
            this.setInputDate( this.__selectedDate__ );

            this.render();

        },
        /**
        *
        *
        *
        */

        prevMonth: function ( ) {

            this.__activeDate__.setMonth( this.__activeDate__.getMonth() - 1 );
            this.render();
        },


        /**
        *
        *
        *
        */
        
        nextMonth: function ( ) {

            this.__activeDate__.setMonth( this.__activeDate__.getMonth() + 1 );
            this.render();

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

            var head = this.buildHead(),
                body = this.buildBody();

            this.__calendar__.innerHTML = head + body;

        },        

        /**
        *
        *
        *
        */
        
        buildHead: function () {

            var i, months = '', monthsSelect = '', years = '', yearsSelect = '';

            // Create Months select
            for ( i = 0; i < Calendar.MONTHS.length; i++ ) {

                months += this.__templates__.selectOption.parse( {
                    value    : i,
                    selected : this.__activeDate__.getMonth() === i ? 'selected="selected"' : '',
                    text     : Calendar.MONTHS[ i ]
                } );
            }

            monthsSelect = this.__templates__.select.parse( {
                class    : 'calendar-head-month calendar-head-select',
                options  : months,
                relation : 'month' 
            } );

            // Create Years select
            for ( i = this.__activeDate__.getFullYear() - 30; i <= this.__activeDate__.getFullYear() + 30; i++ ) {

                years += this.__templates__.selectOption.parse( {
                    value    : i,
                    selected : this.__activeDate__.getFullYear() === i ? 'selected="selected"' : '',
                    text     : i
                } );
            }

            yearsSelect = this.__templates__.select.parse( {
                class    : 'calendar-head-year calendar-head-select',
                options  : years,
                relation : 'year'
            } );


            // Return rendered head
            return this.__templates__.head.parse( {
                month: monthsSelect,
                year: yearsSelect
            } );

        },


        /**
        *
        * 
        *
        */
        
        buildBody: function () {

            var i, firstDay, daysInMonth, clazz, header = '', body = '', footer = '',
                date = new Date(this.__activeDate__.getTime());

            // Get the first day of the month            
            date.setDate(1);
            firstDay = date.getDay() === 0 ? 7 : date.getDay();
            firstDay = ( 7 - this.__options__['first-day'] + firstDay ) % 7;

            // Calendar header
            for ( i = 0; i < this.__options__[ 'days-in-week' ].length; i++ ) {

                header += this.__templates__.headerDay.parse( {
                    day: this.__options__[ 'days-in-week' ][ i ]
                } );
            
            }

            header = '<div class="calendar-header">' + header + '</div>';


            // Calendar body
            daysInMonth = this.getNumberOfDaysInMonth( this.__activeDate__ );

            // Empty days
            for( i = 0 ; i < firstDay; i++ ) {
                body += Calendar.TEMPLATES.DAY_EMPTY;
            }

            // Days
            for ( i = 1; i <= daysInMonth; i++ ) {

                clazz = this.isSelectedDate( new Date( this.__activeDate__.getFullYear(), this.__activeDate__.getMonth(), i ) ) ? 'active' : '';
                clazz += this.isCurrentDate( new Date( this.__activeDate__.getFullYear(), this.__activeDate__.getMonth(), i ) ) ? ' current' : '';
                body += this.__templates__.day.parse({ 
                            year  : this.__activeDate__.getFullYear(),
                            month : this.__activeDate__.getMonth(),
                            day   : i,
                            class : clazz
                        });

            }

            body = '<div class="calendar-body"><ul class="calendar-day-list">' + body + '</ul></div>';

            // Calendar footer
            footer = Calendar.TEMPLATES.FOOTER

            return header + body + footer;
        },

        /**
        *
        *
        *
        */
        
        setInputDate: function ( date ) {

            this.__node__.value = date.getDate() + '/' + ( date.getMonth() + 1 ) + '/' + date.getFullYear();

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

        isSelectedDate: function ( date ) {
            
            return this.__selectedDate__.getFullYear() === date.getFullYear() &&
                   this.__selectedDate__.getMonth()    === date.getMonth() &&
                   this.__selectedDate__.getDate()     === date.getDate();
        },
       

        /**
        *
        *
        *
        */

        isCurrentDate: function ( date ) {
            
            return this.__currentDate__.getFullYear() === date.getFullYear() &&
                   this.__currentDate__.getMonth()    === date.getMonth() &&
                   this.__currentDate__.getDate()     === date.getDate();
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

    Calendar.TEMPLATES = {
        HEAD          : '<div class="calendar-head"><a href="#" rel="calendar-prev" class="calendar-head-prev"> < </a> {{month}} {{year}} <a href="#" rel="calendar-next" class="calendar-head-next"> > </a></div>',
        HEADER_DAY    : '<span class="calendar-block calendar-header-item">{{day}}</span>',
        DAY           : '<li><a href="#" class="calendar-day {{class}}" data-day="{{day}}" data-month="{{month}}" data-year="{{year}}" rel="calendar-date">{{day}}</a></li>',
        DAY_EMPTY     : '<li><span class="calendar-block"></span></li>',
        SELECT        : '<select class="{{class}}" data-relation="calendar-{{relation}}">{{options}}</select>',
        SELECT_OPTION : '<option value="{{value}}" {{selected}}>{{text}}</option>',
        FOOTER        : '<div class="calendar-footer"><a href="#" class="calendar-footer-today" rel="calendar-today">Today</a></div>'

    };

    Calendar.MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    Calendar.DEFAULTS = {
        'id'           : undefined,
        'root-class'   : 'calendar',
        'days-in-week' : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        'first-day'    : 1, // Start with Sunday
        'date'         : new Date( )
    };
    
    
})( phi, phi.dom );
