var xml2js = require('xml2js');
//var parseExcel = require('excel');
var HashMap = require('hashmap');

var parser = new xml2js.Parser();
var hashFundingPI = new HashMap();

var mycount = "";
var offset = 1;
//var myxml = httpGet("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term=acquired+cognitive+impairment");
//var queryTextNIH = "https://api.federalreporter.nih.gov/v1/Projects/search?offset=" + 
//  offset + "&query=text:autism$fy:2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017$orgName:UNIVERSITY%20OF%20CALIFORNIA%20BERKELEY*";
var dataFundingPI = httpGet("https://api.federalreporter.nih.gov/v1/Projects/search?offset=51&query=$text:autism$fy:2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017$orgName:UNIVERSITY%20OF%20CALIFORNIA%20BERKELEY*");
//console.log(queryTextNIH);
//var dataFundingPI = httpGet(queryTextNIH);
parser.parseString(dataFundingPI, function (err, result) {
    if (err) throw err;
    console.dir(result);
    //mycount = result['eSearchResult']['Count'][0];
    numFunding = result['SearchResultOfApiProject']['Items'];
    itemCounter = numFunding.length();
    console.log(itemCounter);
});
console.log(mycount);

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