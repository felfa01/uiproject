/**
 * File: navigation.js
 *
 * This file contains some basic javascript for navigation.
 * 
 *
 * Version 1.0
 * Author: Group FD
 */

$( document ).ready(function() {
$(".navbar-link").click(function() {
	var str = window.location.href;
	console.log(str)
    var n = str.indexOf("uiproject/");
    str = str.substring(0, n + ("uiproject/").length);
    window.location.href = str + $(this).data("href") + "?username=" + urlParams["username"]+"&password=" + urlParams["password"];

});
});