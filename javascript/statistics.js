/**
 * File: statistics.js
 *
 * This file contains the javaScript needed to calculate different statistics
 * and show it to the user through different figures(bar chart, pie chart) on a canvas generated from this javascript.
 *
 * Version 1.0 
 * Author: Mikael Holmberg
 */

// When the document has been loaded and initialised, we get the beers available in the bar.
//
$( document ).ready(function() {
	getInventory(urlParams["username"], urlParams["password"]);


});


function getInventory(username, pwd){
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=inventory_get";
	var beersToShow=[];
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		var totalCount = 0; // Count the total amount of the beers choosen, used to create graphs later on
		var coloArr =[]; // Color for each beer.
		jQuery.each(data.payload, function(i, beer) {
			//Only use beer with a higher count than 200 and that is named
			//TODO: Use of parameter?
			//
			if(beer.count > 200 && beer.namn !=""){
				var cpyBeer = beer; 
				totalCount = totalCount + parseInt(beer.count); 
				beersToShow.push(cpyBeer);
			}else{
				delete data.payload[i]
			}

		});
		colorArr = distinctColors(beersToShow.length) // Get the colors
		fillPieChart(totalCount, colorArr, beersToShow); // Fill the pie chart
	});
}

//Fills the pie chart with the procentage of each beer in the stock
function fillPieChart(totCount, colorArr, beers){
var canvas;
var ctx;
var lastend = 0;
console.log(totCount)
console.log(colorArr)
canvas = document.getElementById("cvs");
ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);

jQuery.each(beers, function(i, beer) {
ctx.fillStyle = colorArr[i]; // Color to fill the area with
ctx.beginPath();
ctx.moveTo(200,150); //Start point of path
ctx.arc(200,150,150,lastend,lastend+
  (Math.PI*2*(parseInt(beer.count)/totCount)),false);  // context.arc(x-center,y-center,radius,starting angle,ending angle);
ctx.lineTo(200,150); // make line to startpoint
ctx.fill(); // fill canvas
lastend += Math.PI*2*(parseInt(beer.count)/totCount); // save end point of last slice
$("#graph-info").append("<span class='col-4 graph-info-box'><span class='graph-color-box' style='background-color:" + colorArr[i]+"'></span>"+ beer.namn +", " + beer.namn2+"</span>");
});
}

// Create color from the hsv color model for each beer in the jsonobj
//
function distinctColors(count) {
    var colors = [];
    for(hue = 0; hue < 360; hue += 360 / count) {
        colors.push(hsvToRgb(hue, 100, 100));
    }
    return colors;
}


/**
* HSV to RGB color conversion
*
* H runs from 0 to 360 degrees
* S and V run from 0 to 100
*
* Ported from the excellent java algorithm by Eugene Vishnevsky at:
* http://www.cs.rit.edu/~ncs/color/t_convert.html
*/
function hsvToRgb(h, s, v) {
	var r, g, b;
	var i;
	var f, p, q, t;
 
	// Make sure our arguments stay in-range
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));
 
	// We accept saturation and value arguments from 0 to 100 because that's
	// how Photoshop represents those values. Internally, however, the
	// saturation and value are calculated from a range of 0 to 1. We make
	// That conversion here.
	s /= 100;
	v /= 100;
 
	if(s == 0) {
		// Achromatic (grey)
		r = g = b = v;
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
 
	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));
 
	switch(i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
 
		case 1:
			r = q;
			g = v;
			b = p;
			break;
 
		case 2:
			r = p;
			g = v;
			b = t;
			break;
 
		case 3:
			r = p;
			g = q;
			b = v;
			break;
 
		case 4:
			r = t;
			g = p;
			b = v;
			break;
 
		default: // case 5:
			r = v;
			g = p;
			b = q;
	}
 
	return 'rgb(' + Math.round(r * 255)+ ','+ Math.round(g * 255) + ','+ Math.round(b * 255)+ ')';
}