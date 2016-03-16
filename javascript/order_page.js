
var extendedData = [];

$( document ).ready(function() {
	extendedData = [];
	getBeers(urlParams["username"], urlParams["password"]);

});



function getBeers(username, pwd){
	
	$("#beer-table tbody").html("")
	$('#beer-table tbody').append("<center><i class='fa fa-beer fa-pulse fa-4x'></i><i class='fa fa-3x'></i> </center>")
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=inventory_get";
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		data.payload.sort(SortByName);		
		jQuery.each(data.payload, function(i, beer) {
			if(beer.namn == "" && beer.namn2 ==""){
				i -= 1;
			}else{
				getExtended(beer.beer_id);
			}
			if(i>50){
				return false;
			}
		}); 
		$("input[name='leverantor_search']").prop('disabled', true);
		$("input[name='brand_search']").prop('disabled', true);
		$("input[name='price_search']").prop('disabled', true);
		$("input[name='alco_search']").prop('disabled', true);
		$(document).ajaxStop(function () { 
			$("input[name='brand_search']").prop('disabled', false);
			$("input[name='leverantor_search']").prop('disabled', false);
			$("input[name='price_search']").prop('disabled', false);
			$("input[name='alco_search']").prop('disabled', false);
			fillBeertable(extendedData);
			$("input[name='brand_search']").bind('input', function() { 	
				var beers = searchBeers(extendedData, $("input[name='brand_search']").val(), $("input[name='leverantor_search']").val(),
					$("input[name='price_search']").val(), $("input[name='alco_search']").val(), $("input[name='allergies']").is(":checked"));
				if(beers.length > 0)
					fillBeertable(beers);
			});
			$("input[name='leverantor_search']").bind('input', function() { 				
				var beers = searchBeers(extendedData, $("input[name='brand_search']").val(), $("input[name='leverantor_search']").val(),
					$("input[name='price_search']").val(), $("input[name='alco_search']").val(), $("input[name='allergies']").is(":checked"));
				if(beers.length > 0)
					fillBeertable(beers);	
			});
			$("input[name='price_search']").bind('input', function() { 	
				var beers = searchBeers(extendedData, $("input[name='brand_search']").val(), $("input[name='leverantor_search']").val(),
					$("input[name='price_search']").val(), $("input[name='alco_search']").val(), $("input[name='allergies']").is(":checked"));
				if(beers.length > 0)
					fillBeertable(beers);
			});
			$("input[name='alco_search']").bind('input', function() { 				
				var beers = searchBeers(extendedData, $("input[name='brand_search']").val(), $("input[name='leverantor_search']").val(),
					$("input[name='price_search']").val(), $("input[name='alco_search']").val(), $("input[name='allergies']").is(":checked"));
				if(beers.length > 0)
					fillBeertable(beers);	
			});
			$("input[name='allergies']").change(function() {
				var beers = searchBeers(extendedData, $("input[name='brand_search']").val(), $("input[name='leverantor_search']").val(),
					$("input[name='price_search']").val(), $("input[name='alco_search']").val(), $("input[name='allergies']").is(":checked"));
				if(beers.length > 0)
					fillBeertable(beers);
			});
		});
});

}

function searchBeers(beers, brand, leverantor, price, alco, allergies){
	var result = []
	for (i = 0; i < beers.length; i++) {
		if(allergies && ((i%10)!==0)){
			console.log("MODOOOOOLOUOU")
		}else{
			if(brand != "" && leverantor != "" && price != "" && alco != ""){
				if(beers[i]["namn"].toLowerCase().includes(brand.toLowerCase()) && beers[i]["leverantor"].toLowerCase().includes(leverantor.toLowerCase())
					&& parseFloat(beers[i]["prisinklmoms"]) < parseFloat(price) && parseFloat(beers[i]["alkoholhalt"]) < parseFloat(alco))
					result.push(beers[i]);
			}else if(brand != "" && leverantor != "" && price != ""){
				if(beers[i]["namn"].toLowerCase().includes(brand.toLowerCase()) && beers[i]["leverantor"].toLowerCase().includes(leverantor.toLowerCase())
					&& parseFloat(beers[i]["prisinklmoms"]) < parseFloat(price))
					result.push(beers[i]);
			}else if(brand != "" && leverantor != "" && alco != ""){
				if(beers[i]["namn"].toLowerCase().includes(brand.toLowerCase()) && beers[i]["leverantor"].toLowerCase().includes(leverantor.toLowerCase())
					&& parseFloat(beers[i]["alkoholhalt"]) < parseFloat(alco))
					result.push(beers[i]);
			}else if(brand != "" && price != "" && alco != ""){	
				if(beers[i]["namn"].toLowerCase().includes(brand.toLowerCase()) && parseFloat(beers[i]["prisinklmoms"]) < parseFloat(price)
					&& parseFloat(beers[i]["alkoholhalt"]) < parseFloat(alco))
					result.push(beers[i]);				
			}else if(brand != "" && leverantor != ""){
				if(beers[i]["namn"].toLowerCase().includes(brand.toLowerCase()) && beers[i]["leverantor"].toLowerCase().includes(leverantor.toLowerCase()))
					result.push(beers[i]);
			}else if(brand != "" && price != ""){
				if(beers[i]["namn"].toLowerCase().includes(brand.toLowerCase())&& parseFloat(beers[i]["prisinklmoms"]) < parseFloat(price))
					result.push(beers[i]);
			}else if(brand != "" && alco != ""){	
				if(beers[i]["namn"].toLowerCase().includes(brand.toLowerCase()) && parseFloat(beers[i]["alkoholhalt"]) < parseFloat(alco))
					result.push(beers[i]);		
			}else if(brand != ""){
				if(beers[i]["namn"].toLowerCase().includes(brand.toLowerCase()))
					result.push(beers[i]);
			}else if(leverantor != "" && price != "" && alco != ""){
				if(beers[i]["leverantor"].toLowerCase().includes(leverantor.toLowerCase()) && parseFloat(beers[i]["prisinklmoms"]) < parseFloat(price) && parseFloat(beers[i]["alkoholhalt"]) < parseFloat(alco))
					result.push(beers[i]);
			}else if(leverantor != "" && price != ""){
				if(beers[i]["leverantor"].toLowerCase().includes(leverantor.toLowerCase())&& parseFloat(beers[i]["prisinklmoms"]) < parseFloat(price))
					result.push(beers[i]);
			}else if(leverantor != "" && alco != ""){
				if(beers[i]["leverantor"].toLowerCase().includes(leverantor.toLowerCase()) && parseFloat(beers[i]["alkoholhalt"]) < parseFloat(alco))
					result.push(beers[i]);
			}else if(leverantor != ""){
				if(beers[i]["leverantor"].toLowerCase().includes(leverantor.toLowerCase()))
					result.push(beers[i]);
			}else if(price != "" && alco != ""){
				if(parseFloat(beers[i]["prisinklmoms"]) < parseFloat(price) && parseFloat(beers[i]["alkoholhalt"]) < parseFloat(alco))
					result.push(beers[i]);
			}else if(price != ""){
				if(parseFloat(beers[i]["prisinklmoms"]) < parseFloat(price))
					result.push(beers[i]);
			}else if(alco != ""){
				if(parseFloat(beers[i]["alkoholhalt"]) < parseFloat(alco))
					result.push(beers[i]);
			}else{
				result.push(beers[i]);
			}
		}
	}
	console.log(result);
	return result;
}

function fillBeertable(beers){
	$("#beer-table tbody").html("")
	jQuery.each(beers, function(i, beer) {
		if(beer.namn == "" && beer.namn2 ==""){
			i -= 1;
		}else{
			if((i%3) == 0){
				$('#beer-table tbody').append("<tr><td class='draggable beer-element' id='"+ beer.beer_id + 
					"' draggable='true' tabindex='" + i +"'><img src='../images/beer.png'></img>"+
					"<ul><li id='brand'>" +
					((beer.namn2 != "")? beer.namn + ", " + beer.namn2: beer.namn) +"</li><li><span id='price'>"+ beer.prisinklmoms + "</span> SEK</li></ul></td></tr>");
			}else{ 
				$('#beer-table tbody tr').last().append("<td class='draggable beer-element' id='"+ beer.beer_id +
					"' draggable='true' tabindex='" + i +"'><img src='../images/beer.png'></img>"+
					"<ul><li id='brand'>" +
					((beer.namn2 != "")? beer.namn + ", " + beer.namn2: beer.namn) +"</li><li><span id='price'>"+ beer.prisinklmoms + "</span> SEK</li></ul></td>");
			}
			$('#beer-table tbody').find("#"+beer.beer_id).data("extendData", {"namn": ((beer.namn2 != "")? beer.namn + ", " + beer.namn2: beer.namn),
				"price": beer.prisinklmoms, "alkoholhalt": beer.alkoholhalt, "leverantor": beer.leverantor});
		}
	});
$(".beer-element").focus(function() {
	fillCollapse($(this), $(this).attr("id"))
});
}



function fillCollapse($target, beer_id){
	$(".beer-collapse").remove();
	var value = $('#beer-table tbody').find("#"+beer_id).data("extendData");
	$target.parents('tr').after("<tr class='beer-collapse'><td><img src='../images/beer.png'></img></td><td><ul><li>"+ 
		value["namn"] + "</li><li>"+ 
		value["alkoholhalt"]  + "</li><li>"+ value["price"] +" SEK</li><li>"+value["leverantor"]+"</li></ul></td></tr>");
}

function getExtended(beer_id){
	var result = null;
	$.ajax({
		url: "http://pub.jamaica-inn.net/fpdb/api.php?username="+urlParams["username"]
		+"&password="+urlParams["password"]+"&beer_id="+beer_id+"&action=beer_data_get",
		type: 'post',
		success: function(data) {
			if(data.type === "error"){
				alert(data.payload[0].msg)
			}else{
				var beer = data.payload[0];
				beer["beer_id"] = beer_id;
				extendedData.push(beer);
			}
		}	
	});	
};

function SortByName(x,y) {
	var a = x.namn.toLowerCase() + x.namn2.toLowerCase();
	var b = y.namn.toLowerCase() + y.namn2.toLowerCase();
	return ((a == b) ? 0 : ((a > b) ? 1 : -1 ));
}

