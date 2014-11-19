# Vuevent 'Event' Publisher

This plugins is to be used by registered businesses to publish their events on https://www.vuevents.com/ via their own website. It aims to be a simple dropin on your event page, where it will be configured to capture event data from your web form. The captured data can then be published onto Vuevent with a click of a button.

## Get Started

### Vuevent Account Setup

To use this plugin, you need to have an account and an application setup on Vuevent. Follow the steps below:

1. Signup for business account on Vuevent: 
	
	https://www.vuevent.com
	
2. Create an publishing application for your business: 
	
	https://www.vuevent.com/o/applications
	
3. *Add more steps here later *

4. Note down your client id

5. ...and we are done !


### Plugin usage

1. Requirements:

	a. JQuery:
		```html 
			<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
		``` 
		
	b. Vuevent Publisher Plugin
	
		```html 
			<script src="http://some_cdn/vuevent.publish.min.js"></script>
		``` 

2. Setup:

	```html 
	<script>
		$(document).ready(function(){
			
			 $('#event-form').vueventPublisher({
				clientID: 'your_client_id',
				redirectURI: 'your_redirect_uri',
				fields:{
					title: '#eventTitle',
					description: '#eventDescription',
					startDate: '#startdate',
					endDate: '#endDate',
					extendedDescription: '#eventDescription',
					location: '#eventLocation'
				}
			});
		});
	</script>
	```



	
		