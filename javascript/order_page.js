
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
			if(beer.namn == "" && beer.namn2 ==""){
				i -= 1;
			}else{
				if((i%3) == 0){
					$('#beer-table tbody').append("<tr><td class='draggable beer-element' id='"+ beer.beer_id + 
						"' draggable='true' ondragstart='drag(event)' tabindex='" + i +"'><img src='../images/beer.png'></img>"+
						"<ul><li id='brand'>" +
						((beer.namn2 != "")? beer.namn + ", " + beer.namn2: beer.namn) +"</li><li id='price'>"+ beer.price + "</li></ul></td></tr>");
				}else{
					$('#beer-table tbody tr').last().append("<td class='draggable beer-element' id='"+ beer.beer_id +
						"' draggable='true' ondragstart='drag(event)' tabindex='" + i +"'><img src='../images/beer.png'></img>"+
						"<ul><li id='brand'>" +
						((beer.namn2 != "")? beer.namn + ", " + beer.namn2: beer.namn) +"</li><li id='price'>"+ beer.price + "</li></ul></td>");

				}
			}
		});
		$(".beer-element").focus(function() {
	fillCollapse($(this), $(this).attr("id"))
});
		makeDragable();
	});

}



function fillCollapse($target, beer_id){

$.ajax({
		url: "http://pub.jamaica-inn.net/fpdb/api.php?username="+urlParams["username"]
		+"&password="+urlParams["password"]+"&beer_id="+beer_id+"&action=beer_data_get",
		type: 'post',
		success: function(data) {
			if(data.type === "error"){
				alert(data.payload[0].msg)
			}else{
				$(".beer-collapse").remove();
				console.log(data.payload[0])
				var beer = data.payload[0];
				$target.parents('tr').after("<tr class='beer-collapse'><td><img src='../images/beer.png'></img></td><td><ul><li>"+ 
					((beer.namn2 != "")? data.payload[0].namn + ", " + beer.namn2: beer.namn) + "</li><li>"+ 
					beer.alkoholhalt + "</li><li>"+ beer.prisinklmoms +"</li></ul></td></tr>");
			}
		}	
	});
}


function SortByName(x,y) {
	var a = x.namn.toLowerCase() + x.namn2.toLowerCase();
	var b = y.namn.toLowerCase() + y.namn2.toLowerCase();
	return ((a == b) ? 0 : ((a > b) ? 1 : -1 ));
}
