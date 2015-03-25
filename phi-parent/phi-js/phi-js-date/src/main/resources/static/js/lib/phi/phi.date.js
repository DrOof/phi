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

    /*
     *
     * This Calendar class
     * @class
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
            
            // The date that is selected when 'Select' button is clicked
            this.__date__ = this.isDate( this.__options__['date'] ) ? this.__options__['date'] : null;

            // The date to store the clicked day
            this.__selected_date__ = ( this.__date__ !== null ) ? new Date( this.__date__.getTime() ) : null;
            
            // The active month in the calendar
            this.__active_date__ = ( this.__date__ !== null ) ? new Date( this.__date__.getTime() ) : new Date();

            // Today's date
            this.__current_date__ = new Date( );

            this.__templates__ = {
                head          : new phi.dom.Template( Calendar.HEAD_TEMPLATE ),
                day           : new phi.dom.Template( Calendar.DAY_TEMPLATE ),
                dayOtherMonth : new phi.dom.Template( Calendar.DAY_OTHER_MONTH_TEMPLATE ),
                headerDay     : new phi.dom.Template( Calendar.HEADER_DAY_TEMPLATE ),
                select        : new phi.dom.Template( Calendar.SELECT_TEMPLATE ),
                selectOption  : new phi.dom.Template( Calendar.SELECT_OPTION_TEMPLATE )
            };

            // this.setInputDate( this.__selected_date__ );
            this.build( );

            this.__linkRelations__  = new phi.dom.LinkRelations( /calendar/ , this.__calendar__ );
            this.__fieldRelations__ = new phi.dom.FieldRelations( /calendar/ , this.__calendar__ );
            
            this.createEventListeners( );

        },

        /**
        * @method createEventListeners
        * 
        * @description
        * Add events to the calendar component
        */
        createEventListeners: function ( ) {

            this.__linkRelations__.add('prev', this.handleCalendarPrevClick.bind( this ) );
            this.__linkRelations__.add('next', this.handleCalendarNextClick.bind( this ) );
            this.__linkRelations__.add('date', this.handleCalendarDayClick.bind( this ) );
            this.__linkRelations__.add('dateOffset', this.handleCalendarDayOffsetClick.bind( this ) );
            this.__linkRelations__.add('today', this.handleCalendarTodayClick.bind( this ) );
            this.__linkRelations__.add('submit', this.handleCalendarSubmitClick.bind( this ) );
            this.__linkRelations__.add('cancel', this.handleCalendarCancelClick.bind( this ) );
            this.__linkRelations__.add('clear', this.handleCalendarClearClick.bind( this ) );
        
            this.__fieldRelations__.add('year',  this.handleYearChange.bind( this ) );
            this.__fieldRelations__.add('month', this.handleMonthChange.bind( this ) );
        },

        /**
        * @method handleYearChange
        * @param {object} e - Event object
        *
        * @description
        * Handles the Year change event
        */
        handleYearChange: function ( e ) {

            var target = e.target;

            this.__active_date__.setYear( target[ target.selectedIndex ].value );

            this.render();

        },

        /**
        * @method handleMonthChange
        * @param {object} e - Event object
        *
        * @description
        * Handles the Month change event
        */
        handleMonthChange: function ( e ) {

            var target = e.target;

            this.__active_date__.setMonth( target[ target.selectedIndex ].value );

            this.render();

        },

        /**
        * @method handleCalendarPrevClick
        * @param {object} e - Event object
        *
        * @description
        * Handles click of the previous button
        */
        handleCalendarPrevClick: function ( e ) {

            this.__active_date__.setMonth( this.__active_date__.getMonth() - 1 );

            this.render();

        },

        /**
        * @method handleCalendarNextClick
        * @param {object} e - Event object
        *
        * @description
        * Handles click of the next button
        */
        handleCalendarNextClick: function ( e ) {
            
            this.__active_date__.setMonth( this.__active_date__.getMonth() + 1 );

            this.render();

        },

        /**
        * @method handleCalendarDayClick
        * @param {object} e - Event object
        *
        * @description
        * Handles click of the day
        */
        handleCalendarDayClick: function ( e ) {

            var node = e.target;

            var year  = parseInt( node.getAttribute( 'data-year' ), 10 );
            var month = parseInt( node.getAttribute( 'data-month' ), 10 );
            var day   = parseInt( node.getAttribute( 'data-day' ), 10 );

            this.__selected_date__ = new Date( year, month, day );

            if( this.isFunction ( this.__options__['date-select'] )) {
                this.__options__['date-select']( this.__selected_date__ );
            }

            this.render();

        },

        /**
        * @method handleCalendarDayOffsetClick
        * @param {object} e - Event object
        *
        * @description
        * Handles click of the day that is not in the current month in view
        */        
        handleCalendarDayOffsetClick: function ( e ) {

            var node = e.target;

            var year  = parseInt( node.getAttribute( 'data-year' ), 10 );
            var month = parseInt( node.getAttribute( 'data-month' ), 10 );
            var day   = parseInt( node.getAttribute( 'data-day' ), 10 );

            this.__selected_date__ = new Date( year, month, day );

            this.render();
        },

        /**
        * @method handleCalendarTodayClick
        * @param {object} e - Event object
        *
        * @description
        * Handles click of Today button
        */ 
        handleCalendarTodayClick: function ( e ) {
           
            this.__selected_date__ = new Date( );
            this.__active_date__   = new Date( );

            this.render();
        },

        /**
        * @method handleCalendarSubmitClick
        * @param {object} e - Event object
        *
        * @description
        * Handles click of Select button
        */ 
        handleCalendarSubmitClick: function ( e ) {

            this.__date__ = this.isDate( this.__selected_date__ ) ? new Date( this.__selected_date__.getTime() ) : null;

            if( this.isFunction ( this.__options__['date-submit'] )) {
                this.__options__['date-submit']( this.__date__ );
            }

            if( this.isDate( this.__date__ ) ) {
                this.__active_date__ = new Date( this.__date__.getTime() );
                this.render();
            }

        },

        /**
        * @method handleCalendarCancelClick
        * @param {object} e - Event object
        *
        * @description
        * Handles click of Cancel button
        */ 
        handleCalendarCancelClick: function ( e ) {
            
            this.__selected_date__ = this.isDate( this.__date__ ) ? new Date( this.__date__.getTime() ) : null;

            if( this.isFunction ( this.__options__['date-cancel'] )) {
                this.__options__['date-cancel']( this.__selected_date__ );
            }

            this.render();
        },

        /**
        * @method handleCalendarClearClick
        * @param {object} e - Event object
        *
        * @description
        * Handles click of Clear button
        */ 
        handleCalendarClearClick: function ( e ) {

            this.__date__ = null;
            this.__selected_date__ = null;
            this.__active_date__   = new Date( );

            if( this.isFunction ( this.__options__['date-clear'] )) {
                this.__options__['date-clear']( );
            }

            this.render();
        },


        /**
        *
        * Handle input keydown
        *
        */
        
        // handleKeyDown: function ( e ) {

        //     e.preventDefault();

        //     if( e.which ===  Calendar.KEY_CODE.LEFT ) {
        //         this.prevDay();
        //     }

        //     if( e.which ===  Calendar.KEY_CODE.RIGHT ) {
        //         this.nextDay();
        //     }

        //     if( e.which ===  Calendar.KEY_CODE.UP ) {
        //         this.nextMonth();
        //     }

        //     if( e.which ===  Calendar.KEY_CODE.DOWN ) {
        //         this.prevMonth();
        //     }

        // },

        /**
        * @method prevDay
        *
        * @description
        * Method for moving to the previous day
        */
        prevDay: function ( ) {

            this.__selected_date__.setDate( this.__selected_date__.getDate() - 1 );
            this.__active_date__ = new Date( this.__selected_date__.getFullYear(), this.__selected_date__.getMonth(), 1 );

            this.render();
            
        },


        /**
        * @method nextDay
        *
        * @description
        * Method for moving to the next day
        */
        nextDay: function ( ) {

            this.__selected_date__.setDate( this.__selected_date__.getDate() + 1 );
            this.__active_date__ = new Date( this.__selected_date__.getFullYear(), this.__selected_date__.getMonth(), 1 );

            this.render();

        },

        /**
        * @method prevMonth
        *
        * @description
        * Method for moving to the previous month
        */
        prevMonth: function ( ) {

            this.__active_date__.setMonth( this.__active_date__.getMonth() - 1 );
            this.render();
        },


        /**
        * @method nextMonth
        *
        * @description
        * Method for moving to the next month
        */
        nextMonth: function ( ) {

            this.__active_date__.setMonth( this.__active_date__.getMonth() + 1 );
            this.render();

        },

        /**
        * @method build
        *
        * @description
        * Method for building the calendar component
        */        
        build: function ( ) {

            this.__calendar__ = document.createElement( 'div' );
            this.__calendar__.setAttribute( 'class', this.__options__[ 'root-class' ] );
            this.__calendar__.setAttribute( 'id', this.__id__);

            this.__node__.appendChild( this.__calendar__ );

            this.render();        
        },

        /**
        * @method render
        *
        * @description
        * Method for rendering the calendar component
        */   
        render: function () {

            var head = this.buildHead(),
                body = this.buildBody();

            this.__calendar__.innerHTML = head + body;

        },        

        /**
        * @method buildHead
        *
        * @description
        * Method for building the head of the calendar component
        *
        * @return {String}
        */  
        buildHead: function () {

            var i, months = '', monthsSelect = '', years = '', yearsSelect = '';

            // Create Months select
            for ( i = 0; i < Calendar.MONTHS.length; i++ ) {

                months += this.__templates__.selectOption.parse( {
                    value    : i,
                    selected : this.__active_date__.getMonth() === i ? 'selected="selected"' : '',
                    text     : Calendar.MONTHS[ i ]
                } );
            }

            monthsSelect = this.__templates__.select.parse( {
                class    : 'calendar-head-month calendar-head-select',
                options  : months,
                relation : 'month' 
            } );

            // Create Years select
            for ( i = this.__active_date__.getFullYear() - 30; i <= this.__active_date__.getFullYear() + 30; i++ ) {

                years += this.__templates__.selectOption.parse( {
                    value    : i,
                    selected : this.__active_date__.getFullYear() === i ? 'selected="selected"' : '',
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
        * @method buildBody
        *
        * @description
        * Method for building the body of the calendar component
        *
        * @return {String} 
        */ 
        buildBody: function () {

            var i, dayOffset, daysInMonth, clazz, header = '', body = '', footer = '',
                previousMonth = new Date( this.__active_date__.getFullYear(), this.__active_date__.getMonth() - 1, 1 ),
                nextMonth = new Date( this.__active_date__.getFullYear(), this.__active_date__.getMonth() + 1, 1 ),
                date = new Date(this.__active_date__.getTime());

            // Get the first day of the month            
            date.setDate(1);
            dayOffset = date.getDay() === 0 ? 7 : date.getDay();
            dayOffset = ( 7 - this.__options__['first-day'] + dayOffset ) % 7;

            // Calendar header
            for ( i = 0; i < this.__options__[ 'days-in-week' ].length; i++ ) {

                header += this.__templates__.headerDay.parse( {
                    day: this.__options__[ 'days-in-week' ][ i ]
                } );
            
            }

            header = '<div class="calendar-header">' + header + '</div>';

            // Calendar body
            daysInMonth = this.getNumberOfDaysInMonth( new Date( this.__active_date__ ) );
            daysInPrevMonth = this.getNumberOfDaysInMonth( previousMonth )
            daysInNextMonth = 7 - ( ( daysInMonth + dayOffset) % 7 );

            // Prev Month days
            for( i = daysInPrevMonth - ( dayOffset || 7 ) + 1 ; i <= daysInPrevMonth; i++ ) {
                body += this.__templates__.dayOtherMonth.parse({ 
                            year  : previousMonth.getFullYear(),
                            month : previousMonth.getMonth(),
                            day   : i,
                            class : ''
                        });
            }

            // Days
            for ( i = 1; i <= daysInMonth; i++ ) {

                clazz = this.isSelectedDate( new Date( this.__active_date__.getFullYear(), this.__active_date__.getMonth(), i ) ) ? 'active' : '';
                clazz += this.isCurrentDate( new Date( this.__active_date__.getFullYear(), this.__active_date__.getMonth(), i ) ) ? ' current' : '';
                body += this.__templates__.day.parse({ 
                            year  : this.__active_date__.getFullYear(),
                            month : this.__active_date__.getMonth(),
                            day   : i,
                            class : clazz
                        });

            }

            // Next Month days
            for( i = 1 ; i <= daysInNextMonth; i++ ) {
                body += this.__templates__.dayOtherMonth.parse({ 
                            year  : nextMonth.getFullYear(),
                            month : nextMonth.getMonth(),
                            day   : i,
                            class : ''
                        });
            }

            body = '<div class="calendar-body"><ul class="calendar-day-list">' + body + '</ul></div>';

            // Calendar footer
            footer = Calendar.FOOTER_TEMPLATE

            return header + body + footer;
        },

     

        /**
        * @method getNumberOfDaysInMonth
        * @param {Date} date - The date for the month which numbers are calculated
        *
        * @description
        * Method for retrieving the number of days in a month
        *
        * @return {Date}
        */
        getNumberOfDaysInMonth: function ( date ) {

            if( ! this.isDate( date )) {
                throw 'The variable is not Date';
            }

            var date = new Date( date.getTime() );

            date.setMonth( date.getMonth() + 1);
            return (new Date( date.getFullYear(), date.getMonth(), 0 ) ).getDate();
        },

        /**
        * @method isSelectedDate
        * @param {Date} date
        *
        * @description 
        * Method for determing if the date passed is the selected date
        *
        * @return {Boolean}
        */
        isSelectedDate: function ( date ) {
            
            return this.isDate(this.__selected_date__) &&
                   this.__selected_date__.getFullYear() === date.getFullYear() &&
                   this.__selected_date__.getMonth()    === date.getMonth() &&
                   this.__selected_date__.getDate()     === date.getDate();
        },

        /**
        * @method isCurrentDate
        * @param {Date} date
        *
        * @description 
        * Method for determing if the date passed is the current date
        *
        * @return {Boolean}
        */
        isCurrentDate: function ( date ) {
            
            return this.isDate( date ) &&
                   this.__current_date__.getFullYear() === date.getFullYear() &&
                   this.__current_date__.getMonth()    === date.getMonth() &&
                   this.__current_date__.getDate()     === date.getDate();
        },

        /**
        * @method isDate
        * @param {*} value
        *
        * @description 
        * Method for determing if the variable passed is date
        *
        * @return {Boolean}
        */
        isDate: function ( value ) {
            return Object.prototype.toString.call( value ) === '[object Date]';
        },

        /**
        * @method isFunction
        * @param {*} value
        *
        * @description 
        * Method for determing if the variable passed is function
        *
        * @return {Boolean}
        */
        isFunction: function ( value ) {
            return typeof value === 'function';
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

    Calendar = {
        HEAD_TEMPLATE            : '<div class="calendar-head"><a href="javascript://" rel="calendar-prev" class="calendar-head-prev"> < </a> {{month}} {{year}} <a href="javascript://" rel="calendar-next" class="calendar-head-next"> > </a></div>',
        HEADER_DAY_TEMPLATE      : '<span class="calendar-header-day">{{day}}</span>',
        DAY_TEMPLATE             : '<li><a href="javascript://" class="calendar-day {{class}}" data-day="{{day}}" data-month="{{month}}" data-year="{{year}}" rel="calendar-date">{{day}}</a></li>',
        DAY_OTHER_MONTH_TEMPLATE : '<li><a href="javascript://" class="calendar-day-other {{class}}" data-day="{{day}}" data-month="{{month}}" data-year="{{year}}" rel="calendar-dateOffset">{{day}}</a></li>',
        SELECT_TEMPLATE          : '<select class="{{class}}" data-relation="calendar-{{relation}}">{{options}}</select>',
        SELECT_OPTION_TEMPLATE   : '<option value="{{value}}" {{selected}}>{{text}}</option>',
        FOOTER_TEMPLATE          : '<div class="calendar-footer"><a href="javascript://" class="calendar-footer-button" rel="calendar-submit">Submit</a>  <a href="javascript://" class="calendar-footer-button" rel="calendar-cancel">Cancel</a> <a href="javascript://" class="calendar-footer-button" rel="calendar-clear">Clear</a>  <a href="javascript://" class="calendar-footer-button" rel="calendar-today">Today</a></div>'

    };

    Calendar.MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    Calendar.DEFAULTS = {
        'id'           : undefined,
        'root-class'   : 'calendar',
        'days-in-week' : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        'first-day'    : 7, // Start with Sunday
        'date'         : undefined,
        'date-submit'  : undefined,
        'date-select'  : undefined,
        'date-clear'   : undefined,
        'date-cancel'  : undefined

    };
    
})( phi, phi.dom );
