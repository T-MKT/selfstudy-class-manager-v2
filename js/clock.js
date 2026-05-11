(function main() {
	var clock = document.getElementById('clock');
	for (let min = 0; min < 60; ++min) {
		clock.children[0].children[min].style.transform = 'rotate(' + 6*min + 'deg)';
	}


	setInterval(function drawClock() {
		let r, r1, r2, rad, line, num;
		for (let min = 0; min < 60; ++min) {
			r = clock.offsetHeight / 2;
			r1 = (1-.040) * r;
			rad = 6*min * Math.PI/180;
			
			line = clock.children[0].children[min];
			line.style.left = (r + r1*Math.sin(rad) - 3.5) + 'px';
			//     x;       origin; cos(90-i)=sin i
			line.style.top = (r - r1*Math.cos(rad)) + 'px';
			//     y;         sin(90-i) = cos i

			if (min % 5 === 0) {
				r2 = (1-.288) * r;
				num = clock.children[1].children[min/5];
				num.style.left = (r + r2*Math.sin(rad)) + 'px';
				//                          to center: half of text width
				num.style.top = (r - r2*Math.cos(rad)) + 'px';
				//                                     half of height
			}
		}
	}, 0);


	setInterval(function handsRorate() {
		let hands = document.getElementById('clock-hands').children;
		// let now = new Date();
		let times = now.toLocaleTimeString().split(':');
		// for (let i of [0,1,2]) {	hands[i].style.transition = (times[i]!='00')?'0.2s':'none';}
		hands[0].style.transform = 'translate(-50%, -89.476%) rotate(' + (30*times[0] + .5*times[1] + 1/120*times[2]) + 'deg)';
		hands[1].style.transform = 'translate(-50%, -90.833%) rotate(' + (6*times[1] + .1*times[2]) + 'deg)';
		hands[2].style.transform = 'translate(-50%, -89.476%) rotate(' + 6*times[2] + 'deg)'; // sec
	}, 1000);
})();
