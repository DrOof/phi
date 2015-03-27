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

            this.__options__['first-day']       = ( this.__options__['first-day'] < 1 || this.__options__['first-day'] > 7 ) ? 7 : this.__options__['first-day'];
            this.__options__['days-in-week']    = this.__options__['days-in-week'].slice( this.__options__['first-day'] - 1 ).concat( this.__options__['days-in-week'].slice( 0, this.__options__['first-day'] - 1 ) );

            // The date that is selected when 'Select' button is clicked
            this.__date__ = this.__options__[ 'date' ] ||  new Date();

            // The date to store the clicked day
            this.__active__ = this.__date__;

            // The active month in the calendar
            this.__start__ = this.__date__;

            this.__templates__ = {
                head          : new phi.dom.Template( Calendar.HEAD_TEMPLATE ),
                select        : new phi.dom.Template( Calendar.HEAD_SELECT_TEMPLATE ),
                selectOption  : new phi.dom.Template( Calendar.HEAD_SELECT_OPTION_TEMPLATE ),
                day           : new phi.dom.Template( Calendar.BODY_DAY_TEMPLATE ),
                dayOtherMonth : new phi.dom.Template( Calendar.BODY_OTHER_DAY_TEMPLATE ),
                headerDay     : new phi.dom.Template( Calendar.HEADER_DAY_TEMPLATE )
            };

            this.build();

            this.createEventListeners();

        },

        /**
        * @method createEventListeners
        * 
        * @description
        * Add events to the calendar component
        */
        createEventListeners: function ( ) {

            this.__links__  = new phi.dom.LinkRelations( /calendar/ , this.__node__ );

            this.__links__.add( 'prev', this.handlePreviousDateSelect.bind( this ) );
            this.__links__.add( 'next', this.handleNextDateSelect.bind( this ) );

            this.__links__.add( 'date', this.handleDateSelect.bind( this ) );
            this.__links__.add( 'today', this.handleTodaySelect.bind( this ) );

            this.__links__.add( 'cancel', this.handleCancel.bind( this ) );
            this.__links__.add( 'done', this.handleDone.bind( this ) );
            this.__links__.add( 'clear', this.handleClear.bind( this ) );

            this.__fields__ = new phi.dom.FieldRelations( /calendar/ , this.__node__ );
            this.__fields__.add( 'year',  this.handleYearChange.bind( this ) );
            this.__fields__.add( 'month', this.handleMonthChange.bind( this ) );

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
            this.__start__.setYear( target[ target.selectedIndex ].value );
            this.build();

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
            this.__start__.setMonth( target[ target.selectedIndex ].value );
            this.build();

        },

        /**
        * @method handlePreviousDateSelect
        * @param {object} e - Event object
        *
        * @description
        * Handles click of the previous button
        */
        handlePreviousDateSelect: function ( e ) {

            this.__start__.setMonth( this.__start__.getMonth() - 1 );
            this.build();

        },

        /**
        * @method handleNextDateSelect
        * @param {object} e - Event object
        *
        * @description
        * Handles click of the next button
        */
        handleNextDateSelect: function ( e ) {
            
            this.__start__.setMonth( this.__start__.getMonth() + 1 );
            this.build();

        },

        /**
        * @method handleDateSelect
        * @param {object} e - Event object
        *
        * @description
        * Handles click of the day
        */
        handleDateSelect: function ( e ) {

            var node = e.target;

            var year  = parseInt( node.getAttribute( 'data-year' ), 10 );
            var month = parseInt( node.getAttribute( 'data-month' ), 10 );
            var day   = parseInt( node.getAttribute( 'data-day' ), 10 );

            this.__active__ = new Date( year, month, day );
            this.__start__ = new Date( year, month, 1 );

            this.dispatchEvent( { type : 'dateselect', target : this } );
            this.build();

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

            this.__active__ = new Date( year, month, day );

            this.build();

        },

        /**
        * @method handleTodaySelect
        * @param {object} e - Event object
        *
        * @description
        * Handles click of Today button
        */ 
        handleTodaySelect: function ( e ) {
           
            this.__active__ = new Date();
            this.__start__ = new Date();

            this.dispatchEvent( { type : 'dateselect', target : this } );
            this.build();

        },

        /**
        * @method handleCancel
        * @param {object} e - Event object
        *
        * @description
        * Handles click of Cancel button
        */ 
        handleDone: function ( e ) {

            this.dispatchEvent( { type : 'dateselect', target : this } );
            this.build();

        },

        /**
        * @method handleCancel
        * @param {object} e - Event object
        *
        * @description
        * Handles click of Cancel button
        */ 
        handleCancel: function ( e ) {
            
            this.__active__ = this.__date__;
            this.dispatchEvent( { type : 'datecancel', target : this } );
            this.build();

        },

        /**
        * @method handleClear
        * @param {object} e - Event object
        *
        * @description
        * Handles click of Clear button
        */ 
        handleClear: function ( e ) {

            this.__active__ = null;
            this.__start__ = new Date();

            this.dispatchEvent( { type : 'dateclear', target : this } );
            this.build();

        },

        /**
        * @method prevDay
        *
        * @description
        * Method for moving to the previous day
        */
        prevDay: function ( ) {

            this.__active__.setDate( this.__active__.getDate() - 1 );
            this.__start__ = new Date( this.__active__.getFullYear(), this.__active__.getMonth(), 1 );

            this.build();
            
        },


        /**
        * @method nextDay
        *
        * @description
        * Method for moving to the next day
        */
        nextDay: function ( ) {

            this.__active__.setDate( this.__active__.getDate() + 1 );
            this.__start__ = new Date( this.__active__.getFullYear(), this.__active__.getMonth(), 1 );

            this.build();

        },

        /**
        * @method prevMonth
        *
        * @description
        * Method for moving to the previous month
        */
        prevMonth: function ( ) {

            this.__start__.setMonth( this.__start__.getMonth() - 1 );
            this.build();
        },


        /**
        * @method nextMonth
        *
        * @description
        * Method for moving to the next month
        */
        nextMonth: function ( ) {

            this.__start__.setMonth( this.__start__.getMonth() + 1 );
            this.build();

        },

        /**
        * @method build
        *
        * @description
        * Method for building the calendar component
        */        
        build: function () {
            this.__node__.innerHTML = this.render();
        },

        /**
        * @method render
        *
        * @description
        * Method for rendering the calendar component
        */   
        render: function ( canvas ) {
            return new phi.dom.Template( Calendar.ROOT_TEMPLATE ).parse( { head : this.renderHead(), body : this.renderBody() });
        },

        /**
        * @method renderHead
        *
        * @description
        * Method for building the head of the calendar component
        *
        * @return {String}
        */  
        renderHead: function () {

            var i, months = '', monthsSelect = '', years = '', yearsSelect = '';

            // Create Months select
            for ( i = 0; i < Calendar.MONTHS.length; i++ ) {

                months += this.__templates__.selectOption.parse( {
                    value    : i,
                    selected : this.__start__.getMonth() === i ? 'selected="selected"' : '',
                    text     : Calendar.MONTHS[ i ]
                } );
            }

            monthsSelect = this.__templates__.select.parse( {
                class    : 'calendar-head-month calendar-head-select',
                options  : months,
                relation : 'month' 
            } );

            // Create Years select
            for ( i = this.__start__.getFullYear() - 30; i <= this.__start__.getFullYear() + 30; i++ ) {

                years += this.__templates__.selectOption.parse( {
                    value    : i,
                    selected : this.__start__.getFullYear() === i ? 'selected="selected"' : '',
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
        * @method renderBody
        *
        * @description
        * Method for building the body of the calendar component
        *
        * @return {String} 
        */ 
        renderBody: function () {

            var i, dayOffset, daysInMonth, clazz, header = '', body = '', footer = '',
                daysRenderedInPrevMonth, daysInPrevMonth, daysInNextMonth, daysInMonth,
                previousMonth = new Date( this.__start__.getFullYear(), this.__start__.getMonth() - 1, 1 ),
                nextMonth = new Date( this.__start__.getFullYear(), this.__start__.getMonth() + 1, 1 ),
                date = new Date(this.__start__.getTime());

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

            header = new phi.dom.Template( Calendar.HEADER_TEMPLATE ).parse( { header : header } );

            // Calendar body
            daysInMonth = this.getNumberOfDaysInMonth( new Date( this.__start__ ) );
            daysInPrevMonth = this.getNumberOfDaysInMonth( previousMonth )
            daysRenderedInPrevMonth = daysInPrevMonth - (daysInPrevMonth - ( dayOffset || 7 ) );
            daysInNextMonth = 42 - ( daysInMonth + daysRenderedInPrevMonth); // 7 - ( ( daysInMonth + dayOffset) % 7 );

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

                clazz = this.isSelectedDate( new Date( this.__start__.getFullYear(), this.__start__.getMonth(), i ) ) ? 'active' : '';
                clazz += this.isCurrentDate( new Date( this.__start__.getFullYear(), this.__start__.getMonth(), i ) ) ? ' current' : '';
                body += this.__templates__.day.parse({ 
                            year  : this.__start__.getFullYear(),
                            month : this.__start__.getMonth(),
                            day   : i,
                            class : clazz
                        });

            }

            // Next Month days
            for ( i = 1 ; i <= daysInNextMonth; i++ ) {
                body += this.__templates__.dayOtherMonth.parse({ 
                            year  : nextMonth.getFullYear(),
                            month : nextMonth.getMonth(),
                            day   : i,
                            class : ''
                        });
            }

            body = new phi.dom.Template( Calendar.BODY_TEMPLATE ).parse( { body : body } );

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
            
            return this.isDate(this.__active__) &&
                   this.__active__.getFullYear() === date.getFullYear() &&
                   this.__active__.getMonth()    === date.getMonth() &&
                   this.__active__.getDate()     === date.getDate();
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

            var current = new Date();
            return this.isDate( date ) &&
                   current.getFullYear() === date.getFullYear() &&
                   current.getMonth()    === date.getMonth() &&
                   current.getDate()     === date.getDate();

        },
        
        getActive: function() {
            return this.__active__;
        },

        /**
        * @method getFormattedDate
        *
        * @description 
        * Method for retrieving the date in given format
        *
        * @return {String}
        */
        getFormattedActive: function( format ) {
            // take format from options
            return new phi.dom.DateFormat( this.__options__[ 'date-format' ] ).format( this.__active__ );
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
            return value instanceof Date;
        }

    } );

    Calendar.ROOT_TEMPLATE                  = '<div class="calendar">{{head}}{{body}}</div>';
    
    Calendar.HEAD_TEMPLATE                  = '<div class="calendar-head"><a href="#" rel="calendar-prev" class="calendar-head-prev"> < </a> {{month}} {{year}} <a href="#" rel="calendar-next" class="calendar-head-next"> > </a></div>';
    Calendar.HEAD_SELECT_TEMPLATE           = '<select class="{{class}}" data-relation="calendar-{{relation}}">{{options}}</select>';
    Calendar.HEAD_SELECT_OPTION_TEMPLATE    = '<option value="{{value}}" {{selected}}>{{text}}</option>';
    
    Calendar.HEADER_TEMPLATE                = '<div class="calendar-header"><ul class="calendar-day-list">{{header}}</ul></div>'
    Calendar.HEADER_DAY_TEMPLATE            = '<li><span class="calendar-day">{{day}}</span></li>';
    
    Calendar.BODY_TEMPLATE                  = '<div class="calendar-body"><ul class="calendar-day-list">{{body}}</ul></div>';
    Calendar.BODY_DAY_TEMPLATE              = '<li><a href="#" class="calendar-day {{class}}" data-day="{{day}}" data-month="{{month}}" data-year="{{year}}" rel="calendar-date">{{day}}</a></li>';
    Calendar.BODY_OTHER_DAY_TEMPLATE        = '<li><a href="#" class="calendar-day-other {{class}}" data-day="{{day}}" data-month="{{month}}" data-year="{{year}}" rel="calendar-date">{{day}}</a></li>';
    
    Calendar.FOOTER_TEMPLATE                = '<div class="calendar-footer"><ul class="calendar-footer-action-list"><li><a href="#" class="calendar-footer-button" rel="calendar-clear">Clear</a></li><li><a href="#" class="calendar-footer-button" rel="calendar-today">Today</a></li><li><a href="#" class="calendar-footer-button" rel="calendar-done">Done</a></li></ul></div>';

    Calendar.MONTHS                         = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    Calendar.DEFAULTS                       = {
        'date-format'  : 'YYYY-MM-DDThh:mm:ssZ',
        'days-in-week' : [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ],
        'first-day'    : 7, // Start with Sunday
        'date'         : undefined
    };

})( phi, phi.dom );
