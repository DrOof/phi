cal = new phi.date.Calendar(document.getElementById('calendar'), {
	'date-select': function ( date ) {
		console.log('select', date);
	},
	'date-submit': function ( date ) {
		console.log('submit', date);
	},
	'date-clear': function ( ) {
		console.log(clear);
	},
	'date-cancel': function ( date ) {
		console.log('cancel', date);
	}
});
var cal1 = new phi.date.Calendar(document.getElementById('calendar-2'), {});
