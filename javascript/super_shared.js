
function getQuickOrder(username, pwd){
	$("#QO-table tbody").html("")
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=purchases_get_all";
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		if(data.type == "error"){
			alert(data.payload[0].msg)
		}else{
			var beers = countBeer(data.payload);
			beers = extractTopFour(beers);

			jQuery.each(beers, function(i, beer) {
				$("#QO-table tbody").append("<tr id='"+ i +"'><td id='beer_id' hidden>"+ beer.beer_id+"</td><td id='namn'>"+ beer.namn
					+"</td><td id='namn2'>"+ beer.namn2 +"</td><td id='price'>"+ beer.price + 
					"</td><td><i class='addBeer fa fa-plus fa-2x'></i><i class='qo-nr-of-beers fa fa-2x'> 0</i><i class='minusBeer fa fa-minus fa-2x'></i></td></tr>");
			}); 
			$(".addBeer").on("click", function(){
				$(this).siblings(".qo-nr-of-beers").html(parseInt($(this).siblings(".qo-nr-of-beers").html())+1);			
			});
			$(".minusBeer").on("click", function(){
				if(parseInt($(this).siblings(".qo-nr-of-beers").html()) > 0){
					$(this).siblings(".qo-nr-of-beers").html(parseInt($(this).siblings(".qo-nr-of-beers").html())-1);		
				}	
			});
			$("#qo-submit").on("click", function(){
				$('#QO-table > tbody  > tr').each(function() {
					var nrOfBeers = parseInt($(this).find(".qo-nr-of-beers").html());
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
					$(this).find(".qo-nr-of-beers").html(0);
				});

			});

			$("#qo-reset").on("click", function(){
				$('#QO-table > tbody  > tr').each(function() {
					$(this).find(".qo-nr-of-beers").html(0);			
				});
			});
		}
	});
}



function SortQuickOrder(x,y) {
	var a = x.namn.toLowerCase() + x.namn2.toLowerCase();
	var b = y.namn.toLowerCase() + y.namn2.toLowerCase();
	return ((a == b) ? 0 : ((a > b) ? 1 : -1 ));
}

function countBeer(data){
	var countList=[];
	jQuery.each(data, function(i, beer) {
		if(checkIfExist(beer.namn,countList)){
			var index = countList.map(function(d) { return d['namn']; }).indexOf(beer.namn)
			countList[index]["count"] = countList[index]["count"] + 1; 
		}else{
			beer["count"] = 1;
			countList.push(beer);

		}
	});

	countList.sort(SortCount);
	//countList.splice(4, countList.length - 4); 
	return countList;
}

function extractTopFour(countlist){
	countlist.sort(SortCount);
	countlist.splice(4, countlist.length - 4);
	return countlist;
}

function checkIfExist(value,arr){
	for (i = 0; i < arr.length; i++) { 
		if(arr[i].namn === value){
			return true;
		}
	}
	return false;
}

function SortCount(x,y) {
	var a = x.count;
	var b = y.count;
	return (b-a);
}