var xml2js = require('xml2js');
var HashMap = require('hashmap');
var Set = require('./set');

var parser = new xml2js.Parser();

var uniList = ["UNIVERSITY%20OF%20CALIFORNIA%20BERKELEY", "STANFORD%20UNIVERSITY"];

for (i=0; i<uniList.length; i++) {
    var hashFundingPI = new HashMap();
    var hashGrantsPI = new HashMap();
    var hashPublicationsPI = new HashMap();
    var numFunding = 0;
    var itemCounter = 1;
    var maxPageCount = 50;
    var offset = 1;
    var queryTextNIH = "";
    var queryFundingPI = null;
    var dataFundingPI = null;
    var totalCounter = 0;
    while (itemCounter<totalCounter || offset==1){
        console.log("offset "+offset)
        queryTextNIH = "https://api.federalreporter.nih.gov/v1/Projects/search?offset=" + 
        offset + "&query=text:autism$fy:2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017$orgName:"+uniList[i]+"*";
        queryFundingPI = httpGet(queryTextNIH);
        console.log("success retrieving http");
        dataFundingPI = JSON.parse(queryFundingPI);
        totalCounter = dataFundingPI.totalCount;
        console.log("totalCount = "+totalCounter)
        var curPI = "";
        var curFund = 0;
        var existFund = 0;
        var curCount = 0;
        var curGrantNum = [];
        
        while (itemCounter<totalCounter && curCount<50){
            curPI = dataFundingPI.items[curCount].contactPi;
            curFund = dataFundingPI.items[curCount].totalCostAmount;
            curGrantNum = dataFundingPI.items[curCount].projectNumber;
            idxLast = curGrantNum.indexOf("-");
            if (idxLast==-1){
                idxLast = curGrantNum.length;
            }
            curGrantNum = curGrantNum.substring(1,idxLast);
            //console.log("PI: "+curPI+", $"+curFund);
            if (hashFundingPI.has(curPI)){
                existFund = hashFundingPI.get(curPI);
                curFund = existFund + curFund;
                var setGrantNum = hashGrantsPI.get(curPI);
                if (!setGrantNum.contains(curGrantNum)) {
                    setGrantNum.add(curGrantNum);
                }
            } else {
                var setGrantNum = new Set();
                setGrantNum.add(curGrantNum);
            }
            hashFundingPI.set(curPI, curFund);
            hashGrantsPI.set(curPI, setGrantNum);
            itemCounter++;
            curCount++;
            //console.log("item count: "+itemCounter+", current count: "+curCount);
        }
        offset = offset + 50;
    }
    
    var allPI = hashGrantsPI.keys();
    var curGrants = [];
    for (j=0; j<hashGrantsPI.count(); j++) {
        curPI = allPI[j];
        curGrants = hashGrantsPI.get(curPI).get();
        console.log("Current PI: "+curPI);
        var numPub = 0;
        var mycount = 0;
        var curSingleGrant = "";
        for (k=0; k<curGrants.length; k++){
            curSingleGrant = curGrants[k];
//            idxLast = curSingleGrant.indexOf("-");
//            if (idxLast==-1){
//                idxLast = curSingleGrant.length;
//            }
//          curSingleGrant = curSingleGrant.substring(1,idxLast);
            //console.log(curSingleGrant);
            var myxml = httpGet("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term="+curSingleGrant+"%5BGrant+Number%5D");
            parser.parseString(myxml, function (err, result) {
                if (err) throw err;
                mycount = result['eSearchResult']['Count'][0];
            });
            console.log("Grant: "+curSingleGrant+", "+mycount+" publications");
            numPub = numPub + parseInt(mycount);

        }
        hashPublicationsPI.set(curPI, numPub);
        //console.log("PI: "+curPI+", # publications: "+numPub);
    }
    console.log(hashPublicationsPI);

}











function httpGet(theUrl)
{
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

/*
else // Internet Explorer
{
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = false;
    xmlDoc.loadXML(txt);
} 

https://api.federalreporter.nih.gov/v1/Projects/search?query=fy:2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017$orgName:UNIVERSITY%20OF%20CALIFORNIA%20BERKELEY*

*/