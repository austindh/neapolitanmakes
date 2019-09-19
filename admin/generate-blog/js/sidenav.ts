const menu = document.getElementById('hamburger');
menu.addEventListener('click', toggleSidenav);
const sidenav = document.getElementById('sidenav');
const backdrop = document.getElementById('backdrop');

const openClass = 'open';
const affectedElements = [menu, sidenav, backdrop];

function toggleSidenav() {
	const menu = document.getElementById('hamburger');
	const isOpen = menu.classList.contains(openClass);


	if (!isOpen) {
		affectedElements.forEach(e => e.classList.add(openClass));
		backdrop.classList.remove('closed');
		backdrop.addEventListener('click', removeOpen);
	} else {
		removeOpen();
	}
}

function removeOpen() {
	backdrop.removeEventListener('click', removeOpen);
	setTimeout(() => {
		backdrop.classList.add('closed'); // wait until opacity is fully faded before changing z-index to move back underneath
	}, 550);
	affectedElements.forEach(e => e.classList.remove(openClass));
}
