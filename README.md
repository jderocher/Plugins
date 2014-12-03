# Vuevent 'Event' Publisher

This plugin is to be used by registered Vuevent businesses to publish their events on Vuevent via their own website. It aims to be a simple dropin on your event creation page, where it will be configured to capture event data from your web form. This captured data can then be published onto Vuevent with a click of a button.

## 5 Step Summary:

1. Signup for business account on Vuevent.
2. Create an OAUTH2 application.
3. Download the plugin.
4. Configure the plugin.
5. Use the plugin.

## Getting Started

### Signup for business account on Vuevent

The first step is to sign up for a Business Account with Vuevent (its free !!):

	Goto: https://www.vuevent.com
	
![Alt text](https://raw.github.com/jderocher/master/Plugins/screenshots/registration-step-1.png "Business Account Registration Step 1.")

1. Signup for business account on Vuevent: 
	
	https://www.vuevent.com
	
2. Create a publishing application for your business or organization: 
	
	https://www.vuevent.com/o/applications
	
3. *Add more steps here later *

4. Note down your client id

5. ...and we are done !


### Plugin usage

1. Requirements:
	
		```html
			<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
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



	
		
