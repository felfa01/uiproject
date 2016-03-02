$( document ).ready(function() {
	getUsers(urlParams["username"], urlParams["password"]);
		$(".close").on("click", function(){
		$(".modal").css('display','none');

    //modal.style.display = "none";
});
		window.onclick = function(event) {
	if (event.target == document.getElementById('usrModal')) {
		$(".modal").css('display','none');
        //modal.style.display = "none";
    }
}
});

function getUsers(username, pwd){
	url = "http://pub.jamaica-inn.net/fpdb/api.php?username="+username+"&password="+pwd+"&action=iou_get_all";
	$.getJSON( url, {
		format: "json"
	}).done(function(data) {
		data.payload.sort(SortByName);
		jQuery.each(data.payload, function(i, usr) {
			$("#user-table tbody").append("<tr id='"+ i +"'><td>"+ usr.username +"</td><td>"+ usr.first_name
				+"</td><td>"+ usr.last_name +"</td><td>"+ usr.assets +"</td><td><i id='editBtn' class='fa fa-pencil-square-o'></i></td></tr>");
		});
		$("#editBtn").on("click", function(){
			$('#usrModal').css('display','block');
		});
	});

}

    function SortByName(x,y) {
    	var a = x.last_name.toLowerCase() + x.first_name.toLowerCase();
    	var b = y.last_name.toLowerCase() + y.first_name.toLowerCase();
      return ((a == b) ? 0 : ((a > b) ? 1 : -1 ));
    }



