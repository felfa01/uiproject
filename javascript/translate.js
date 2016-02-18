$( document ).ready(function() {
	translateInner("eng");
	translateImages("eng")
$("input[name=lang]:radio").change(function () {
	translateInner($('.language-form input[type=radio]:checked').val());
	translateImages($('.language-form input[type=radio]:checked').val());
	translateInputs($('.language-form input[type=radio]:checked').val());
 });

});

function translateInner(lang){
	$( ".translateInner" ).each(function() {
		var translated = transl($( this ).data("translate"), lang);
		$(this).text(translated);
	});
}
function translateImages(lang){
	$( ".translateImg" ).each(function() {
		var translated = transl($( this ).data("translate"), lang);
		$(this).attr("src", translated);
	});
}
function translateInputs(lang){
	$( ".translateInputs" ).each(function() {
		var translated = transl($( this ).data("translate"), lang);
		$(this).attr("value", translated);
	});
}

function transl(translStr, lang){
    console.log(jsonObject[lang][translStr]); // this will show the info it in firebug console
    return jsonObject[lang][translStr];
}

var jsonObject = {
	"eng":{
		"test": "Works!",
		"test2": "Works2!",
		"Usr": "User name",
		"Pwd": "Password",
		"Submit": "Submit",
		"UsrPwd": "Please enter user name and password.",	
		"PirateGuest":"../images/Pirate_Guest.png"
	},
	"swe":{
		"test": "Fungerar!",
		"test2": "Fungerar2!",
		"Usr": "Användarnamn",
		"Pwd": "Lösenord",
		"Submit": "Gå vidare",
		"UsrPwd": "Var god ange dit användarnamn och lösenord.",
		"PirateGuest": "../images/Pirate_Guest_Swe.png"
	}
}

