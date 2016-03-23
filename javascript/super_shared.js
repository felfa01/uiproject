



function SortQuickOrder(x,y) {
	var a = x.namn.toLowerCase() + x.namn2.toLowerCase();
	var b = y.namn.toLowerCase() + y.namn2.toLowerCase();
	return ((a == b) ? 0 : ((a > b) ? 1 : -1 ));
}

function countBeer(data){
	var countList=[];
	jQuery.each(data, function(i, beer) {
		if(checkIfExist(beer.namn,countList)){
			var index = countList.map(function(d) { return d['namn']; }).indexOf(beer.namn)
			countList[index]["count"] = countList[index]["count"] + 1; 
		}else{
			beer["count"] = 1;
			countList.push(beer);

		}
	});

	countList.sort(SortCount);
	//countList.splice(4, countList.length - 4); 
	return countList;
}

function extractTopFour(countlist){
	countlist.sort(SortCount);
	countlist.splice(4, countlist.length - 4);
	return countlist;
}

function checkIfExist(value,arr){
	for (i = 0; i < arr.length; i++) { 
		if(arr[i].namn === value){
			return true;
		}
	}
	return false;
}

function SortCount(x,y) {
	var a = x.count;
	var b = y.count;
	return (b-a);
}