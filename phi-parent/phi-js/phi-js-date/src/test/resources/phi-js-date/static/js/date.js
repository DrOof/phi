var cal = new phi.date.Calendar(document.getElementById('calendar'), {} );
cal.addEventListener( 'dateselect', function( e ) { console.log( e.target.getActive() ) } );

var cal1 = new phi.date.Calendar(document.getElementById('calendar-2'), {} );
cal1.addEventListener( 'dateclear', function( e ) { console.log( e.target.getActive() ) } );
