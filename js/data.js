var ready = 0;
var now = new Date();
var today = now.toLocaleDateString();
var startList = [
	// new Date(`${today} 11:20:00`),
	new Date(`${today} 17:00:00`),
];
var endList = [
	// new Date(`${today} 11:32:00`),
	new Date(`${today} 17:50:00`),
];

var class_start, class_end;
// var dinnertime = new Date(class_end + 180_000)
function updateRange() {
	now = new Date(Number(new Date())+0*1000);
	for (let i = 0; i < endList.length; i++) {
		if ((i ? (now >= endList[i - 1]) : 1) && now <= endList[i]) {
			class_start = startList[i];
			class_end = endList[i];
		}
	}
};
updateRange();
ready = 1;
console.log("time info ready");
setInterval(updateRange, 100);
