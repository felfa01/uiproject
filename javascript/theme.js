/**
 * File: theme.js
 *
 * This file contains javascript for switching between themes on webpage.
 * 
 *
 * Version 1.0
 * Author: Group FD
 */

// Functionality for switching between the themes for the website much like the language functions
$( document ).ready(function() {
	if(sessionStorage.theme != null){
		$("input[name=theme][value='"+sessionStorage.theme+"']").prop("checked",true);
		document.getElementById('theme_css').href = sessionStorage.theme;
	}else{
		sessionStorage.theme="../css/styles.css";
		$("input[name=lang][value='../css/styles.css']").prop("checked",true);
	}

	$("input[name=theme]:radio").change(function () {
		document.getElementById('theme_css').href = $('.theme-form input[type=radio]:checked').val();
		sessionStorage.theme = $('.theme-form input[type=radio]:checked').val();

	});
});