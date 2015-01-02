
/*
 * loadXMLDoc()
 * adapted from http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
 *
 */
var templated;
var templatedata;
function loadXMLDoc(url,globalvars) {
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		} else {// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && (xmlhttp.status==200 || xmlhttp.status==0)) {
			templated = JSON.parse(xmlhttp.responseText);
			templatedata = $.merge(templated,globalvars);
			Vinegar.template(document,templatedata);
			if (url=="templates/header.json") {
				loadXMLDoc("templates/footer.json");
			} else if (url=="templates/footer.json") {
				loadXMLDoc("templates/index.json");
			}
		}
	}
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
}