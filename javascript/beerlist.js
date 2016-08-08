/**
 * File: beerlist.js
 *
 * This file contains some basic javascript for animation of beer image.
 * 
 *
 * Version 1.0
 * Author: Group FD
 */

$( document ).ready(function() { 

	$(".beer-element").on("click", function(){
		$(".beer-description").animate({height:'toggle'},500);

	});

});