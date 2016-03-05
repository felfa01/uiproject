
var creditAdd = 0;
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
					alert(data.type);
					$('form').trigger("reset");
					$(".modal").css('display','none');
					getStock(urlParams["username"], urlParams["password"], "","");
				}
			}	
		});
	});

	$("input[name='brand_search']").bind('input', function() { 
			getStock(urlParams["username"], urlParams["password"], $("input[name='brand_search']").val(), $("input[name='name_search']").val());
		
	});
	$("input[name='name_search']").bind('input', function() { 
			getStock(urlParams["username"], urlParams["password"],$("input[name='brand_search']").val(), $("input[name='name_search']").val());
		
	});
});


function fillStock(i, beer){
	$("#stock-table tbody").append("<tr id='"+ i +"'><td id='beer_id' hidden>"+ beer.beer_id+"</td><td id='namn'>"+ beer.namn
		+"</td><td id='namn2'>"+ beer.namn2
		+"</td><td id='sbl_price'>"+ beer.sbl_price +"</td><td id='pub_price'>"+ beer.pub_price 
		+"</td><td id='price'>"+ beer.price +"</td><td id='count'>"+ beer.count
		+"</td><td><i class='editStock fa fa-pencil-square-o fa-2x'></i></td></tr>");

}

function getStock(username, pwd, brand, name){
	$("#stock-table tbody").html("")
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=inventory_get";
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		data.payload.sort(SortByName);
		if(brand == "" && name == ""){
			jQuery.each(data.payload, function(i, beer) {
				if(beer.namn != "" && beer.namn2 != ""){
					fillStock(i, beer);
				}

			});
		}else if(brand != "" && name != ""){
			jQuery.each(data.payload, function(i, beer) {
				if(beer.namn2.toLowerCase().includes(name.toLowerCase()) && beer.namn.toLowerCase().includes(brand.toLowerCase())){
					fillStock(i, beer);
				}
			});			
		}else if(brand != "" && name == ""){
			jQuery.each(data.payload, function(i, beer) {
				if( beer.namn.toLowerCase().includes(brand.toLowerCase())){
					fillStock(i, beer);
				}
			});
		}else{
				jQuery.each(data.payload, function(i, beer) {
				if( beer.namn2.toLowerCase().includes(name.toLowerCase())){
					fillStock(i, beer);
				}
			});
		}
		$(".editStock").on("click", function(){
			$("input[name='beer_id']").attr("value",$(this).closest("tr").children("#beer_id").html());
			$("input[name='price']").attr("value",$(this).closest("tr").children("#pub_price").html());
			$("input[name='amount']").attr("value",$(this).closest("tr").children("#count").html());
			$("#beer_name").html($(this).closest("tr").children("#namn2").html() + ", " + $(this).closest("tr").children("#namn").html())
			
			$('#stockModal').css('display','block');
		});
	});
}

function SortByName(x,y) {
	var a = x.namn.toLowerCase() + x.namn2.toLowerCase();
	var b = y.namn.toLowerCase() + y.namn2.toLowerCase();
	return ((a == b) ? 0 : ((a > b) ? 1 : -1 ));
}


