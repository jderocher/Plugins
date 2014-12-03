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

1) Goto: https://www.vuevent.com
	
![Alt text](https://raw.github.com/jderocher/Plugins/master/screenshots/registration-step-1.png "Business Account Registration Step 1.")

2) Choose to sign up for a business account:

![Alt text](https://raw.github.com/jderocher/Plugins/master/screenshots/registration-step-2.png "Business Account Registration Step 2.")

3) Enter your business information and register:

![Alt text](https://raw.github.com/jderocher/Plugins/master/screenshots/registration-step-3.png "Business Account Registration Step 3.")

4) You are done! Now, the dilligent Vuevent Team will verify and enable your account shortly !

![Alt text](https://raw.github.com/jderocher/Plugins/master/screenshots/registration-step-4.png "Business Account Registration Step 4.")
 

### Create an OAUTH2 application.

After successful, verification you are ready to create your very own Vuevent OAUTH2 application:

1) Login to Vuevent:

![Alt text](https://raw.github.com/jderocher/Plugins/master/screenshots/application-setup-step-1.png "OAUTH2 Application Setup Step 1.")
![Alt text](https://raw.github.com/jderocher/Plugins/master/screenshots/application-setup-step-2.png "OAUTH2 Application Setup Step 2.")

2) After a successful login, redirect your browser using the link

	https://www.vuevent.com/o/applications
	
3) Click 'New Application' to create your application:

![Alt text](https://raw.github.com/jderocher/Plugins/master/screenshots/application-setup-step-3.png "OAUTH2 Application Setup Step 3.")

4) Enter required information about your application and save:

![Alt text](https://raw.github.com/jderocher/Plugins/master/screenshots/application-setup-step-4.png "OAUTH2 Application Setup Step 4.")

5) This page will tell you that your application has been saved. You can then click edit to change information in your application:

	#### IMPORTANT: Note down CLIENT ID and the approved URL's from the screen below, we will need this later :-)

![Alt text](https://raw.github.com/jderocher/Plugins/master/screenshots/application-setup-step-5.png "OAUTH2 Application Setup Step 5.")

6) Last Step: This window will show a list of all the applications created by you:

![Alt text](https://raw.github.com/jderocher/Plugins/master/screenshots/application-setup-step-6.png "OAUTH2 Application Setup Step 6.")



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



	
		
