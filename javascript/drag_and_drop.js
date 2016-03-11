function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	var exist = checkExist(data);
	if(!exist){
		var element = document.getElementById(data).cloneNode(true);
		ev.target.appendChild(document.getElementById(data).cloneNode(true));
	}else{

	}
}


function checkExist(beer_id){
	var existed=false;
	$('#order-list li').each(function(){
		if(beer_id == $(this).attr("id")){
			if($(this).find("#counter").length){
				$(this).find("#counter").html(parseInt($(this).find("#counter").html()) + 1)
			}else{
				$(this).append("<span id='counter'>1</span>")
			}
			existed = true;
		}
	});
	(existed == true) ? console.log("exist") : console.log("not exist");
	return existed;
}