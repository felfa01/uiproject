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
	getInventory(urlParams["username"], urlParams["password"], $('.statistic-form input[type=radio]:checked').val());
$("input[name=stat]:radio").change(function () {
	getInventory(urlParams["username"], urlParams["password"], $('.statistic-form input[type=radio]:checked').val());

});

});


function getInventory(username, pwd, choice){
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=purchases_get_all";
	var beersToShow=[];
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		if(data.type == "error"){
			alert(data.payload[0].msg)
		}else{
		var totalCount = 0; // Count the total amount of the beers choosen, used to create graphs later on
		var coloArr =[]; // Color for each beer.
		var beers = countBeer(data.payload);
		console.log(beers)
		jQuery.each(beers, function(i, beer) {
			//Only use beer with a higher count than 200 and that is named
			//TODO: Use of parameter?
			//
				var cpyBeer = beer; 
				totalCount = totalCount + parseInt(beer.count); 
				beersToShow.push(cpyBeer);
			

		});		
		colorArr = distinctColors(beersToShow.length) // Get the colors
		switch(choice){
			case "1":
		fillPieChart(totalCount, colorArr, beersToShow); // Fill the pie chart
		break;
		case "2":
		fillBarChart(totalCount, colorArr, beersToShow); // Fill the pie chart
		break;
		default:
		alert("No choice taken!");
		break;
}
	}
	});
}

//Fills the pie chart with the procentage of each beer in the stock
function fillPieChart(totCount, colorArr, beers){
$("#cvs2").hide();
$("#graph-info").html("");
$("#graph-info").show();
$("#cvs").show();
var canvas;
var ctx;
var lastend = 0;
console.log(totCount)
console.log(colorArr)
canvas = document.getElementById("cvs");
var height = canvas.height/2;
var width = canvas.width/2;
ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);

jQuery.each(beers, function(i, beer) {
ctx.fillStyle = colorArr[i]; // Color to fill the area with
ctx.beginPath();
ctx.moveTo(height,width); //Start point of path
ctx.arc(height,width,width,lastend,lastend+
  (Math.PI*2*(parseInt(beer.count)/totCount)),false);  // context.arc(x-center,y-center,radius,starting angle,ending angle);
ctx.lineTo(height,width); // make line to startpoint
ctx.fill(); // fill canvas
lastend += Math.PI*2*(parseInt(beer.count)/totCount); // save end point of last slice
$("#graph-info").append("<li class='graph-info-box'><span class='graph-color-box' style='background-color:" + colorArr[i]+"'></span>- "+ beer.namn +", " + beer.namn2 + "<strong> - " + ((parseInt(beer.count)/totCount)*100).toFixed(2) +"%<strong></li>");
});
}

function fillBarChart(totCount, colorArr, beers){
$("#cvs").hide();
$("#cvs2").show();
$("#graph-info").hide();
var canvas;
var ctx;
var lastend = 0;

var width = 70;
var spacing = 10;
var totWidth = (beers.length) * (width+spacing);

canvas = document.getElementById("cvs2");
canvas.width = totWidth;

ctx = canvas.getContext("2d");
ctx.textAlign = "center";
ctx.font = "10px Arial";
ctx.clearRect(0, 0, canvas.width, canvas.height);
jQuery.each(beers, function(i, beer) {
	ctx.fillStyle = colorArr[i];
ctx.fillRect(lastend, 300, width, -((parseInt(beer.count)/totCount)*3000));
//ctx.fillText( beer.namn,lastend,400);
ctx.fillStyle = "black";
wrapText(ctx, beer.namn + " " +((parseInt(beer.count)/totCount)*100).toFixed(2) +"%", lastend + spacing + (width/3), 320, (width), 15)
lastend += width + spacing;
});
console.log(totWidth);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(" ");
        var line = "";
        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + " ";
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if(testWidth > maxWidth) {
            context.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
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