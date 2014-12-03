$(document).ready(function(){
 $('#event-form').vueventPublisher({
	clientID: 'VrE8FpV3r8tjq6HD7CRJ9C1JKLfJ!jz7By3O5?iq',
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