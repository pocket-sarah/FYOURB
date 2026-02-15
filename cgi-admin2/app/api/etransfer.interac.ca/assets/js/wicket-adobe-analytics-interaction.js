/**
 * Defines the interaction between application and Adobe analytics server.
 * 
 */

/* Creates a Wicket event subscriber for when AJAX calls are complete and sends a
 * tracking request to the Adobe analytics server. Clears the data once done.*/

if(window.Wicket && Wicket.Event) {
	Wicket.Event.subscribe('/ajax/call/complete', function ajaxCompleteCallback(event, node, xhr) {
		if(	typeof digitalData !== "undefined" 
				&& typeof digitalData.errors !== "undefined" 
					&& _satellite.track('track', digitalData)) {
			clearDigitalData();
		}
	});
}
/* Clears the digitalData object. digitalData = {}*/
function clearDigitalData(){
	for (var field in digitalData){
		delete digitalData[field];
	}
}
