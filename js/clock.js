(function initClockFace() {
	var clock = document.getElementById('clock');
	if (!clock) return;

	for (var min = 0; min < 60; ++min) {
		clock.children[0].children[min].style.transform = 'rotate(' + 6 * min + 'deg)';
	}

	var r, r1, r2, rad, line, num;
	for (var min = 0; min < 60; ++min) {
		r = clock.offsetHeight / 2;
		r1 = (1 - 0.040) * r;
		rad = 6 * min * Math.PI / 180;

		line = clock.children[0].children[min];
		line.style.left = (r + r1 * Math.sin(rad) - 3.5) + 'px';
		line.style.top = (r - r1 * Math.cos(rad)) + 'px';

		if (min % 5 === 0) {
			r2 = (1 - 0.288) * r;
			num = clock.children[1].children[min / 5];
			num.style.left = (r + r2 * Math.sin(rad)) + 'px';
			num.style.top = (r - r2 * Math.cos(rad)) + 'px';
		}
	}
})();
