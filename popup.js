function save_options_popup(){
    // saves the fields and then refreshes the current Amazon page

    save_options(); // inherited from options_save.js
    refreshCurrentPage();
}

function openNewPageWithURL(url){
    chrome.tabs.create({'url' : url}, function(tab){
    });
}

function openNewPageWithOptions(){
    chrome.tabs.create({'url': chrome.extension.getURL('options.html')}, function(tab){});
}

function populateCharitiesList(){

    placeCharitiesByDiv('charity-list'); // method inherited from new_charities.js
    charity_el = document.getElementById('charity-loader-link');
    charity_el.innerHTML = charity_el.innerText;

}

function refreshCurrentPage(){
    chrome.tabs.getSelected(null, function(tab){
	chrome.tabs.update(tab.id, {url: tab.url});
    });
}