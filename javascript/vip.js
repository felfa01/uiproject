

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