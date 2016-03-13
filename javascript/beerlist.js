$( document ).ready(function() { 

	$(".beer-element").on("click", function(){
		$(".beer-description").animate({height:'toggle'},500);

	});

});