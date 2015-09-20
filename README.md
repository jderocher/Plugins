# Vuevent 'Event' Publisher Plugin

This plugin is to be used by registered Vuevent businesses to publish their events on Vuevent via their own website. It aims to be a simple dropin on your event creation page, where it will be configured to capture event data from your web form. This captured data can then be published onto Vuevent with a click of a button.

## 5 Step Summary:

1. Signup for business account on Vuevent.
2. Create an OAUTH2 application.
3. Download the plugin.
4. Configure the plugin.
5. Use the plugin.

## Getting Started

### Signup for a business account on Vuevent

The first step is to sign up for a Business Account with Vuevent (it's free!):

1) Go to: https://www.vuevent.com
    
![Business Account Registration Step 1.](https://raw.githubusercontent.com/jderocher/Plugins/master/screenshots/registration-step-1.png)

2) Choose to sign up for a business account:

![Business Account Registration Step 2.](https://raw.githubusercontent.com/jderocher/Plugins/master/screenshots/registration-step-2.png)

3) Enter your business information and register:

![Business Account Registration Step 3.](https://raw.githubusercontent.com/jderocher/Plugins/master/screenshots/registration-step-3.png)

4) You are done! Now, the dilligent Vuevent team will verify and enable your account shortly!

![Business Account Registration Step 4.](https://raw.githubusercontent.com/jderocher/Plugins/master/screenshots/registration-step-4.png)
 

### Create an OAUTH2 application.

After successful verification, you are ready to create your very own Vuevent OAUTH2 application:

1) Login to Vuevent:

![OAUTH2 Application Setup Step 1.](https://raw.githubusercontent.com/jderocher/Plugins/master/screenshots/application-setup-step-1.png)
![OAUTH2 Application Setup Step 2.](https://raw.githubusercontent.com/jderocher/Plugins/master/screenshots/application-setup-step-2.png)

2) After a successful login, redirect your browser using the link:

https://www.vuevent.com/o/applications/
    
3) Click 'New Application' to create your application:

![OAUTH2 Application Setup Step 3.](https://raw.githubusercontent.com/jderocher/Plugins/master/screenshots/application-setup-step-3.png)

4) Enter required information about your application and save:

![OAUTH2 Application Setup Step 4.](https://raw.githubusercontent.com/jderocher/Plugins/master/screenshots/application-setup-step-4.png)

5) This page will tell you that your application has been saved. You can then click edit to change information in your application:

    IMPORTANT: Note down CLIENT ID and the approved URL's from the screen below, we will need this later :-)

![OAUTH2 Application Setup Step 5.](https://raw.githubusercontent.com/jderocher/Plugins/master/screenshots/application-setup-step-5.png)

6) Last Step: This window will show a list of all the applications you have created:

![OAUTH2 Application Setup Step 6.](https://raw.githubusercontent.com/jderocher/Plugins/master/screenshots/application-setup-step-6.png)



### Download the Plugin:

    git clone https://github.com/jderocher/Plugins.git

### Configure the Plugin:

1. Dependencies:
    
    JQUERY: 
    
    ```html
    <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
    ```
    
    MOMENT-JS

    ```html
    <script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.4/moment.min.js"></script>
    ```

2. Setup:

    The event creation form on Vuevent is looking for the following required fields. You 
    will need to map these fields to the fields on your form in the configuration:
    
    **FIELD MAP:**
    
    |#  | VERBOSE NAME              | PLUGIN FIELD KEY ID |
    |---|-------------------------------|---------------------|
    |1. | Event Name                | title          |
    |2. | Event Start Date Time     | startDate      |
    |3. | Event End Date Time           | endDate            |  
    |4. | Event Short Descriptoin       | shortDescription   |
    |5. | Event Extended description    | extendedDescription |
    |6. | Physical Address          | location           |

    ```html 
    <script>
        $(document).ready(function(){
            
             $('#event-form').vueventPublisher({
                clientID: 'your_client_id',
                redirectURI: 'your_redirect_uri',
                fields:{
                    title: '#eventTitleFieldID',
                    description: '#eventDescriptionFieldID',
                    startDate: '#startDateFieldID',
                    endDate: '#endDateFieldID',
                    shortDescription: '#shortDescriptionFieldID',
                    extendedDescription: '#eventDescriptionFieldID',
                    location: '#eventLocation',
                }
            });
        });
    </script>
    ```
    
    The code above will attach the plugin with your event creation form. The plugin, then looks for
    a button container with an ID, in which you must append the button element:
        
        #vueventPublishBtnContainer
        
     The button by default has an ID 
        #vueventBtnPublish 
        
     The ID can be altered by changing the value of the option, in the plugin configuration above:
        
        buttonID  

### Use the plugin:

We have installed a small javascript webserver inside the demo folder of the respository.
This is to help you quickly run and test the plugin.

1. Dependencies:

a. NODEJS: 

http://nodejs.org/download/

2. After node has successfully been installed, with your terminal of choice, 
change your current working directory to the <file-system-path>/Plugins/demo

3. The plugin configuration file for this demo resides below:

<file-system-path>Plugins/demo/coserv/www/cont/shared/js/lib/main.js
 
You will need to modify this file and add your own CLIENT ID etc.

4. Run the following command:

    node coserv
    
5. A Javascript based webserver will run and make available the plugin page on

http://127.0.0.1:8322

![Usage Step 1](https://raw.githubusercontent.com/jderocher/Plugins/master/screenshots/usage-step-1.png)

6. Authorize the plugin to use your Vuevent account:

![Usage Step 2](https://raw.githubusercontent.com/jderocher/Plugins/master/screenshots/usage-step-2.png)

7. After successful authorization, the information in your own event creation form is extracted and inserted into the Vuevent Event creation form. You can now add information to the required fields and then hit create and voila !!

![Usage Step 3](https://raw.githubusercontent.com/jderocher/Plugins/master/screenshots/usage-step-3.png)

8. DONE !!!

     



    

