( function( dom ) {
    
    phi.date = {};
    
    var Calendar = phi.date.Calendar = phi( {
        
        __init__ : function( node ) {
            
            this.node = dom( node );
            
            this.links = this.createLinkRelations( node );
            this.fields = this.createFieldRelations( node );
            
            this.originalTarget = this.node.find( '> input' )
            this.originalDate = this.resolveOriginalDate( this.originalTarget );
            
            this.date = this.originalDate;
            
            this.renderOpen();
            
        },
        
        createLinkRelations: function( node ) {
            
            var links = new phi.dom.LinkRelations( /calendar/, node );
            
            links.add( 'open', this.handleOpen.bind( this ) );
            links.add( 'close', this.handleClose.bind( this ) );
            
            links.add( 'up', this.handleUp.bind( this ) );
            links.add( 'down', this.handleDown.bind( this ) );
            links.add( 'restore', this.handleRestore.bind( this ) );
            
        },
        
        createFieldRelations: function( node ) {
            
            var fields = new phi.dom.FieldRelations( /calendar/, node );
            fields.add( 'change', this.handleChange.bind( this ) );
            
        },
        
        resolveOriginalDate: function( originalTarget ) {
            
            var date;
            
            if ( this.originalTarget.val() ) {
                date = new Date( Date.parse( originalTarget.val() ) );
            } else {
                date = new Date();
            }
            
            return date;
            
        },
        
        render: function( date ) {
            
            this.node.find( '.field-calendar' ).remove();
            
            this.originalTarget.val( this.toISO8601( date ) );
            this.node.append( this.renderCalendar( date ) );
            
        },
        
        renderOpen: function() {
            this.node.append( new phi.dom.Template( Calendar.OPEN ).parse() );
        },
        
        restore: function( date ) {
            this.date = date;
            this.render( this.date );
        },
        
        open: function( date ) {
            this.render( this.date );
        },
        
        close: function( date ) {
            this.node.find( '.field-calendar' ).remove();
        },
        
        addYear: function( amount ) {
            this.date = this.setYear( this.date.getFullYear() + amount );
            return this.date;
        },
        
        addMonth: function( amount ) {
            this.date = this.setMonth( this.date.getUTCMonth() + amount );
            return this.date;
        },
        
        addDay: function( amount ) {
            this.date = this.setDay( this.date.getDate() + amount );
            return this.date;
        },
        
        addHour: function( amount ) {
            this.date = this.setHour( this.date.getHours() + amount );
            return this.date;
        },
        
        addMinute: function( amount ) {
            this.date = this.setMinute( this.date.getMinutes() + amount );
            return this.date;
        },
        
        addSecond: function( amount ) {
            this.date = this.setSecond( this.date.getSeconds() + amount );
            return this.date;
        },
        
        setYear: function( amount ) {
            this.date = new Date( new Date( this.date ).setFullYear( amount ) );
            return this.date;
        },
        
        setMonth: function( amount ) {
            this.date = new Date( new Date( this.date ).setUTCMonth( amount ) );
            return this.date;
        },
        
        setDay: function( amount ) {
            this.date = new Date( new Date( this.date ).setDate( amount ) );
            return this.date;
        },
        
        setHour: function( amount ) {
            this.date = new Date( new Date( this.date ).setHours( amount ) );
            return this.date;
        },
        
        setMinute: function( amount ) {
            this.date = new Date( new Date( this.date ).setMinutes( amount ) );
            return this.date;
        },
        
        setSecond: function( amount ) {
            this.date = new Date( new Date( this.date ).setSeconds( amount ) );
            return this.date;
        },
        
        setTime: function( amount ) {
            
            var order = [ 'hour', 'minute', 'second' ];
            var hhmmss = /[0-9]{2}/g;
            
            var i = 0;
            var a = hhmmss.exec( amount );
            while ( a  ) {
                this.set( order[ i++ ], a );
                a = hhmmss.exec( amount );
            }
            
            return this.date;
                
        },
        
        capitalise: function( string ) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        
        add: function( unit, amount ) {
            
            this[ 'add' + this.capitalise( unit ) ]( amount );
            this.render( this.date );
            
        },
        
        set: function( unit, amount ) {
            
            this[ 'set' + this.capitalise( unit ) ]( amount );
            this.render( this.date );
            
        },
        
        resolveUnit: function( id ) {
            return /year|month|day|time|hour|minute|second/.exec( id )[0];
        },
        
        handleUp: function( e ) { e.preventDefault();
            var id = dom( e.target ).closest( 'a' ).attr( 'href' );
            var unit = this.resolveUnit( id ) ;
            this.add( ( unit == 'time' ) ? 'hour' : unit , 1 );
        },
        
        handleDown: function( e ) { e.preventDefault();
            var id = dom( e.target ).closest( 'a' ).attr( 'href' );
            var unit = this.resolveUnit( id ) ;
            this.add( ( unit == 'time' ) ? 'hour' : unit, -1 );
        },
        
        handleOpen: function( e ) { e.preventDefault();
            this.open();
        },
        
        handleClose: function( e ) { e.preventDefault();
            this.close();
        },
        
        handleRestore: function( e ) { e.preventDefault();
            this.restore( this.originalDate );
        },
        
        handleChange: function( e ) {
            var target = dom( e.target );
            this.set( target.attr( 'name' ), target.val() );
        },
        
        renderCalendar: function( date ) {
            
            var yyyy, MM, dd, HH, mm, ss;
            
            var yyyy = date.getFullYear(),
                  MM = date.getUTCMonth() + 1,
                  dd = date.getUTCDate(),
                  time = this.formatTime( date );
            
            var segments = [];
            segments.push( this.renderSegment( { uuid : phi.getUUID(), value : yyyy,    name : 'year'   } ) );
            segments.push( this.renderSegment( { uuid : phi.getUUID(), value : MM,      name : 'month'  } ) );
            segments.push( this.renderSegment( { uuid : phi.getUUID(), value : dd,      name : 'day'    } ) );
            segments.push( this.renderSegment( { uuid : phi.getUUID(), value : time,    name : 'time'   } ) );
            
            return new phi.dom.Template( Calendar.CALENDAR ).parse( { segments : segments.join('') } );
            
        },
        
        /**
         *
         * Formats time of a date to HH:mm:ss
         *
         */
        
        formatTime: function( d ) {
            return [ d.getHours(), d.getMinutes(), d.getSeconds() ].map( function( a, b ) { return a < 10 ? '0'+ a : a; } ).join( ':' );
        },
        
        /**
         *
         * Formats a date to yyyy-MM-dd
         *
         */
        
        formatDate: function( d ) {
            return [ d.getFullYear(), d.getUTCMonth() + 1, d.getUTCDate() ].map( function( a, b ) { return a < 10 ? '0'+ a : a; } ).join( '-'  );
        },
        
        formatZone: function( d ) {
            
            var h = ( d.getTimezoneOffset() / 60 );
            var s = ( h < 0 ) ? '+' : '-';
            h = Math.abs( h );
            h = ( h < 10 ) ? '0' + h : h;
            
            return s + h + '00';
            
        },
        
        renderSegment: function( segment ) {
            return new phi.dom.Template( Calendar.SEGMENT ).parse( segment );
        },
        
        renderDate: function( d ) {
            return new phi.dom.Template( Calendar.DATE ).parse( { date : this.formatDate( d ), time : this.formatTime( d ), Z : this.formatZone( d ) } );
        },
        
        /**
         *
         * Formats a date to ISO 8601
         *
         */ 
        
        toISO8601: function( d ) {
            return [ this.formatDate( d ), "T", this.formatTime( d ), this.formatZone( d ) ].join( '' );
        }
        
    } );
    
    Calendar.OPEN       =   '<a class="field-calendar-open" href="#" rel="calendar:open"><i class="fa fa-calendar"></i></a>';
    
    Calendar.CALENDAR   =   '<div class="field-calendar"><ul class="field-calendar-segments">{{segments}}<li><a class="field-calendar-restore" href="#" rel="calendar:restore"><i class="fa fa-undo"></i></a></li><li><a class="field-calendar-restore" href="#" rel="calendar:close"><i class="fa fa-check"></i></a></li></ul></div>';
    
    Calendar.SEGMENT    =   '<li>' +
                                '<div class="field-calendar-segment">' +
                                    '<input type="text" id="field-calendar-segment-{{name}}-{{uuid}}" name="{{name}}" value="{{value}}" data-relation="calendar:change" />' +
                                    '<ul class="field-calendar-segment-control-list">' +
                                        '<li>' +
                                            '<a class="field-calendar-segment-control" href="#field-calendar-segment-{{name}}-{{uuid}}" rel="calendar:up">' +
                                                '<i class="fa fa-caret-up"></i>' +
                                            '</a>' +
                                        '</li>' +
                                        '<li>' +
                                            '<a class="field-calendar-segment-control" href="#field-calendar-segment-{{name}}-{{uuid}}" rel="calendar:down">' +
                                                '<i class="fa fa-caret-down"></i>' +
                                            '</a>' +
                                        '</li>' +
                                    '<ul>' +
                                '</div>'
                            '</li>';
    
} )( phi.dom );