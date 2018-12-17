function clone(base) {
	var newArray = new Array(base.length);
    for(var i; i < base.length; i++) {
	    newArray[i] = base[i];
	}
	return newArray;
}


var ourArray = [], 
	i, start, end;

for(i = 0; i < 64*513; i++) {
	ourArray[i] = i;
}

start = new Date();

for(i = 0; i < 1000000; i++) {
	 const c = clone(ourArray);
	 c[8]=13;
}

end = new Date();
console.log('CLONE: ' + (end - start));

start = new Date();

for(i = 0; i < 1000000; i++) {
	const c = ourArray.slice(0);
	c[13]=8;
}

end = new Date();
console.log('SLICE: ' + (end - start));
