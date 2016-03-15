$( document ).ready(function() {
	if(sessionStorage.theme != null){
		$("input[name=theme][value='"+sessionStorage.theme+"']").prop("checked",true);
	}else{
		sessionStorage.theme="../css/styles.css";
		$("input[name=lang][value='../css/styles.css']").prop("checked",true);
	}

	$("input[name=theme]:radio").change(function () {
		document.getElementById('theme_css').href = $('.theme-form input[type=radio]:checked').val();

	});
});