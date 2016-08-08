/**
 * File: navigation.js
 *
 * This file contains javascript for getting information on beverages connected to a specific user, such as favorite beverage.
 * 
 *
 * Version 1.0
 * Author: Group FD
 */

$( document ).ready(function() {
	$("#collapse-order").on("click", function(){
		if(!$('#sidebar-order').is(':visible'))
		{
			$("#sidebar-order").animate({width:'toggle'},500);
			getOrders(urlParams["username"], urlParams["password"]);
		}else{
			$("#sidebar-order").animate({width:'toggle'},500);;
		}	
	});
	$("#collapse-fav").on("click", function(){
		if(!$('#sidebar-fav').is(':visible'))
		{
			$("#sidebar-fav").animate({width:'toggle'},500);
			getFavorites(urlParams["username"], urlParams["password"]);
		}else{
			$("#sidebar-fav").animate({width:'toggle'},500);;
		}	
	});
	getCredit(urlParams["username"], urlParams["password"]);

});

// Returns credit of a user
function getCredit(username, pwd){
		$("#usrCredit").html("");
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=iou_get";
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		if(data.type == "error"){
			alert(data.payload[0].msg)
		}else{
			$("#usrCredit").html(data.payload[0].assets + " Credit(s)");
		}
	});
}
//Returns orders of a user
function getOrders(username, pwd){
	$("#order-table tbody").html("")
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=purchases_get";
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		if(data.type == "error"){
			alert(data.payload[0].msg)
		}else{
			var beers = countBeer(data.payload);
			console.log(beers)
			jQuery.each(beers, function(i, beer) {
				$("#order-table tbody").append("<tr id='"+ i +"'><td id='beer_id' hidden>"+ beer.beer_id+"</td><td id='namn'>"+ beer.namn
					+"</td><td id='namn2'>"+ beer.namn2 +"</td><td id='price'>"+ beer.price + "<td>"+ beer.timestamp+"</td></td></tr>");
			}); 
		}
	});
}
// Returns users favorite beverages
function getFavorites(username, pwd){
	var favs = JSON.parse(sessionStorage.getItem("favorites"));
	$("#fav-table tbody").html("")
	jQuery.each(favs, function(i, beer_id) {
		url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+urlParams["username"]
		+ "&password="+urlParams["password"]+"&beer_id="+beer_id+"&action=beer_data_get";
		$.getJSON( url, {
			format: "json"
		}).done(function(data) {
			if(data.type == "error"){
				alert(data.payload[0].msg)
			}else{
				var beer = data.payload[0];
				$("#fav-table tbody").append("<tr id='"+ i +"'><td id='beer_id' hidden>"+ beer.nr+"</td><td id='namn'>"+ beer.namn
					+"</td><td id='namn2'>"+ beer.namn2 +"</td><td id='price'>"+ beer.prisinklmoms + 
					"</td><td><i class='addBeerFav fa fa-plus fa-2x'></i><i class='fav-nr-of-beers fa fa-2x'> 0</i><i class='minusBeerFav fa fa-minus fa-2x'></i></td></tr>");

			}
		});
	}); 
	$(document).ajaxStop(function () { 
		$(".addBeerFav").on("click", function(){
			$(this).siblings(".fav-nr-of-beers").html(parseInt($(this).siblings(".fav-nr-of-beers").html())+1);			
		});
		$(".minusBeerFav").on("click", function(){
			if(parseInt($(this).siblings(".fav-nr-of-beers").html()) > 0){
				$(this).siblings(".fav-nr-of-beers").html(parseInt($(this).siblings(".fav-nr-of-beers").html())-1);		
			}	
		});
		$("#fav-submit").on("click", function(){
			$('#fav-table > tbody  > tr').each(function() {
				var nrOfBeers = parseInt($(this).find(".fav-nr-of-beers").html());
				var beer_id = $(this).children("#beer_id").html();
				for (var i = 0; i < nrOfBeers; i++) {
					$.ajax({
						url: "http://pub.jamaica-inn.net/fpdb/api.php?username="+urlParams["username"]
						+"&password="+urlParams["password"]+"&beer_id="+beer_id+"&action=purchases_append",
						type: 'post',
						async:false,						
						success: function(data) {
							if(data.type === "error"){
								alert("error!!")
							}else{
								console.log(data.type);
							}
						}	
					});
				};
				$(this).find(".fav-nr-of-beers").html(0);
			});

		});

		$("#fav-reset").on("click", function(){
			$('#fav-table > tbody  > tr').each(function() {
				$(this).find(".fav-nr-of-beers").html(0);			
			});
		});
	});


}
