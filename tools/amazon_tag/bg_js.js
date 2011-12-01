/*
 The following code is simple message receiving then passing between
 content_script.js and bg.html (the background page)

 This will listen for a request, once it gets it will first figure out
 if the session-id of the request is already saved.

 If the session-id is already saved, then just pass back a False for 
 isSessionIDNew
 Else, set the session-id and then pass back a True for isSessionIDNew

 ALWAYS, the saved affiliate tag will be passed back as 'data'
*/

chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    // listen for a request from content_script.js

    if (request.method == "getLocalStorage"){
	var session_id = request.sessionID;
	var _isSessionIDNew = false;

	if (!session_id){
	    // this case if in a checout page where session_id is not present
	    _isSessionIDNew = true; // true because we can't know for sure
	}
	else if (localStorage['last_good_session_id'] == session_id){
	    // the session id being sent is the same as the one last stored
	    _isSessionIDNew = false;
	}
	else{
	    // if the session id being bassed is not the same as the last stored
	    localStorage['last_good_session_id'] = session_id; // set a new session id in localStorage
	    _isSessionIDNew = true;
	}
	sendResponse({
	    data: localStorage[request.key], // this is the affiliate tag
	    isSessionIDNew : _isSessionIDNew // true/false for is the session new
	});
    }
    else
	sendResponse({}); //snub them
});


chrome.tabs.onUpdated.addListener(checkForValidUrl);

function checkForValidUrl(tabId, changeInfo, tab){
    /*
      Checks to see if the page is an Amazon URL, and if so, displayes
      the pageAction
     */
    var amazon_regexp = /(http|https):\/\/www\.amazon\.(com|at|ca|fr|de|it|jp|es|co\.uk|cn).*/; //regexp for every region Amazon URL
    if (amazon_regexp.test(tab.url)){
	// if the current tab's url passes the regexp test show pageAction
	chrome.pageAction.show(tabId);
	
	popupIfTagIsMissing()
    }

}

function popupIfTagIsMissing(){
    if (!localStorage['tag'] || localStorage['tag'] == "no-tag-saved-yet"){
	// if no tag is set yet, then make the popup, popup!
	chrome.tabs.create({url: "options.html"});
    }
}