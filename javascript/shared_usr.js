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


});



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
