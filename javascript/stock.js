/**
 * File: stock.js
 *
 * This file contains the javaScript needed to show the requested (could be dependent on search fields) beers in stock
 * and handle alteration of the beers.
 *
 * Version 1.0 
 * Author: Mikael Holmberg
 */

var creditAdd = 0;

// When the document has been loaded and initialised, we get the stock of the beers in the bar.
//
$( document ).ready(function() {
	getStock(urlParams["username"], urlParams["password"], "","");
	$( ".stockForm" ).submit(function( event ) {
		event.preventDefault();
		$.ajax({
			url: "http://pub.jamaica-inn.net/fpdb/api.php?username="+urlParams["username"]
			+"&password="+urlParams["password"]+"&beer_id="+$("input[name='beer_id']").val()+
			"&amount="+$("input[name='amount']").val()+"&price="+$("input[name='price']").val()+"&action=inventory_append",
			type: 'post',
			success: function(data) {
				if(data.type === "error"){
					alert("error!!")
				}else{
					$('form').trigger("reset");
					$(".modal").css('display','none');
					getStock(urlParams["username"], urlParams["password"], "","");
				}
			}	
		});
	});

	// Change the content of the table dependent on the change of the search input for brand
	//
	$("input[name='brand_search']").bind('input', function() { 
			getStock(urlParams["username"], urlParams["password"], $("input[name='brand_search']").val(), $("input[name='name_search']").val());
		
	});

	//Change the content of the table dependent on the change of the search input for name
	//
	$("input[name='name_search']").bind('input', function() { 
			getStock(urlParams["username"], urlParams["password"],$("input[name='brand_search']").val(), $("input[name='name_search']").val());
		
	});
});

// Fills the table with name, nr in stock and different prices for each beer. Also adds a edit button for each row
//
function fillStock(i, beer){

	$("#stock-table tbody").append(((beer.count < 10) ? "<tr style='color:orange;' id='":"<tr id='") + i +"'><td id='beer_id' hidden>"+ beer.beer_id+"</td><td id='namn'>"+ beer.namn
		+"</td><td id='namn2'>"+ beer.namn2
		+"</td><td id='sbl_price'>"+ beer.sbl_price +"</td><td id='pub_price'>"+ beer.pub_price 
		+"</td><td id='price'>"+ beer.price +  "</td><td id='count'>" + beer.count
		+"</td><td><i class='editStock fa fa-pencil-square-o fa-2x'></i></td></tr>");

}

// Gets the stock from the api call.
//
function getStock(username, pwd, brand, name){
	$("#stock-table tbody").html("")
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=inventory_get";
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		data.payload.sort(SortByName);

		// get all the beers in the stock, except nameless
		if(brand == "" && name == ""){
			jQuery.each(data.payload, function(i, beer) {
				if(beer.namn != "" && beer.namn2 != ""){
					fillStock(i, beer);
				}

			});
		// get all the beers that includes the brand name, and type name	
		}else if(brand != "" && name != ""){
			jQuery.each(data.payload, function(i, beer) {
				if(beer.namn2.toLowerCase().includes(name.toLowerCase()) && beer.namn.toLowerCase().includes(brand.toLowerCase())){
					fillStock(i, beer);
				}
			});			
					// get all the beers that includes the brand name
		}else if(brand != "" && name == ""){
			jQuery.each(data.payload, function(i, beer) {
				if( beer.namn.toLowerCase().includes(brand.toLowerCase())){
					fillStock(i, beer);
				}
			});
					// get all the beers that includes the type name
		}else{
				jQuery.each(data.payload, function(i, beer) {
				if( beer.namn2.toLowerCase().includes(name.toLowerCase())){
					fillStock(i, beer);
				}
			});
		}
		// Fills out the form fields for the selected beer and opens the modal. All the values comes from the selected row
		//
		$(".editStock").on("click", function(){
			$("input[name='beer_id']").attr("value",$(this).closest("tr").children("#beer_id").html());
			$("input[name='price']").attr("value",$(this).closest("tr").children("#pub_price").html());
			$("input[name='amount']").attr("value",$(this).closest("tr").children("#count").html());
			$("#beer_name").html($(this).closest("tr").children("#namn2").html() + ", " + $(this).closest("tr").children("#namn").html())
			
			$('#stockModal').css('display','block');
		});
	});
}

// Sorts the beers on brand and name.
//
function SortByName(x,y) {
	var a = x.namn.toLowerCase() + x.namn2.toLowerCase();
	var b = y.namn.toLowerCase() + y.namn2.toLowerCase();
	return ((a == b) ? 0 : ((a > b) ? 1 : -1 ));
}


