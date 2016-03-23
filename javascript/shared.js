/**
* File: shared.js
*
* This file contains the javaScript needed to handle the shared functionallity for the homepage.
* Such as quick order and parsing the url for parameters.
*
* Version 1.0 
* Author: Mikael Holmberg
*/


var creditAdd=0;
var quick_creditAdd =0;



$( document ).ready(function() {
// Close the modals when the close button is clicked and reset the form on the modals
//

setInterval(function(){
	if($(".tooltip-panel").is(":hidden")){
		checkStock(urlParams["username"], urlParams["password"])
	}
}, 3000); 


$(".close").on("click", function(){
	$(".modal").css('display','none');	
	$('form').trigger("reset");	
});
// open or collapse the quick order sidebar.
//
$("#collapse-qo").on("click", function(){
	if(!$('#sidebar-qo').is(':visible'))
	{
		$("#sidebar-qo").animate({width:'toggle'},500);
		getQuickOrder(urlParams["username"], urlParams["password"]);
	}else{
		$("#sidebar-qo").animate({width:'toggle'},500);;
	}	
});

$("#collapse-credit").on("click", function(){
	if(!$('#sidebar-credit').is(':visible'))
	{
		$("#sidebar-credit").animate({width:'toggle'},500);
	}else{
		$("#sidebar-credit").animate({width:'toggle'},500);;
	}	
});

// If a modal is open it will close if the user clicks outside the open modal.
//
window.onclick = function(event) {
	if (event.target == document.getElementById('usrModal') || event.target == document.getElementById('creditModal')
		|| event.target == document.getElementById('stockModal') ) {
		$(".modal").css('display','none');
	$(".tooltip-panel").css('display','none');

	$('form').trigger("reset");
	creditAdd = 0;
}
if (!$(event.target).parents('.tooltip-panel').length){
	$(".tooltip-panel").css('display','none');

}
}
$("input[name='quick_username_credit']").focusout(function() {
	if($("input[name='quick_username_credit']").val() != "" && $("input[name='quick_pwd_credit']").val() != "")
		getQuickCredit($("input[name='quick_username_credit']").val(), $("input[name='quick_pwd_credit']").val())
});
$("input[name='quick_pwd_credit']").focusout(function() {
	if($("input[name='quick_username_credit']").val() != "" && $("input[name='quick_pwd_credit']").val() != "")
		getQuickCredit($("input[name='quick_username_credit']").val(), $("input[name='quick_pwd_credit']").val())
});

$("input[name='quick_add_credit']").bind('input', function() { 
	if($(this).val() != ""){
		$("input[name='quick_new_credit']").val(parseFloat($(this).val()) + parseFloat(quick_creditAdd));
	}else{
		$("input[name='quick_new_credit']").val(quick_creditAdd);
	}
});

$( ".quick_creditForm" ).submit(function( event ) {
	event.preventDefault();
	$.ajax({
		url: "http://pub.jamaica-inn.net/fpdb/api.php?username="+$("input[name='quick_username_credit']").val()
		+"&password="+$("input[name='quick_pwd_credit']").val()+"&amount="+$("input[name='quick_new_credit']").val()+"&action=payments_append",
		type: 'post',
		success: function(data) {
			if(data.type === "error"){
				alert("error!!")
			}else{
				alert(data);
				$('.quick_creditForm').trigger("reset");
			}
		}	
	});
});


});



// Gets the jsonobject for all the current purchases in the system and filter out the top 4(based on count) of those as these
// are observed as the most popular beers.
//
//

function checkStock(username, pwd){
	
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=inventory_get";
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		if(sessionStorage.outOfstock !== JSON.stringify(data.payload)){
			$('#stock-menu').html("")
			sessionStorage.setItem('outOfstock', JSON.stringify(data.payload));
			//sessionStorage.outOfstock = data.payload;
			jQuery.each(data.payload, function(i, beer) {
				if(beer.namn != "" && parseInt(beer.count) < 10 ){
					$('#stock-menu').append("<li>" + beer.namn + ((beer.namn2 != "") ? " - " + beer.namn2 +": ": ": ") + beer.count + ". </li>")
				}

			});
			if (!$('#stock-menu').is(':empty')){
$('#tooltip-stock').show();
				$('#tooltip-stock').animate({height:'500px'},2000);
			}else{
				$('#tooltip-stock').animate({height:'toggle'},500);
			}
		}

	});

} 

function getQuickCredit(username, pwd){
	quick_creditAdd = 0;
	$.ajax({
		url: "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=iou_get",
		type: 'post',
		success: function(data) {
			console.log(data.type)	
			if(data.type != "error"){
				quick_creditAdd = data.payload[0].assets;
				$("input[name='quick_new_credit']").attr("value", data.payload[0].assets);
			}else{
				alert(data.payload[0]["msg"])
			}
		}	
	});
}


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