

function makeDragable(){
	var nodeList = document.getElementsByClassName('draggable')

	for(var i=0; i < nodeList.length; i++){
		var obj = nodeList[i];
		obj.addEventListener('touchmove', function(event){
			var touch = event.targetTouches[0];
			allowDrop(event);
			event.target.style.left = touch.pageX + 'px';
			event.target.style.top = touch.pageY + 'px';
			console.log(event.target.style.top)
			event.preventDefault();
		}, false);
	}
} 


function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	console.log("DRAG STARTED")
	ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	var exist = checkExist(data);
	if(!exist){
		addElement(ev, data);
		//ev.target.appendChild(document.getElementById(data).cloneNode(true));
	}else{

	}
}

function addElement(ev, beer_id){
	var element = document.getElementById(beer_id).cloneNode(true);
	//var newElement = document.createElement("LI"); 
	//newElement.append("<span><span id='counter'>1</span>")
	$(ev.target).append("<li id='" + beer_id + "'><span>" + $(element).find('#brand').html() + "</span><span id='counter'>1</span></li>");

}

function checkExist(beer_id){
	var existed=false;
	$('#order-list li').each(function(){
		if(beer_id == $(this).attr("id")){
			$(this).find("#counter").html(parseInt($(this).find("#counter").html()) + 1)
			existed = true;
		}
	});
	(existed == true) ? console.log("exist") : console.log("not exist");
	return existed;
}