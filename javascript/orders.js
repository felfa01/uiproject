$( document ).ready(function() {
	getOrders(urlParams["username"], urlParams["password"]);


});
//Retrieves information on the user signed in
function getOrders(username, pwd){
	$("#order-table tbody").html("")
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=purchases_get_all";
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		if(data.type == "error"){
			alert(data.payload[0].msg)
		}else{
			var beers = countBeer(data.payload);
			console.log(beers)
			jQuery.each(beers, function(i, beer) {
				$("#orders-table tbody").append("<tr id='"+ i +"'><td id='beer_id' hidden>"+ beer.beer_id+"</td><td id='namn'>"+ beer.namn
					+"</td><td id='namn2'>"+ beer.namn2 +"</td><td id='price'>"+ beer.price + "</td><td>"+ beer.timestamp+"</td><td><i onclick='cancelOrder(this)' class='fa fa-times'></i></td></tr>");
			}); 
		}
	});
}

function cancelOrder(target){

	$.ajax({
		url: "http://pub.jamaica-inn.net/fpdb/api.php?username="+urlParams["username"]
		+"&password="+urlParams["password"]+"&action=inventory_get",
		type: 'post',
		success: function(data) {
			if(data.type === "error"){
				alert("error!!")
			}else{
				jQuery.each(data.payload, function(i, beer) {
					if(beer.beer_id === $(target).parents("tr").find("#beer_id").html()){
						var count = parseInt(beer.count);
						var namn = beer.namn + " " + beer.namn2;
						$.ajax({
							url: "http://pub.jamaica-inn.net/fpdb/api.php?username="+urlParams["username"]
							+"&password="+urlParams["password"]+"&beer_id="+$(target).parents("tr").find("#beer_id").html()+
							"&amount="+(count + 1)+"&price="+$("input[name='price']").val()+"&action=inventory_append",
							type: 'post',
							success: function(data) {
								if(data.type === "error"){
									alert("error!!")
								}else{
									alert("Order cancelled. Stock for " + namn + " increased by 1, now: " + (count+1) )
								}
							}	
						});
						return false;
					}
				});




			}
		}	
	});
$(target).parents("tr").find("#beer_id").html(); 
}