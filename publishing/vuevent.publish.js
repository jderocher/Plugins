/*
 * 
 * VUEVENTS PUBLISH EVENT PLUGIN
 * Copyright 2011-2014, Vuevent Inc.
 * 
 * This plugin is used publish an event on Vuevent. This plugin is attached to 
 * a form element and the fields of the form are mapped to the fields of
 * the Vuevent event model. On submitting the form, the values from the 
 * form fields are extracted from the form and are posted to a Vuevent 
 * API endpoint. 
 * 
 * 
 * */

(function($) {
	
	$.fn.publishEvent = function(formFields) {
		
		/*
		 * This function authenticates the user using the Authorization Server.
		 * */
		function authenticateUser(){
			
			$('#vueventWindowAuthentication').popupWindow({ 
				height:500, 
				width:800, 
				top:50, 
				left:50 
			}); 
			
			$('#vueventWindowAuthentication').trigger('click');
			
		}

		var defaultFields = $.extend({
			
			fieldSubmit : 'button[type="submit"]',
			
		}, formFields);
		
		
		function getFormData(fields){
			
			var data = {}
			
			if(Object.keys(fields).length > 0){
				
				$.each(fields, function(field, value){
					
					if (field != 'fieldSubmit'){
						data[field] = $("#" + value).val();
					}
					
				});
				
			}
			
			return data
			
		}
		
		

		// Intercept the form's submit button
		var btnSubmit = $(this).find(defaultFields.fieldSubmit);

		btnSubmit.on('click', function(e) {
			e.preventDefault();
			
			authenticateUser();
			

		})

		return this;

	};

}(jQuery));
