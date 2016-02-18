/**
* Created by User on 2016-02-05.
*/

function myFunction() {

}

function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

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