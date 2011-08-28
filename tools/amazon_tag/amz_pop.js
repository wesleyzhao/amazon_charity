var bg = chrome.extension.getBackgroundPage();
var tagged_url = makeTagUrl(bg.asin, "tasteplug7-20");
function makeChange(){
    chrome.tabs.getSelected(null, function(tab){
	chrome.tabs.update(tab.id, {url: tagged_url});
    });
}

function makeTagUrl(asin,tag){
    var base_url = "http://www.amazon.com/";
    return base_url + "dp/ASIN/" + asin + "/?tag=" + tag;
}