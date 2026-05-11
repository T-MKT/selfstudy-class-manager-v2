(function main() {
	setInterval(function updateTimeInfo() {
		/* now */
		let nowtime = document.getElementById('clock-nowtime');
		nowtime.textContent = now.toLocaleTimeString();

		/* to or last */
		let starter = document.getElementById('info-starts-container');
		let diff = Math.floor((now - class_start) / 1000);
		starter.parentNode.children[0].innerHTML = (diff > 0) ? '自习课已开始' : '距离开始还有';
		starter.children[0].innerHTML = toTimeFmt(Math.floor(Math.abs(diff) / 60) % 60);
		starter.children[2].innerHTML = toTimeFmt(Math.abs(diff) % 60);

		/* until */
		let ender = document.getElementById('info-ends-container');
		let until = Math.floor((now - class_end) / 1000);
		let h;
		ender.children[0].innerHTML = toTimeFmt(Math.floor(Math.abs(until) / 60) % 60);
		ender.children[2].innerHTML = toTimeFmt(Math.abs(until) % 60);
	}, 1000);
})();