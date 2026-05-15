var App = (function() {
	var state = {
		now: new Date(),
		classStart: null,
		classEnd: null
	};

	function pad(n) {
		return String(n).padStart(2, '0');
	}

	function calcTimeRange() {
		var today = new Date().toLocaleDateString();
		var startList = [
			new Date(today + ' 17:00:00')
		];
		var endList = [
			new Date(today + ' 17:50:00')
		];

		state.now = new Date();
		for (var i = 0; i < endList.length; i++) {
			if ((i === 0 || state.now >= endList[i - 1]) && state.now <= endList[i]) {
				state.classStart = startList[i];
				state.classEnd = endList[i];
			}
		}
	}

	function updateDigital() {
		var nowtime = document.getElementById('clock-nowtime');
		nowtime.textContent = state.now.toLocaleTimeString();

		var diff = Math.floor((state.now - state.classStart) / 1000);
		document.getElementById('info-starts-label').textContent =
			(diff > 0) ? '自习课已开始' : '距离开始还有';
		document.getElementById('info-starts-m').textContent =
			pad(Math.floor(Math.abs(diff) / 60) % 60);
		document.getElementById('info-starts-s').textContent =
			pad(Math.abs(diff) % 60);

		var until = Math.floor((state.now - state.classEnd) / 1000);
		document.getElementById('info-ends-m').textContent =
			pad(Math.floor(Math.abs(until) / 60) % 60);
		document.getElementById('info-ends-s').textContent =
			pad(Math.abs(until) % 60);
	}

	var lastSecond = -1;
	function loop() {
		state.now = new Date();
		var s = state.now.getSeconds();
		if (s !== lastSecond) {
			lastSecond = s;
			updateDigital();
		}
		requestAnimationFrame(loop);
	}

	function init() {
		calcTimeRange();
		Names.init();
		Dinner.schedule(state.classEnd, state.now);
		requestAnimationFrame(loop);
	}

	return { init: init };
})();

document.addEventListener('DOMContentLoaded', App.init);
