$(document).ready(function(){
 $('#event-form').vueventPublisher({
	clientID: 'goZiKiOctfkeBMbZgSN@uZuSY063VYqgU!iuVQXT',
	redirectURI: 'http://127.0.0.1:8322',
	fields:{
		title: '#eventTitle',
		description: '#eventDescription',
		startTime: '#startDate',
		endTime: '#endDate',
		shortDescription: '#shortDescription',
		extendedDescription: '#eventDescription',
		location: '#eventLocation'
		}
	});
});