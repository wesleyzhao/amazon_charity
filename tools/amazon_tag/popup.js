function openNewPageWithURL(url){
    chrome.tabs.create({'url' : url}, function(tab){
    });
}