/**
* Created by User on 2016-02-05.
*/

//$(function() {
//	$( "#sortable1, #sortable2" ).sortable({
//		connectWith: ".connectedSortable",
//		helper: "clone"
//	})
//});
//tells the browser to not issue default actions when trying to drop
function allowDrop(ev) {
	ev.preventDefault();
}
function dropCopy(ev) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");

	var nodeCopy = document.getElementById(data).cloneNode(true);

	nodeCopy.id = data.concat("new")

	ev.target.appendChild(nodeCopy);

}
function discardDrop(ev) {
	ev.preventDefault()
	var data1 = ev.dataTransfer.getData("text");
	var el = document.getElementById(data1);
	el.parentNode.removeChild(el);

}
function duplCheck(node) {

	var nums = document.getElementById("sortable2");
	var items = nums.getElementsByTagName("li");
	for (var i = 0; i < items.length; ++i) {
		if (node.isEqualNode(items[i])) {
			alert("we are in loop");



			//var cList = document.getElementsById("counterList");
			//var cListItems = cList.getElementsByTagName("li");

			//cListNode = cListItems[i];

			//cListNode.nodeValue ="2";


			//cListItems[i].nodeValue="2";

			//var beerInt = parseInt(cListItems[i]);
			//var beerInt2 = beerInt+1;



			//var counternode = document.createTextNode("0");




			//var nr = 1;
			//var node1 = document.createElement("LI");                 // Create a <li> node
			//var textnode1 = document.createTextNode(nr);
			//node1.appendChild(textnode1);
			//document.getElementById("counterList").appendChild(node1);

		}
		alert(items[i]);
		var counternode = document.createElement("LI");
		var countertext = document.createTextNode("1");
		counternode.appendChild(countertext);
		document.getElementById("counterList").appendChild(counternode);
	}
}
function listDrop(ev) {
	var data = ev.dataTransfer.getData("text");
	var node = document.createElement("LI");                 // Create a <li> node
	var textnode = document.createTextNode(data);         // Create a text node

	node.appendChild(textnode);                              // Append the text to <li>

	duplCheck(node);
	document.getElementById("sortable2").appendChild(node);	// Append <li> to <ul> with id="myList"



	}


function deleteBeer(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
	var data1 = ev.dataTransfer.getData("text");
	var el = document.getElementById(data1);
	el.parentNode.removeChild(el);

}
function dragCopy(ev) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");

	var nodeCopy = document.getElementById(data).cloneNode(true);

	nodeCopy.id = data.concat("new")

	ev.target.appendChild(nodeCopy);

}






// Sets the drag operation's drag data to the specified data and type. Holds the data we drag until we want to drop
function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}
// Receives the data and appends it to the target
function drop(ev) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	ev.target.appendChild(document.getElementById(data));
}

function fadein(){
	$("#choice").fadeOut( "slow", function() {

	});
	$("#login").fadeIn( "slow", function() {
// Anima
});
}


$( document ).ready(function() {
// Get the modal
var modalAdm = document.getElementById('admModal');
var modalVip = document.getElementById('vipModal');

// Get the button that opens the modal
var btnAdm = document.getElementById("admBtn");
var btnVIP = document.getElementById("vipBtn");
var AdmOrVip;
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close");

// When the user clicks on the button, open the modal 
btnAdm.onclick = function() {
    modalAdm.style.display = "block";
}

btnVIP.onclick = function() {
    modalVip.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
//span.onclick = function() {
$(".close").on("click", function(){
    $(".modal").css('display','none');
    //modal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalAdm || event.target == modalVip) {
    	$(".modal").css('display','none');
        //modal.style.display = "none";
    }
}
});