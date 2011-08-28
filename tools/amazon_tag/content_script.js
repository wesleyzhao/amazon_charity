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
/*
var t="tasteplug7-20";
try{
    var tA=document.getElementById("tagActionCode");
    var tAt=tA.value;
    if (tAt==""){tAt="fail";}
}
catch(err){
    var tAt="";
}
if (!tAt && t!=tAt){
    var u="/dp/ASIN/"+nu+"/?tag="+t;
    document.location.href=u;
}
*/