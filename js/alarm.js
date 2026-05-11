var whatday = now.getDay();
var song_list = [
	"Morning Light.ogg", // Sunday
	"Morning Light.ogg", 
	"StudentAge.wav", // Tue
	"Flourish.ogg",
	"Dream It Possible-38.mp3", // Thu
	"Morning Light.ogg", // Fri
]
var alarm_wav = new Audio(`./sound/${song_list[whatday]}`);
// if (whatday=2) alarm_wav.volume = .75;




// alarm_wav = document.getElementById('alarm_wav');
var dinner = document.getElementById('dinner');


function dinnerCount() {
	console.log("dinner start");
	let dinnernum = document.getElementById('dinner-time-num');

	/* dinner time count */
	let delay = 60;
	var dinnerInterval = setInterval(() => {
		if (--(delay) >= 0)
			dinnernum.textContent = `00:${toTimeFmt(delay)}`;
		else {
			dinner.style.display = 'none';
			alarm_wav.pause()
			setTimeout(() => {
				dinner.setAttribute('show', 0);
			}, 10);
			console.log("dinner end");
			clearInterval(dinnerInterval);
		}

	}, 1000);
	alarm_wav.play();

	/* show dinner */
	dinner.style.display = 'initial';
	setTimeout(() => {
		dinner.setAttribute('show', 1);
	}, 10);

}


/* function detectDinner() {
	if (class_end - now <= 2_000) {
		console.log(1);
		setTimeout(dinner, 2_000);
		console.log("alarm woke");
	}
} */


(function main() {
	/* var alarmTimeoutId = 0;
	document.addEventListener('mouseover', () => { // interact to play
		if (!alarmTimeoutId && class_end - now > 0) {
			alarmTimeoutId = setTimeout(() => {
				alarm_wav.play();
				let dinner = document.getElementById('dinner');
				dinner.style.display = 'initial';
				setTimeout(() => {
					dinner.setAttribute('show', 1);
					dinner.focus();
				}, 10);
			}, class_end - now);
		}
	});
	 */
	while (!ready) {}
	if (class_end - now >= 0) {
		document.addEventListener('mouseover', () => {
			setTimeout(dinnerCount, class_end - now);
			console.log("alarms set");
		}, {once: true});
	}


	// setInterval(detectDinner, 0);
	/* document.addEventListener('mouseover', timeForDinner);
	console.log("alarm event set"); */

})();