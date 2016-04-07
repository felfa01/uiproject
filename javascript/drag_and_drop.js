/**
 * File: drag_and_drop.js
 *
 * This file contains the javaScript needed for drag and drop functionality
 * as well as the order lists.
 *
 * Version 1.0
 * Author: Mikael Holmberg
 */

// On web page load, an initial order list is created with undomanager.
window.onload = function () {
	var undoID = 0;
	var start = new Date;
	var undoManager, 
	beers_order = [], 
	addBeer,
	undobeers,
	removeBeer,
	removeAll,
	createBeer; 
	undoManager = new UndoManager();
	// function for removing a beer from order list
	var removeBeer = function(id) {
		var i = 0, index = -1;
		for (i = 0; i < beers_order.length; i += 1) {
			if (beers_order[i].id === id) {
				index = i;
			}
		}
		if (index !== -1) {
			beers_order.splice(index, 1);
		}
	};
	//function for reordering the order list.
	var reorderBeer = function(id){
		var currIndex = undoManager.getIndex();
		var beer;
		var i = 0, index = -1;
		console.log(beers_order)
		for (i = 0; i < beers_order.length; i += 1) {
			if (beers_order[i].beer_id === id) {
				index = i;
				beer = beers_order[i];
			}
		}
		if (index !== -1) {
			beers_order.splice(index, 1);
		}
		beers_order[currIndex] = beer;
		undoManager.undo();
		//undoManager.decIndex();
		console.log(beers_order);
	//	undoManager.undo();
}

var removeAll = function(){
	beers_order=[];
}
// Creates entry in order list with parameters id, beer_id, namn and price taken from database
var createBeer = function(id, beer_id, namn, price) {

	beers_order.push({"id": id, "beer_id": beer_id, "namn":namn, "price":price});
	undoID = id + 1;

	undoManager.add({
		undo: function() {
			removeBeer(id)
		},
		redo: function() {
			createBeer(id, beer_id, namn, price);
		},
		clear: function() {
			alert("HEJ")
			} /*,
			del: function(beer_id){
				reorderBeer(beer_id);
			} */
		});

}

// Below is various events that can happen during the process of drag and dropping, along with what should happen when an event has been "heard"
document.addEventListener("dragstart", function(event) {
	if ( event.target.className == "draggable" || $(event.target).parents().hasClass("draggable") ) {
		($(event.target).hasClass("draggable")) ? event.dataTransfer.setData("text", event.target.id) : event.dataTransfer.setData("text", $(event.target).parents(".draggable").attr("id"));
		event.target.style.opacity = "0.4";
	}
});

document.addEventListener("drag", function(event) {
	document.getElementById("order-list").style.outline = "1px dotted lightblue";
});

document.addEventListener("dragend", function(event) {
	if ( event.target.className == "draggable" || $(event.target).parents().hasClass("draggable") ) {
		event.target.style.opacity = "1";
	}
});

document.addEventListener("dragenter", function(event) {
	if ( event.target.className == "droptarget" || $(event.target).parents().hasClass("droptarget") ) {
		
	}
});

document.addEventListener("dragover", function(event) {
	event.preventDefault();
	if ( event.target.className == "droptarget" || $(event.target).parents().hasClass("droptarget") ) {
		document.getElementById("order-list").style.outline = "1px solid lightblue";
	}
});

document.addEventListener("dragleave", function(event) {
	if ( event.target.className == "droptarget" || $(event.target).parents().hasClass("droptarget") ) {
		event.target.style.border = "";
	}
});

document.addEventListener("drop", function(event) {
	event.preventDefault();
	document.getElementById("order-list").style.outline = "";
	var data = event.dataTransfer.getData("text");
	var element = document.getElementById(data).cloneNode(true);
	event.target.style.border = "";
	checkToAdd(data, 5, element);

	if($(event.target).hasClass("droptarget")){
		createOrderList($(event.target))
	}
	else{ 
		createOrderList($(event.target).parents(".droptarget"));
	}


});


// Along with the order list, there is another list which acts as a summary of orders before committing to the purchase.
// createOrderList function takes the orderlist entries into this new list, along with sum of beer costs.
function createOrderList($list){
	setTimeout(function(){}, 2000);
	$list.find("tbody").html("");

	$.each(beers_order,function(index, beer){
		if(beer){
			console.log("index: " + index + " noticed. Beer: " + beer.namn)
			if($list.find("#" + beer.beer_id).length == 0) {
				$list.find("tbody").append("<tr id='" + beer.beer_id + "'><td>" + beer.namn + "</td><td id='price'>"+ beer.price +"</td><td id='counter'>1</td><td><i class='delBeer fa fa-times fa-1x'></i></td></tr>");
			}else{
				var $counter = $list.find("#"+  beer.beer_id).find("#counter");
				$counter.html(parseInt(
					$counter.html()) + 1)
			}
		}
	});
	$(".delBeer").on("click", function(){
		reorderBeer($(this).parents("tr").attr("id"));
		createOrderList($('#order-list'));
		updateUI();
	});
	calcSum($('#order-list tbody tr'), $('#order-list tfoot #total'));
}

function checkToAdd(beer_id, maxQuantity, element){	
	if(Object.keys(beers_order).length < maxQuantity){
		createBeer(Math.floor((Math.random() * 10) + 1), beer_id, $(element).find('#brand').html(), $(element).find('#price').html());
		updateUI();
	}
	console.log("checkToAdd done")
}

function calcSum($target, $footer){
	var sumPrice = 0;
	$target.each(function(){
		sumPrice = sumPrice + (parseInt($(this).find("#counter").html()) * parseFloat($(this).find("#price").html()));
		
	});
	$footer.html(sumPrice.toFixed(2));
}

function checkCount(){
	var count = 0;
	$('#order-list tbody tr').each(function(){
		count = count + parseInt($(this).find("#counter").html());
		
	});
	$('#confirm-table tbody tr').each(function(){
		count = count + parseInt($(this).find("#counter").html());
		
	});
	return count;
}
// Modifies the pubs database for newly purchased beers from customer.
function sendOrder(beer_id){
	$.ajax({
		url: "http://pub.jamaica-inn.net/fpdb/api.php?username="+urlParams["username"]
		+"&password="+urlParams["password"]+"&beer_id="+ beer_id +"&action=purchases_append",
		type: 'post',
		success: function(data) {
			if(data.type === "error"){
				alert(data.payload[0].msg);
			}else{
			}
		}	
	});
}

var startT;
var startH;
var startM;
var startS;

function initializeTime() {
	startT = new Date();
	startH = startT.getHours();
	startM = startT.getMinutes();
	startS = startT.getSeconds();
	startM = checkTime(startM);
	startS = checkTime(startS);
}

function startTime() {
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	m = checkTime(m);
	s = checkTime(s);
	document.getElementById('orderTimer').innerHTML = Math.abs(m - startM) + ":" + Math.abs(s - startS);
	var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

btnUndo = document.getElementById("undoBtn");
btnRedo = document.getElementById("redoBtn");

function updateUI() {
	btnUndo.disabled = !undoManager.hasUndo();
	btnRedo.disabled = !undoManager.hasRedo();
}


$("#undoBtn").click(function() {
	undoManager.undo();
	console.log("UNDO: " + beers_order);
	createOrderList($('#order-list'));
	updateUI();

});

$("#redoBtn").click(function() {
	undoManager.redo();
	console.log("REDO: " + beers_order);
	createOrderList($('#order-list'));
	updateUI();
});


$("#orderBtn").click(function() {
	if(checkCount() > 5){
		alert("The number of beers exceds maximum limit of 5.")
	}else{
		$('#confirm-table tbody').append($('#order-list tbody').html());
		calcSum($('#confirm-table tbody tr'), $('#confirm-table tfoot #total'));
		//initializeTime();
		//startTime();
	}
});

$("#clearBtn").click(function() {
	undoManager.clear()
	beers_order = [];
	console.log("Clear: " + beers_order);
	createOrderList($('#order-list'));
	updateUI();
});

$("#cancelBtn").click(function() {
	$('#confirm-table tbody').html("");
	$('#confirm-table tfoot td').html(0);
});

$("#confirmBtn").click(function() {
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+urlParams["username"]+"&password="+urlParams["password"]+"&action=iou_get";
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		if(data.type == "error"){
			alert(data.payload[0].msg)
		}else{
			if(parseFloat($("#usrCredit").html()) > parseFloat($('#confirm-table tfoot td').html())){
				$('#confirm-table tbody tr').each(function(){
					for(var i=0;i < parseInt($(this).find("#counter").html()); i++){
						sendOrder($(this).attr("id"));
					}
				});
				$('#confirm-table tbody').html("");
				$('#confirm-table tfoot td').html(0);
				getCredit(urlParams["username"], urlParams["password"]);
			}else{
				alert("You do not have enough credits! Please refill.")
			}
		}
	});
	
});

$("#orderNowBtn").click(function() {
	$('#order-list tbody tr').each(function(){
		for(var i=0;i < parseInt($(this).find("#counter").html()); i++){
			sendOrder($(this).attr("id"));
		}
	});
	undoManager.clear();
	beers_order = [];
	createOrderList($('#order-list'));
});

}