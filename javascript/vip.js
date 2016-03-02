var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

$( document ).ready(function() {
	getCredit(urlParams["username"], urlParams["password"]);
});

function getCredit(username, pwd){
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=iou_get";
	  $.getJSON( url, {
    format: "json"
  }).done(function( data ) {
  	$("#credit").html(data.payload[0]["assets"])
    });

}