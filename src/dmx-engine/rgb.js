function rgb_to_array(str) {
	m = str.match(/^#([0-9a-f]{6})$/i)[1];
	if(m) {
		return [
				parseInt(m.substr(0,2),16),
		        parseInt(m.substr(2,2),16),
		        parseInt(m.substr(4,2),16)
	        ];
	}
}

function decimalToHex(d, padding) {
	var hex = Number(d).toString(16);
	padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
	while (hex.length < padding) {
		hex = "0" + hex;
	}
	return hex;
}

function array_to_rgb(arr) {
	return '#'+decimalToHex(arr[0])+decimalToHex(arr[1])+decimalToHex(arr[2]);
}
