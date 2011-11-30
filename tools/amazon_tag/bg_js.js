chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    if (request.method == "getLocalStorage"){
	var session_id = request.sessionID;
	var _isSessionIDNew = false;
	if (localStorage['last_good_session_id'] == session_id){
	    // the session id being sent is the same as the one last stored
	    _isSessionIDNew = false;
	}
	else{
	    // if the session id being bassed is not the same as the last stored
	    localStorage['last_good_session_id'] = session_id;
	    _isSessionIDNew = true;
	}
	sendResponse({
	    data: localStorage[request.key],
	    isSessionIDNew : _isSessionIDNew
	});
    }
    else
	sendResponse({}); //snub them
});