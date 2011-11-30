/*
  Figure out if this is a product page by getting the 'ASIN'
  If it is a product page, then figure out if we need to add a tag
  or if the session already contains it.
  Else, do nothing.
*/

var as=document.getElementById("ASIN");
try{
    // try to get the ASIN product number
    var asin = as.value;
}
catch(err){
    // this means this is not a working PRODUCT page, need to catch the error
    var asin="";
}

if (asin){
    // if this is a product page (it will have an ASIN number)

    var session_id = getSessionId();

    /*
      the following line of code will retreive the affiliate tag from
      localStorage by sending a message to the background page
      
      it will deterimine if the page needs to be redirected to set an
      affiliate tag for the shopping session and do all the little bits
      too... probably not the best name for the method
     */
    getValueFromLocalStorage('tag', session_id);


    } // end if asin


function changeURLBasedOnTag(the_tag){
    /*
      the_tag: string, the affiliate tag to be used
      
      Checks to see if the tagActionCode is already set
      if it is, then no need to change anything.
      
      Else, it redirects the page appending the tag as a GET
      variable to the URL.

      The if statement may not be required... not sure yet.

     */
	var t = the_tag; //var t = getValueFromLocalStorage('tag'); //var t="tasteplug7-20";
	try{
	    // try to get the affiliate tag from the source code of the page
	    var tA=document.getElementById("tagActionCode");
	    var tAt=tA.value;
	    if (tAt==""){tAt="fail";} // this would mean Amazon has no value for the tagActionCode, but it exists
	}
	catch(err){
	    // if there wasn't any set tAt as a blank string
	    var tAt="";
	}
	if (!tAt || tAt == "fail" || t!=tAt){
	    // if there is no valid tag on the page, redirect the page appending
	    // the tag as a GET variable

	    var u="/dp/ASIN/"+ asin +"/?tag="+t;
	    console.log('did i get in to this if');
	    document.location.href=u;
	}

}

function getValueFromLocalStorage(storage_key, session_id){
    /*
      Gets the affiliate tag from localStorage (by talking to the 
      background page) and then figures out if the page needs to be 
      redirected to add the affiliate tag (and then does it if it is
      required) or if the page just needs a notification saying what
      affiliate tag is being used.

      storage_key : string, will just be 'tag' (bad design)
      session_id: string, the session id as displayed in the page source code
     */

    var the_value = "the_value_default"; // set the tag to a default value
 
    chrome.extension.sendRequest({
	method: "getLocalStorage",
	key: storage_key, // pass 'tag' to get the tag
	sessionID: session_id, // pass the session_id retreived from the page
    }, function(response){
	// once the response is received we end up here

	the_value = response.data; // sets the_value to the tag as stored in localStorage

	if (response.isSessionIDNew){
	    // if the session id sent is new and was not previously in localStorage
	    changeURLBasedOnTag(the_value); // change the URL of the page to append the affiliate tag
	}
	else{
	    // if the session is old and already shopping as a tag
	    // make sure the user knows who they are shopping for
	    addTagNotification(the_value);
	}
    });


}

function addTagNotification(tag){
    /*
      Add a notification under the title of the Amazon product displaying
      what affiliate tag is currently being used

      tag: string, the tag to be displayed
     */
    var product_title_el = document.getElementsByClassName('parseasinTitle')[0]; // get the product title HTML element
    if (!product_title_el){
	// if this is a video (or some other product page where this doesn't work) revert to this element
	var product_details = document.getElementById('prod-details');
	product_title_el = product_details.getElementsByTagName('h1')[0];
    }
    var tagger = document.createElement('div'); // create the new element we are going to add
    tagger.id = 'tag-notification';
    tagger.setAttribute('style', "color: red"); // set the style
    tagger.innerHTML = '(shopping as the affiliate: "' + tag + '")';
    product_title_el.appendChild(tagger); // add the new notification to the title by appending
    
}

function getSessionId(){
    /*
      Get the session id based off the HTML ID from the Amazon product page
     */
    var session_el = document.getElementById('session-id');
    return session_el.value;
}