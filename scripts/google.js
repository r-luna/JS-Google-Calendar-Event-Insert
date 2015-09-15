
;(function(ns){
	
	// PRIVATE
	
	var _CLIENT_ID = '637624422112-epp8f8juov64jlbc8oc2ijlrq39qo3nh.apps.googleusercontent.com'
	var _SCOPES = ['https://www.googleapis.com/auth/calendar'];
	
	//* Handle response from authorization server.
	//* @param {Object} authResult Authorization result.
	function handleAuthResult(authResult) {
		var authorizeDiv = document.getElementById('authorize-div');
		if (authResult && !authResult.error) {
			loadCalendarApi();
			console.log('cal api loading...');
		} else {
			console.log('onload auth failure');
		}
	}

	//* Load Google Calendar client library. List upcoming events
	//* once client library is loaded.
	function loadCalendarApi() {
		gapi.client.load('calendar', 'v3', listUpcomingEvents);
	}
	
	//* Print the summary and start datetime/date of the next ten events in
	//* the authorized user's calendar. If no events are found an
	//* appropriate message is printed.
	function listUpcomingEvents(){
		var request = gapi.client.calendar.events.list({
			'calendarId': 'primary',
			'timeMin': (new Date()).toISOString(),
			'showDeleted': false,
			'singleEvents': true,
			'maxResults': 10,
			'orderBy': 'startTime'
			});

		request.execute(function(resp){
			var events = resp.items;
			console.log('Upcoming events:');

			if (events.length > 0){
				for (i = 0; i < events.length; i++){
					var event = events[i];
					var when = event.start.dateTime;
					if (!when){
						when = event.start.date;
					}
					console.log(event.summary + ' (' + when + ')')
				}
			} else {
				console.log('No upcoming events found.');
			}

		});
	}
	
	// PUBLIC
	
	// Check if current user has authorized this application.
	ns.checkAuth = function(){
		if (!gapi || !gapi.auth){
			// make sure gapi is loaded
			window.setTimeout(ns.checkAuth,100);
			return;
		}
		gapi.auth.authorize(
			{
			'client_id': _CLIENT_ID,
			'scope': _SCOPES,
			'immediate': true
			}, handleAuthResult
		);
	};

    //* Initiate auth flow in response to user clicking authorize button.
    //* @param {Event} event Button click event.
	ns.handleAuthClick = function(event){
		gapi.auth.authorize(
			{client_id: _CLIENT_ID, scope: _SCOPES, immediate: false},
			handleAuthResult
		);
		return false;
	};
	
	 
})(this.gAPI = this.gAPI || {});	  

	  
