var Names = (function() {
	var list = document.getElementById('names-list');
	var input = document.getElementById('names-add-input-value');

	function showInput() {
		input.style.display = 'initial';
		setTimeout(function() {
			input.setAttribute('show', 1);
			input.focus();
		}, 10);
	}

	function addPerson(name) {
		var piece = document.createElement('div');
		piece.className = 'names-piece';

		var left = document.createElement('div');
		left.className = 'names-piece-l';

		var nameSpan = document.createElement('span');
		nameSpan.className = 'names-piece-name';
		nameSpan.textContent = name;

		var timesSpan = document.createElement('span');
		timesSpan.className = 'names-piece-times circle';
		timesSpan.setAttribute('times', '1');
		timesSpan.textContent = '1';

		left.appendChild(nameSpan);
		left.appendChild(timesSpan);

		var right = document.createElement('div');
		right.className = 'names-piece-r';

		var incBtn = document.createElement('button');
		incBtn.className = 'names-increase names-title-kit';
		incBtn.innerHTML = '<img src="./img/icon/add_circle.svg" alt="+"/>';

		var decBtn = document.createElement('button');
		decBtn.className = 'names-decrease names-title-kit';
		decBtn.innerHTML = '<img src="./img/icon/remove_circle.svg" alt="-"/>';

		right.appendChild(incBtn);
		right.appendChild(decBtn);

		piece.appendChild(left);
		piece.appendChild(right);

		list.appendChild(piece);
	}

	function clear() {
		list.innerHTML = '';
	}

	function onAddPerson(event) {
		if (event.key === 'Enter') {
			var personName = input.value;
			addPerson(personName);
			console.log("person '" + input.value + "' added");

			input.setAttribute('show', '0');
			setTimeout(function() {
				input.style.display = 'none';
				input.value = '';
			}, 300);
		}
	}

	function init() {
		document.getElementById('names-additem').addEventListener('click', showInput);
		document.getElementById('names-clear').addEventListener('click', clear);
		input.addEventListener('keydown', onAddPerson);

		list.addEventListener('click', function(e) {
			var btn = e.target.closest('button');
			if (!btn) return;
			var piece = btn.closest('.names-piece');
			var timesEl = piece.querySelector('.names-piece-times');

			if (btn.classList.contains('names-increase')) {
				var n = Number(timesEl.textContent) + 1;
				timesEl.textContent = n;
				timesEl.setAttribute('times', n);
			}
			if (btn.classList.contains('names-decrease')) {
				var n = Number(timesEl.textContent) - 1;
				if (n === 0) {
					piece.remove();
				} else {
					timesEl.textContent = n;
					timesEl.setAttribute('times', n);
				}
			}
		});
	}

	return { init: init, addPerson: addPerson, clear: clear, showInput: showInput };
})();
