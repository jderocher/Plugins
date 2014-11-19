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
 * Licensed under the MIT license
 */


// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
;(function ( $, window, document, undefined ) {
    
    // undefined is used here as the undefined global 
    // variable in ECMAScript 3 and is mutable (i.e. it can 
    // be changed by someone else). undefined isn't really 
    // being passed in so we can ensure that its value is 
    // truly undefined. In ES5, undefined can no longer be 
    // modified.
    
    // window and document are passed through as local 
    // variables rather than as globals, because this (slightly) 
    // quickens the resolution process and can be more 
    // efficiently minified (especially when both are 
    // regularly referenced in your plugin).
	
    // Create the defaults once
    var pluginName = 'vueventPublisher',
        defaults = {
    		baseURI: 'http://vuevents.com/',
    		authURL: 'http://vuevents.com/o/authorize/',
    		clientID: '',
			responseType: 'token',
            state: Math.random().toString(36).slice(2),
            scope: 'read write',
            redirectURI: 'http://localhost:8888',
            buttonID: 'btnVueventPublishEvent',
            formID: '',
            fields: {},
            
        };
    
    
    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }
    
    // Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
		 /*--------------------------------------------------------------------
		 * Function to Initialize the plugin
		 *-------------------------------------------------------------------*/ 
		init: function () {
			
			if(!window.name){
				window.name = 'vueventParent' ;
			}

			var self = this,
    			strButtonID = '#' + self._defaults.buttonID;
				vueventPublisherHandle = self;
				
			if(window.name == 'vueventPopup') {
				
				window.opener.vueventPublisherHandle.publishEvent(location.href);
				window.close();
			}
			
	    	//Assign click to the button, this will initiate the publshing.
	    	$(strButtonID).click(function(e){
	    		e.preventDefault();
	    		
	    		//open window that will authorize the user
	    		
	    		var authData = {
					'client_id': self.options.clientID,
					'response_type': self.options.responseType,
		            'state': Math.random().toString(36).slice(2),
		            'scope': 'read write',
		            'redirect_uri': self.options.redirectURI
		      	};    		
	    		
	    		var url = self.options.authURL + '?' + $.param(authData);
				win = window.open(url, 'vueventPopup');
				
	    	});
		},
		 /*--------------------------------------------------------------------
		 * Function to parse the url query result from the popup.
		 *-------------------------------------------------------------------*/ 
		getQuery: function (query) {
			
			if (/\/#/g.test(query)){
				var paramStringList = query.split('/#');
			} else if (/\/?/g.test(query)){
				var paramStringList = query.split('/?');
			}
			
			var params = {};
			
			if(paramStringList.length == 2){
				var paramPairList = paramStringList[1].split('&');
				
				$.each(paramPairList, function(index, pairString){
					var pairList = pairString.split('=');
					if (pairList.length == 2){
						params[pairList[0]] = pairList[1]
					}
				});
			}
			
			return params;
		},
	    /*---------------------------------------------------------------------
		 * Function to handle the popup that will be used for authorization.
		 *-------------------------------------------------------------------*/    
		publishEvent: function(result){
			var self = this,
		    	params = self.getQuery(result),
		    	baseURI = self.options.baseURI
		    
		    $.ajax({
		    	  url: baseURI + 'events/',
		    	  method: 'GET',
		    	  crossDomain: true,
		    	  beforeSend: function( xhr ) {
		    		  xhr.setRequestHeader('Authorization', 'Bearer ' +  params['access_token']);
		    	  },
		    	  success: function(result){
		    		  
		    		  var data = self.getFormData(self.options.fields);
		    		  
		    		  window.open(baseURI + 'event/?' + $.param(data));
		    	  },
		    	  statusCode: {
		    		  404: function() {
		    			  $('#vueventConsole').text('NOT FOUND: Could not find the url location.');
		    		  },
		    		  401: function() {
		    			  $('#vueventConsole').text('UNAUTHORIZED: There was an error authenticating you.');
		    		  }
	    		  }
	    	});	
		    
		},
	    /*---------------------------------------------------------------------
		 * Function to generate a dictionary of mapped fields and their values.
		 *-------------------------------------------------------------------*/    
		getFormData: function(fields){
			var data = {}
			
			if(Object.keys(fields).length > 0){
				
				$.each(fields, function(field, value){
					data[field] = $(value).val();
				});
			}
			return data
		}		
		//--functions//
	});
	/*-------------------------------------------------------------------------
	 * A really lightweight plugin wrapper around the constructor,
	 * preventing against multiple instantiations
	 * ----------------------------------------------------------------------*/
	$.fn[ pluginName ] = function ( options ) {
		
		this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		});

		// chain jQuery functions
		return this;
	};

})( jQuery, window, document );