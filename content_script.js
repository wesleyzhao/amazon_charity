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
    getValueFromLocalStorage('tag', session_id, checkProductPageAndChangeIfNeeded);

} // end if asin
else{
    var just_added_cart_regexp = /(http|https):\/\/www\.amazon\.com\/gp\/cart\/view-upsell\.html.*/; // page that appears right after adding item to cart
    var just_the_cart_regexp = /(http|https):\/\/www\.amazon\.com\/gp\/cart\/view\.html.*/; // page that appears when just viewing the cart

    var in_checkout_signin_regexp = /(http|https):\/\/www\.amazon\.com\/gp\/cart\/view\.html.*ref=ox_sc_proceed.*/; // page that appears when signing in to begin checkout
    var in_checkout_signin_also_regexp = /(http|https):\/\/www\.amazon\.com\/gp\/cart\/view\.html.*proceedToCheckout.*/; // another page that might appear when signing in to begin checkout
    var in_checkout_shipping_regexp = /(http|https):\/\/www\.amazon\.com\/gp\/buy\/signin\/handlers\/.*/; // page that appears when dealing with choosing shipping address right after login
    var in_checkout_shipping_select_regexp = /(http|https):\/\/www\.amazon\.com\/gp\/buy\/shipaddressselect\/.*/; // page that appears when selecting shipping option and will get new pages via ajx
    var in_checkout_everything_regexp = /(http|https):\/\/www\.amazon\.com\/gp\/buy\/.*/; // page that appears for the rest of the checkout experience
    var in_checkout_prime_regexp = /(http|https):\/\/www\.amazon\.com\/gp\/prime\/pip\/complete\.html.*/; // page that appears when finalizing order
    var in_registration_regexp = /(http|https):\/\/www\.amazon\.com\/ap\/register\/.*/;
    var purchased_regexp = /(http|https):\/\/www\.amazon\.com\/gp\/buy\/thankyou\/.*/; // page that appears after the user just made a purchase
    
    var current_url = document.URL;
        
    if (just_added_cart_regexp.test(current_url)){
	// if the page is right after a product is added into a cart
	// there will be no session id here

	getValueFromLocalStorage('tag', "", function(affiliate_tag, isSessionIDNew){
	    addTagNotification(affiliate_tag, 'just_added_cart');
	});
    }
    else if (in_checkout_signin_regexp.test(current_url) || in_checkout_signin_also_regexp.test(current_url)){
	// if the page is right as the user is signing in to begin the
	// checkout process. there will be a session ID here
	var session_id = getSessionId();
	getValueFromLocalStorage('tag', session_id, function(aff_tag, isSessionIDNew){
	    if (isSessionIDNew){
		// if this session id is new and not recognized yet
		// alert the user
		aff_tag = "NO TAG IS SET FOR THIS SESSION. PLEASE SET NEW ONE TO HELP A CHARITY!";
	    }
	    addTagNotification(aff_tag, 'in_checkout_process');
	});
    }
    else if (just_the_cart_regexp.test(current_url)){
	// if this page is just viewing the shopping cart
	
	getValueFromLocalStorage('tag', "", function(affiliate_tag, isSessionIDNew){
	    addTagNotification(affiliate_tag, 'just_the_cart');
	});
    }
    else if (in_checkout_shipping_regexp.test(current_url)){
	// if the page is right as the user is choosing a shipping address
	// to begin the checkout process. there will be a sessionID here
	console.log('here');
	var session_id = getSessionId();
	getValueFromLocalStorage('tag', session_id, function(aff_tag, isSessionIDNew){
	    if (isSessionIDNew){
		// if this session id is new and not recognized yet
		// alert the user
		aff_tag = "NO TAG IS SET FOR THIS SESSION. PLEASE SET NEW ONE TO HELP A CHARITY!";
	    }
	    addTagNotification(aff_tag, 'in_checkout_process');
	});
    }   
    else if (in_checkout_shipping_select_regexp.test(current_url)){
	// if this page is the special shpping select page in checkout
	// process there will not be a session id available

	getValueFromLocalStorage('tag', "", function(affiliate_tag, isSessionIDNew){
	    
	    console.log('here trying to get everything');
	    addTagNotification(affiliate_tag, 'in_checkout_process');
	    
	    document.body.addEventListener("mouseover", function(){
		addTagNotification(affiliate_tag, 'super_annoying_ajax')
	    }, false);
	    /*
	    addEvent(window, "load", function(){
		addEvent(document.body, "mouseover", addTagNotification(affiliate_tag, 'in_checkout_process'));
	    });
	    
	    $("body").mouseover(function(){
		addTagNotification(affiliate_tag, 'in_checkout_process');
	    });
	    */
	});
    }
    else if (purchased_regexp.test(current_url)){
	// if this page is the user just finished making a purchase
	// no session id here
	getValueFromLocalStorage('tag', "", function(affiliate_tag, isSessionIDNew){
	    addTagNotification(affiliate_tag, 'purchased');
	});	
    }
    else if (in_checkout_everything_regexp.test(current_url)){
	// if this page is anything else in the checkout process
	// there will not be a session id available
	console.log('in here everything');
	getValueFromLocalStorage('tag', "", function(affiliate_tag, isSessionIDNew){
	    console.log('here trying to get everything');
	    addTagNotification(affiliate_tag, 'in_checkout_process');
	});	
    }
    else if (in_registration_regexp.test(current_url)){
	// if this page is the user registration process
	// there will not be a session id available
	getValueFromLocalStorage('tag', "", function(affiliate_tag, isSessionIDNew){
	    addTagNotification(affiliate_tag, 'in_checkout_process');
	});	
    }
    
}


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

function getValueFromLocalStorage(storage_key, session_id, function_passed){
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

	function_passed(response.data, response.isSessionIDNew);

    });


}

function checkProductPageAndChangeIfNeeded(affiliate_tag, isSessionIDNew){
    /*
      Checks to see if the page is part of a known session with the 
      current affiliate_tag, and if not then it will redirect the page
      to add the GET value of the tag. And if so, then it will make sure
      the user is notified which tag is being used.
     */

    if (isSessionIDNew){
	// if the session id sent is new and was not previously in localStorage
	changeURLBasedOnTag(affiliate_tag); // change the URL of the page to append the affiliate tag
    }
    else{
	// if the session is old and already shopping as a tag
	// make sure the user knows who they are shopping for on
	// product page
	addTagNotification(affiliate_tag, 'product');
    }
    
}

function addTagNotification(tag, page_type){
    /*
      Add a notification under the title of the Amazon product displaying
      what affiliate tag is currently being used based off what page type
      is currently being displayed.

      tag: string, the tag to be displayed
      page_type: string, to indicate what page we are inserting notification
      on. So far the following work: 'product', 'just_added_cart'
     */

    var el_array = []; // array to store elements to be appended notification to

    /*
      first set of if statements gets the element for the notification to
      be inserted to based off the page_type submitted.
     */
    if (page_type == 'product'){
	// first if handles a product page

	var product_title_el = document.getElementsByClassName('parseasinTitle')[0]; // get the product title HTML element
	if (!product_title_el){
	    // if this is a video (or some other product page where this doesn't work) revert to this element
	    var product_details = document.getElementById('prod-details');
	    product_title_el = product_details.getElementsByTagName('h1')[0];
	}
	console.log(product_title_el);
	el_array.push(product_title_el);
	console.log(el_array);
	popupExtensionLink('I\'m viewing a product page lulz');
    }
    else if (page_type == 'just_added_cart'){
	// handles the page that shows up right after adding something to
	// cart

	el_array.push(document.getElementById('hl-confirm'));
    }
    else if (page_type == 'just_the_cart'){
	// handles the page that shows up when viewing just the shopping
	// cart
	el_array.push(document.getElementsByClassName('round-box')[0]);
    }
    else if (page_type == 'in_checkout_process'){
	// if in process of checking out
	console.log('here in checkout process');
	el_array.push(document.getElementById('progressbar'));
	el_array.push(document.getElementById('ap_header'));
	el_array.push(document.getElementsByClassName('navigation')[0]);
	el_array.push(document.getElementsByClassName('progressbar')[0]);
    }
    else if (page_type == 'super_annoying_ajax'){
	var annoying_ajax_el = document.getElementById('progressbar');
	var possible_tag = annoying_ajax_el.getElementsByClassName('tag-notification')[0];
	if (!possible_tag && annoying_ajax_el){
	    el_array.push(annoying_ajax_el);
	}
	var annoying_ajax_el2 = document.getElementsByClassName('navigation')[0];
	var possible_tag2 = annoying_ajax_el2.getElementsByClassName('tag-notification')[0];
	if (!possible_tag2 && annoying_ajax_el2){
	    el_array.push(annoying_ajax_el2);
	}
    }
    else if (page_type = 'purchased'){
	// if the user just finished making a purchase and now is on the 
	// thank you page
	console.log('here');
	var thank_you_el =  document.getElementById('thank-you-header');
	el_array.push(thank_you_el);
    }

    // after to_insert_el (the element which notification will be appended)
    // is gotten.
    var tagger = document.createElement('div'); // create the new element we are going to add
    tagger.id = 'tag-notification';
    tagger.setAttribute('style', "color: red; font-size: 1.7em;"); // set the style
    tagger.setAttribute('class', "tag-notification");
    tagger.innerHTML = '(shopping for the affiliate: "' + tag + '")';
    
    for (var i = 0; i < el_array.length; i++){
	// get all the elemtns in el_arrary, usually this is just one
	// then append the notification
	var element = el_array[i];
	console.log(element);
	if (element){
	    // only append if the element exists
	    element.appendChild(tagger);
	}
    }
//    to_insert_el.appendChild(tagger); // add the new notification to the title by appending
    
}

function getSessionId(){
    /*
      Get the session id based off the HTML ID from the Amazon product page
     */
    var session_el = document.getElementById('session-id');
    var session_id = ""
    try{
	// try to get the session id value from the previous element
	session_id = session_el.value;
    }
    catch(err){
	// this means 'session-id' was not a valid element, so try sessionID
	// instead from an input name
	try{
	    session_id = document.getElementsByName('sessionID')[0].value;
	}
	catch(err){
	    // this means sessionID is not an input name but an ID...
	    try{
		// this try is ONLY for the case of being in the final
		// process of checkout where this function will be called
		// but there will be no session ID in sight
		session_id = document.getElementById('sessionID').getAttribute('value');
	    }
	    catch (err){
		session_id = ""
	    }
	}
    }

    return session_id;
}

function popupExtensionLink(title){

    var this_extension_url = "https://chrome.google.com/webstore/detail/lddkddmnfgnkmalojmebjlmekjdkednh";
    
    tweetPopup(title, this_extension_url);

}

function generateTweetLink(title, link){
    var baseUrl = "http://twitter.com/share";
    var encodedLink = encodeURI(link);
    var related = "wesleyzhao";
    
    var finalUrl = baseUrl + "?" + "url=" + encodedLink + "&text=" + title + "&related=" + related;

    return finalUrl;
}

function tweetPopup(title, link){
    var tweetLink = generateTweetLink(title, link);
    
    window.open(tweetLink, "tweet", "height=450,width=550,resizable=1");

    return false;
}
