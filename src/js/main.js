// ==================== main.js – WERSJA DZIAŁAJĄCA 100% ====================

const menuBtn = document.querySelector('.hamburger__menu')
const offScreen = document.querySelector('.off__screen')
const offScreenMenu = document.querySelector('.off__screen__menu')

// Zamykanie wszystkich podmenu
function closeAllSubmenus() {
	document.querySelectorAll('.off__screen__add.active').forEach(submenu => {
		submenu.classList.remove('active')
	})
	document.querySelectorAll('.off__screen__toggle span').forEach(span => {
		span.textContent = '+'
	})
}

// Hamburger – otwieranie/zamykanie całego menu
menuBtn.addEventListener('click', () => {
	menuBtn.classList.toggle('active')
	offScreen.classList.toggle('active')
	closeAllSubmenus()
})

// Rozwijanie podmenu tylko gdy href="#"
document.querySelectorAll('.off__screen__toggle > a[href="#"]').forEach(toggleLink => {
	toggleLink.addEventListener('click', function (e) {
		e.preventDefault()
		e.stopPropagation()

		const parentLi = this.closest('li')
		const submenu = parentLi.querySelector('.off__screen__add')
		const isActive = submenu.classList.contains('active')

		closeAllSubmenus()

		if (!isActive) {
			submenu.classList.add('active')
			const span = this.querySelector('span')
			if (span) span.textContent = '–'
		}
	})
})

// GŁÓWNY HANDLER – wszystkie prawdziwe linki (oprócz tych z href="#")
document.querySelectorAll('.off__screen__menu a[href]:not([href="#"])').forEach(link => {
	link.addEventListener('click', function (e) {
		const href = this.getAttribute('href').trim()

		// Zamknij menu zawsze
		menuBtn.classList.remove('active')
		offScreen.classList.remove('active')
		closeAllSubmenus()

		// Jeśli to kotwica na obecnej stronie (np. #masses, #msze itp.)
		if (href.startsWith('#') && href.length > 1) {
			const target = document.querySelector(href)
			if (target) {
				e.preventDefault()
				setTimeout(() => {
					target.scrollIntoView({ behavior: 'smooth' })
				}, 350) // czas na zamknięcie animacji menu
			}
			return
		}

		// Jeśli link zawiera #, ale jest do innej strony (np. /index.html#masses) – też obsłużymy
		if (href.includes('#') && document.querySelector(href.split('#')[1])) {
			const target = document.querySelector('#' + href.split('#')[1])
			if (target) {
				e.preventDefault()
				window.location.href = '/' // wracamy na stronę główną
				setTimeout(() => {
					target.scrollIntoView({ behavior: 'smooth' })
				}, 500)
			}
		}
		// W pozostałych przypadkach (np. /ogloszenia.html, /kontakt.html) – nic nie robimy, przeglądarka sama przejdzie
	})
})

// Ochrona przy powrocie przez przycisk WSTECZ (bfcache)
window.addEventListener('pageshow', e => {
	if (e.persisted) {
		menuBtn.classList.remove('active')
		offScreen.classList.remove('active')
		closeAllSubmenus()
	}
})

// Reset przy bezpośrednim wejściu na stronę główną
if (location.pathname === '/' || location.pathname.includes('index.html')) {
	menuBtn.classList.remove('active')
	offScreen.classList.remove('active')
	closeAllSubmenus()
}

const swiper = new Swiper('.slider-wrapper', {
	// Optional parameters
	loop: true,
	spaceBetween: 30,
	grabCursor: true,

	// If we need pagination
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
		dynamicBullets: true,
	},

	// Navigation arrows
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},

	// Responsive breakpoints
	breakpoints: {
		0: {
			slidesPerView: 1,
		},
		768: {
			slidesPerView: 2,
		},
		1080: {
			slidesPerView: 3,
		},
	},
})
