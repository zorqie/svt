function clone(base) {
	var newBuffer = Buffer.alloc(base.length);
    for(var i; i < base.length; i++) {
	    newBuffer[i] = base[i];
	}
	return newBuffer;
}


var ourBuffer = Buffer.alloc(64*512)
var	i, start, end;

for(i = 0; i < 64*513; i++) {
	ourBuffer[i] = i;
}

start = new Date();

for(i = 0; i < 1000000; i++) {
	 const c = clone(ourBuffer);
	 c[8]=13;
}

end = new Date();
console.log('CLONE: ' + (end - start));

start = new Date();

for(i = 0; i < 1000000; i++) {
	const c = ourBuffer.slice(0);
	c[13]=8;
}

end = new Date();
console.log('SLICE: ' + (end - start));
