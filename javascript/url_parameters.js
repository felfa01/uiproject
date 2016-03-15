var urlParams;

// Function calls every time the history of the page changes and creates parameters from the url
// that is used through out the homepage.
//
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