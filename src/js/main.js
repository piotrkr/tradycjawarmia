var menuBtn = document.querySelector('.hamburger__menu'),
	offScreen = document.querySelector('.off__screen'),
	offScreenMenu = document.querySelector('.off__screen__menu')
function closeAllSubmenus() {
	document.querySelectorAll('.off__screen__add.active').forEach(function (e) {
		e.classList.remove('active')
	}),
		document.querySelectorAll('.off__screen__toggle span').forEach(function (e) {
			e.textContent = '+'
		})
}
menuBtn.addEventListener('click', function () {
	menuBtn.classList.toggle('active'), offScreen.classList.toggle('active'), closeAllSubmenus()
}),
	document.querySelectorAll('.off__screen__toggle > a[href="#"]').forEach(function (e) {
		e.addEventListener('click', function (e) {
			e.preventDefault(), e.stopPropagation()
			var t = (e = this.closest('li').querySelector('.off__screen__add')).classList.contains('active')
			closeAllSubmenus(), !t && (e.classList.add('active'), (t = this.querySelector('span'))) && (t.textContent = '–')
		})
	}),
	document.querySelectorAll('.off__screen__menu a[href]:not([href="#"])').forEach(function (e) {
		e.addEventListener('click', function (e) {
			var t,
				n,
				o = this.getAttribute('href').trim()
			menuBtn.classList.remove('active'),
				offScreen.classList.remove('active'),
				closeAllSubmenus(),
				o.startsWith('#') && 1 < o.length
					? (t = document.querySelector(o)) &&
					  (e.preventDefault(),
					  setTimeout(function () {
							t.scrollIntoView({ behavior: 'smooth' })
					  }, 350))
					: o.includes('#') &&
					  document.querySelector(o.split('#')[1]) &&
					  (n = document.querySelector('#' + o.split('#')[1])) &&
					  (e.preventDefault(),
					  (window.location.href = '/'),
					  setTimeout(function () {
							n.scrollIntoView({ behavior: 'smooth' })
					  }, 500))
		})
	}),
	window.addEventListener('pageshow', function (e) {
		e.persisted && (menuBtn.classList.remove('active'), offScreen.classList.remove('active'), closeAllSubmenus())
	}),
	('/' !== location.pathname && !location.pathname.includes('index.html')) ||
		(menuBtn.classList.remove('active'), offScreen.classList.remove('active'), closeAllSubmenus())
var swiper = new Swiper('.slider-wrapper', {
	loop: !0,
	spaceBetween: 30,
	grabCursor: !0,
	pagination: { el: '.swiper-pagination', clickable: !0, dynamicBullets: !0 },
	navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
	breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1080: { slidesPerView: 3 } },
})
