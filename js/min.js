function toTimeFmt(x) {
	return String(x).padStart(2, '0');
}


function isInRange(x, a, b) {
	return (x >= a && x <= b);
}


function Ready() {
	setInterval(() => {
		if (class_end) return;
	}, 1000);
}