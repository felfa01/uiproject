
$( document ).ready(function() {
	getBeers(urlParams["username"], urlParams["password"]);

});



function getBeers(username, pwd){

		$("#stock-table tbody").html("")
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=inventory_get";
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		data.payload.sort(SortByName);
		jQuery.each(data.payload, function(i, beer) {
			if(beer.namn != "" && beer.namn2 !="")
		$('#beer-list').append("<li id='"+ beer.beer_id + "' draggable='true' ondragstart='drag(event)'>" + beer.namn +"</li>")

	});

	});

}


function SortByName(x,y) {
	var a = x.namn.toLowerCase() + x.namn2.toLowerCase();
	var b = y.namn.toLowerCase() + y.namn2.toLowerCase();
	return ((a == b) ? 0 : ((a > b) ? 1 : -1 ));
}
