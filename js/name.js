var namelist = document.getElementById('names-list');


function names_input() {
	let input = document.getElementById('names-add-input-value');
	input.style.display = 'initial';
	setTimeout(() => {
		input.setAttribute('show', 1);
		input.focus();
	}, 10);

}


function names_addPerson(event){
	if (event.keyCode === 13) {
		/* get */
		let input = document.getElementById('names-add-input-value');
		let personName = input.value;

		/* create */
		let addition = document.createElement('div');
		addition.className = 'names-piece';
		addition.innerHTML = `
			<div class="names-piece-l">
				<span class="names-piece-name">${personName}</span>
				<span class="names-piece-times circle" times="1">1</span>
			</div>
			<div class="names-piece-r">
				<button class="names-increase" class="names-title-kit">
					<img src="./img/icon/add_circle.svg" alt="+"/>
				</button>
				<button class="names-decrease" class="names-title-kit">
					<img src="./img/icon/remove_circle.svg" alt="-"/>
				</button>
			</div>
			`

		/* add */
		namelist.appendChild(addition);
		let times = addition.children[0].children[1];
		let increase = addition.children[1].children[0];
		increase.addEventListener('click', () => {
			let newtime = Number(times.textContent) + 1;
			times.setAttribute('times', newtime);
			times.textContent = newtime;
		});
		let decrease = addition.children[1].children[1];
		decrease.addEventListener('click', () => {
			let newtime = Number(times.textContent) - 1;
			if (newtime == 0) {
				addition.remove();
			}
			else {
			times.setAttribute('times', newtime);
			times.textContent = newtime;
			}
		});
		console.log(`person '${input.value}' added`);

		/* hide input */
		input.setAttribute('show', '0');
		setTimeout(() => { 
			input.style.display = 'none'; // hide after delay
			input.value = ''; // clear text
		}, 300); // delay (input.transition: opacity 0.3s;)
	}
}


function names_clear(){
	/* const n = namelist.children.length;
	for (let i = 0; i < n; i++) {
		namelist.removeChild(namelist.firstElementChild);
	}
	console.log('names clear'); */
	namelist.innerHTML = '';
}


(function main()
{
	
})();