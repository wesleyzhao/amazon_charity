var as=document.getElementById("ASIN");
try{
    var asin = as.value;
}
catch(err){
    //this means this is not a working page
    var asin="";
}
var additionalInfo = {
    "asin":asin
};
chrome.extension.connect().postMessage(additionalInfo);


if (asin){

    var session_id = getSessionId();

    getValueFromLocalStorage('tag', session_id);


    } // end if asin

function changeURLBasedOnTag(the_tag){

	var t = the_tag; //var t = getValueFromLocalStorage('tag'); //var t="tasteplug7-20";
	try{
	    var tA=document.getElementById("tagActionCode");
	    var tAt=tA.value;
	    if (tAt==""){tAt="fail";}
	}
	catch(err){
	    var tAt="";
	}
	if (!tAt || tAt == "fail" || t!=tAt){
	    var u="/dp/ASIN/"+ asin +"/?tag="+t;
	    console.log('did i get in to this if');
	    document.location.href=u;
	}

}

function getValueFromLocalStorage(storage_key, session_id){
    var the_value = "thedefault";

    chrome.extension.sendRequest({
	method: "getLocalStorage",
	key: storage_key,
	sessionID: session_id,
    }, function(response){
	the_value = response.data;

	if (response.isSessionIDNew){
	    changeURLBasedOnTag(the_value); //this is bad design...
	}
	else{
	    // if the session is old and already shopping as a tag
	    // make sure the user knows who they are shopping for
	    addTagNotification(the_value);
	}
    });


}

function addTagNotification(tag){

    var product_title_el = document.getElementsByClassName('parseasinTitle')[0];
    var tagger = document.createElement('div');
    tagger.id = 'tag-notification';
    tagger.setAttribute('style', "color: red");
    tagger.innerHTML = '(shopping as the affiliate: "' + tag + '")';
    product_title_el.appendChild(tagger);
    
}

function getSessionId(){
    var session_el = document.getElementById('session-id');
    return session_el.value;
}