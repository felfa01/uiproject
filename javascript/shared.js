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
	$('#stock-menu').html("")
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=inventory_get";
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		if(sessionStorage.outOfstock !== JSON.stringify(data.payload)){
			sessionStorage.setItem('outOfstock', JSON.stringify(data.payload));
			//sessionStorage.outOfstock = data.payload;
			jQuery.each(data.payload, function(i, beer) {
				if(beer.namn != "" && parseInt(beer.count) < 10 ){
					$('#stock-menu').append("<li>" + beer.namn + ((beer.namn2 != "") ? " - " + beer.namn2 +": ": ": ") + beer.count + ". </li>")
				}

			});
			if (!$('#stock-menu').is(':empty')){

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