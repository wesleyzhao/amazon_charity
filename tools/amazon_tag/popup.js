function openNewPageWithURL(url){
    chrome.tabs.create({'url' : url}, function(tab){
    });
}

function populateCharitiesList(){

    placeCharitiesByDiv('charity-list'); // method inherited from new_charities.js
    charity_el = document.getElementById('charity-loader-link');
    charity_el.innerHTML = charity_el.innerText;

}