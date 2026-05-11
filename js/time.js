(function main() {
	setInterval(function updateTimeInfo() {
		/* now */
		let nowtime = document.getElementById('clock-nowtime');
		nowtime.textContent = now.toLocaleTimeString();

		/* to or last */
		let diff = Math.floor((now - class_start) / 1000);
		document.getElementById('info-starts-label').textContent = (diff > 0) ? '自习课已开始' : '距离开始还有';
		document.getElementById('info-starts-m').textContent = toTimeFmt(Math.floor(Math.abs(diff) / 60) % 60);
		document.getElementById('info-starts-s').textContent = toTimeFmt(Math.abs(diff) % 60);

		/* until */
		let until = Math.floor((now - class_end) / 1000);
		document.getElementById('info-ends-m').textContent = toTimeFmt(Math.floor(Math.abs(until) / 60) % 60);
		document.getElementById('info-ends-s').textContent = toTimeFmt(Math.abs(until) % 60);
	}, 1000);
})();