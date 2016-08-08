/**
 * File: vip.js
 *
 * This file contains javascript for retreiving credit of a VIP user.
 * 
 *
 * Version 1.0
 * Author: Group FD
 */

// get credit of VIP user, as they are the users able to have credit.

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