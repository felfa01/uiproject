/**
 * File: accounts.js
 *
 * This file contains the javaScript needed to show the users
 * and handle alteration of the users.
 *
 * Version 1.0 
 * Author: Mikael Holmberg
 */

// When the document has been loaded and initialised, we get the users of the system.
//
$( document ).ready(function() {
	getUsers(urlParams["username"], urlParams["password"]);
	//On submit, update the user with the requested inputs.
	//
	$( ".usrForm" ).submit(function( event ) {
		event.preventDefault();
		$.ajax({
			url: "http://pub.jamaica-inn.net/fpdb/api.php?username="+urlParams["username"]
			+"&password="+urlParams["password"]+"&new_username="+$("input[name='new_username']").val()+
			"&new_password="+$("input[name='new_password']").val()+"&first_name="+$("input[name='first_name']").val()+
			"&last_name="+$("input[name='last_name']").val()+"&email="+$("input[name='email']").val()+
			"&phone="+$("input[name='phone']").val()+"&action=user_edit",
			type: 'post',
			success: function(data) {
				if(data.type === "error"){
					alert("error!!")
				}else{
					alert(data);
					$('form').trigger("reset");
					$(".modal").css('display','none');
					getUsers(urlParams["username"], urlParams["password"]);
				}
			}	
		});
	});

//On change, the new credit field will be updated automatically.
//
	$("input[name='add_credit']").bind('input', function() { 
		if($(this).val() != ""){
			$("input[name='new_credit']").val(parseFloat($(this).val()) + parseFloat(creditAdd));
		}else{
			$("input[name='new_credit']").val(creditAdd);
		}
	});
});



//Gets the users and fills out the table.
//
function getUsers(username, pwd){
	$("#user-table tbody").html("")
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=iou_get_all";
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		data.payload.sort(SortByName);
		jQuery.each(data.payload, function(i, usr) {
			$("#user-table tbody").append("<tr id='"+ i +"'><td id='username'>"+ usr.username +"</td><td id='firstname'>"+ usr.first_name
				+"</td><td id='lastname'>"+ usr.last_name +"</td><td id='assets'>"+ usr.assets 
				+"</td><td><i class='editUsr fa fa-pencil-square-o fa-2x'></i>  <i class='addCredit fa fa-credit-card-alt fa-2x'></i>  <i class='deleteUsr fa fa-user-times fa-2x'></i></td></tr>");
		});
		//Add defaults for the choosen user. Shows modal and form.
		//
		$(".editUsr").on("click", function(){
			$("input[name='new_username']").attr("value",$(this).closest("tr").children("#username").html());
			$("input[name='first_name']").attr("value",$(this).closest("tr").children("#firstname").html());
			$("input[name='last_name']").attr("value",$(this).closest("tr").children("#lastname").html());
			
			$('#usrModal').css('display','block');
		});
		//Add default for new credit and zero for add credit. Shows modal and form.
		//
		$(".addCredit").on("click", function(){
			$("input[name='new_credit']").attr("value",$(this).closest("tr").children("#assets").html());
			creditAdd =	$(this).closest("tr").children("#assets").html();
			$("input[name='add_credit']").attr("value","0");		
			$('#creditModal').css('display','block');
		});
		// Deletes the choosen user on confirm.
		//
		$(".deleteUsr").on("click", function(){
			confirm("Arrr!! Are you sure you want to delete seaman " + $(this).closest("tr").children("#firstname").html() + " " +
				$(this).closest("tr").children("#lastname").html() + "?")
		});

	});
}

function SortByName(x,y) {
	var a = x.last_name.toLowerCase() + x.first_name.toLowerCase();
	var b = y.last_name.toLowerCase() + y.first_name.toLowerCase();
	return ((a == b) ? 0 : ((a > b) ? 1 : -1 ));
}


