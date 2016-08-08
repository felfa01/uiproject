/**
 * File: translate.js
 *
 * This file contains javascript for multilingiual webpage. Various function for translating between english and swedish with a dictionary for their respective counterparts. 
 * 
 *
 * Version 1.0
 * Author: Group FD
 */
//The following is a dictionary js file for interchanging between english and swedish words in the webpage. The dictionary contains a english and a swedish json object with underlying keys and values.
$( document ).ready(function() {
	if(sessionStorage.language != null){
		$("input[name=lang][value='"+sessionStorage.language+"']").prop("checked",true);
		translateInner(sessionStorage.language);
		translateImages(sessionStorage.language);
		translateInputs(sessionStorage.language);
		translatePlaceHolder(sessionStorage.language);

	}else{
		translateInner("eng");
		translateImages("eng");
		translateInputs("eng");
		translatePlaceHolder("eng");
		sessionStorage.language="eng";
		$("input[name=lang][value='eng']").prop("checked",true);
	}
	$("input[name=lang]:radio").change(function () {
		sessionStorage.language = $('.language-form input[type=radio]:checked').val();
		translateInner($('.language-form input[type=radio]:checked').val());
		translateImages($('.language-form input[type=radio]:checked').val());
		translateInputs($('.language-form input[type=radio]:checked').val());
	});

});

function translatePlaceHolder(lang){
	$(".translatePlaceHolder").each(function(){
		var translated = transl($(this).data("translate"), lang);
		$(this).attr("placeholder", translated);
	});
}

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
		"PirateGuest":"../images/Pirate_Guest.png",
		"BeerList":"Beer List",
		"Order":"Order",
		"Order2":" Order",
		"Brand":"Brand",
		"Price":"Price",
		"Price2":"Price <",
		"Current":"Current",
		"Confirm":" Confirm",
		"Cancel":"Cancel",
		"Add":" Add",
		"Clear":" Clear",
		"Default":" Default",
		"Alternative":" Alternative",
		"LgOut": " Log Out",
		"Leave": " Leave",
		"Stock": " Stock",
		"Accs": " Accounts",
		"Stats": " Statistics",
		"Name": "Name",
		"Brew": "Brewery",
		"Alco": "Alcohol <",
		"Rst": "Reset",
		"CurrSales": "Current Sales",
		"QO": "Quick Order",
		"Addcredit": "Add Credit",
		"currcredit": "New Credit",
		"Fav": "Favorites",
		"Order3": " Orders"

	},
	"swe":{
		"test": "Fungerar!",
		"test2": "Fungerar2!",
		"Usr": "Användarnamn",
		"Pwd": "Lösenord",
		"Submit": "Gå vidare",
		"UsrPwd": "Var god ange dit användarnamn och lösenord.",
		"PirateGuest": "../images/Pirate_Guest_Swe.png",
		"BeerList": "Öllista",
		"Order":"Beställning",
		"Order2":" Beställ",
		"Brand":"Märke",
		"Price":"Pris",
		"Price2":"Pris <",
		"Current":"Nuvarande",
		"Confirm":" Bekräfta",
		"Cancel":" Avbryt",
		"Add":" Lägg till",
		"Clear":" Rensa",
		"Default":" Standard",
		"Alternative":" Alternativ",
		"LgOut": " Logga Ut",
		"Leave": " Lämna",
		"Stock": " Lager",
		"Accs": " Konton",
		"Stats": " Statistik",
		"Name": "Namn",
		"Brew": "Tillverkare",
		"Alco": "Alkohol <",
		"Rst": "Återställ",
		"CurrSales": "Nuvarande Försäljning",
		"QO": "Snabb Beställning",
		"Addcredit": "Lägg till kredit",
		"currcredit": "Ny kredit",
		"Fav": "Favoriter",
		"Order3": " Beställt"
	}
}

