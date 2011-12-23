var charitiesLink = "http://dl.dropbox.com/u/19699329/charities.json";

function getJSONByURL(url){

    var charitiesArr = {};
    charitiesArr = $.ajax({
	url: url,
	dataType: 'json',
	async: false
    });
    return JSON.parse(charitiesArr.responseText);

}

function placeCharitiesByDiv(divID){
    
    var el = document.getElementById(divID);
    var charr = getJSONByURL(charitiesLink);

    for (charity in charr){
	var filler = document.createElement('p');
	var new_charity = document.createElement('div');
	new_charity.setAttribute('class', 'new-charity');
	new_charity.innerHTML = "<span class='charity-name'>" + charity + ":</span> <span class='charity-tag'><a href='#' onclick='addCharityTagToInput(\"" + charr[charity] + "\", \"tag-input\")'>" + charr[charity] + "</a></span>";
	filler.appendChild(new_charity); // put the new charity in the <p> tags
	el.appendChild(filler); // put the new charity and <p> in the element
    }

}

function addCharityTagToInput(tag, inputId){
    var inputEl = document.getElementById(inputId);
    inputEl.value = tag;
}