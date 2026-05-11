var Dinner = (function() {
	var SONGS = {
		0: 'Morning Light.ogg',
		1: 'Morning Light.ogg',
		2: 'StudentAge.wav',
		3: 'Flourish.ogg',
		4: 'Dream It Possible-38.mp3',
		5: 'Morning Light.ogg',
		6: 'Morning Light.ogg'
	};

	var el = document.getElementById('dinner');
	var timeNumEl = document.getElementById('dinner-time-num');
	var day = new Date().getDay();
	var audio = new Audio('./sound/' + SONGS[day]);
	var countdownId = null;

	function schedule(classEnd, now) {
		var delay = classEnd - now;
		if (delay < 0) return;

		document.addEventListener('mouseover', function() {
			setTimeout(show, delay);
			console.log('alarms set');
		}, { once: true });
	}

	function show() {
		console.log('dinner start');
		el.style.display = 'initial';
		requestAnimationFrame(function() { el.setAttribute('show', '1'); });
		audio.play();

		var remaining = 60;
		timeNumEl.textContent = '01:00';
		countdownId = setInterval(function() {
			remaining--;
			if (remaining < 0) {
				hide();
			} else {
				timeNumEl.textContent = '00:' + String(remaining).padStart(2, '0');
			}
		}, 1000);
	}

	function hide() {
		el.style.display = 'none';
		audio.pause();
		audio.currentTime = 0;
		clearInterval(countdownId);
		setTimeout(function() {
			el.setAttribute('show', '0');
		}, 10);
		console.log('dinner end');
	}

	return { schedule: schedule, show: show, hide: hide };
})();
