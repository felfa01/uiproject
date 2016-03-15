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

	var removeAll = function(){
		beers_order=[];
	}

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
			}
		});

	}


	document.addEventListener("dragstart", function(event) {
    // The dataTransfer.setData() method sets the data type and the value of the dragged data
    if ( event.target.className == "draggable" || $(event.target).parents().hasClass("draggable") ) {
    	($(event.target).hasClass("draggable")) ? event.dataTransfer.setData("text", event.target.id) : event.dataTransfer.setData("text", $(event.target).parents(".draggable").attr("id"));


    // Change the opacity of the draggable element
    event.target.style.opacity = "0.4";
}
});

// While dragging the p element, change the color of the output text
document.addEventListener("drag", function(event) {
	document.getElementById("order-list").style.outline = "1px dotted lightblue";
});

// Output some text when finished dragging the p element and reset the opacity
document.addEventListener("dragend", function(event) {
	if ( event.target.className == "draggable" || $(event.target).parents().hasClass("draggable") ) {
		event.target.style.opacity = "1";
	}
});


/* ----------------- Events fired on the drop target ----------------- */

// When the draggable p element enters the droptarget, change the DIVS's border style
document.addEventListener("dragenter", function(event) {
	if ( event.target.className == "droptarget" || $(event.target).parents().hasClass("droptarget") ) {
		
	}
});

// By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
document.addEventListener("dragover", function(event) {
	event.preventDefault();
	if ( event.target.className == "droptarget" || $(event.target).parents().hasClass("droptarget") ) {
		document.getElementById("order-list").style.outline = "1px solid lightblue";
	}
});

// When the draggable p element leaves the droptarget, reset the DIVS's border style
document.addEventListener("dragleave", function(event) {
	if ( event.target.className == "droptarget" || $(event.target).parents().hasClass("droptarget") ) {
		event.target.style.border = "";
	}
});

/* On drop - Prevent the browser default handling of the data (default is open as link on drop)
Reset the color of the output text and DIV's border color
Get the dragged data with the dataTransfer.getData() method
The dragged data is the id of the dragged element ("drag1")
Append the dragged element into the drop element
*/
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



function createOrderList($list){
	console.log("createOrderList started")
	console.log(beers_order)
	setTimeout(function(){}, 2000);
	$list.find("tbody").html("");

	$.each(beers_order,function(index, beer){
		if(beer){
			console.log("index: " + index + " noticed. Beer: " + beer.namn)
			if($list.find("#" + beer.beer_id).length == 0) {
				$list.find("tbody").append("<tr id='" + beer.beer_id + "'><td>" + beer.namn + "</td><td id='price'>"+ beer.price +"</td><td id='counter'>1</td></li>");
			}else{
				var $counter = $list.find("#"+  beer.beer_id).find("#counter");
				$counter.html(parseInt(
					$counter.html()) + 1)
			}
		}
	});
	calcSum();
}

function checkToAdd(beer_id, maxQuantity, element){	
	if(Object.keys(beers_order).length < maxQuantity){
		createBeer(Math.floor((Math.random() * 10) + 1), beer_id, $(element).find('#brand').html(), $(element).find('#price').html());
		
	}
	console.log("checkToAdd done")
}

function calcSum(){
	var sumPrice = 0;
	$('#order-list tbody tr').each(function(){
		sumPrice = sumPrice + (parseInt($(this).find("#counter").html()) * parseFloat($(this).find("#price").html()));
		
	});
	$('#order-list tfoot #total').html(sumPrice.toFixed(2));
}

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

$("#undoBtn").click(function() {
	undoManager.undo();
	console.log("UNDO: " + beers_order);
	createOrderList($('#order-list'));
});

$("#redoBtn").click(function() {
	undoManager.redo();
	console.log("REDO: " + beers_order);
	createOrderList($('#order-list'));
});

$("#orderBtn").click(function() {
	if(($('#confirm-table tbody tr').length + $('#order-list tbody tr').length) > 5){
		alert("The number of beers exceds maximum limit of 5.")
	}else{
		$('#confirm-table tbody').append($('#order-list tbody').html());
	}
});

$("#clearBtn").click(function() {
	undoManager.clear()
	beers_order = [];
	console.log("Clear: " + beers_order);
	createOrderList($('#order-list'));
});

$("#cancelBtn").click(function() {
	$('#confirm-table tbody').html("");
});

$("#confirmBtn").click(function() {
	$('#confirm-table tbody tr').each(function(){
		for(var i=0;parseInt($(this).find("#counter").html()) < i; i++){
			sendOrder($(this).find("#id").html());
		}
	});
	$('#confirm-table tbody').html("");
});
}