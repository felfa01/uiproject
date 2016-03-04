var creditAdd=0;
var urlParams;
(window.onpopstate = function () {
	var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(query))
        	urlParams[decode(match[1])] = decode(match[2]);
    })();

    $( document ).ready(function() {
    	$(".close").on("click", function(){
    		$(".modal").css('display','none');	
    		$('form').trigger("reset");	
    	});
    	$("#collapse-sidebar").on("click", function(){
    		if(!$('#sidebar').is(':visible'))
    		{
    			$("#sidebar").animate({width:'toggle'},500);
    		}else{
    			$("#sidebar").animate({width:'toggle'},500);;
    		}	
    	});
    	window.onclick = function(event) {
    		if (event.target == document.getElementById('usrModal') || event.target == document.getElementById('creditModal')
    			|| event.target == document.getElementById('stockModal') ) {
    			$(".modal").css('display','none');
    		$('form').trigger("reset");
    		creditAdd = 0;
    	}
    }
});

