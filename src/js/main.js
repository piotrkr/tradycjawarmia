// ======================
// MENU OFF-SCREEN (HAMBURGER)
// ======================
const menuBtn = document.querySelector('.hamburger__menu')
const offScreen = document.querySelector('.off__screen')
const offScreenMenu = document.querySelector('.off__screen__menu')

function closeAllSubmenus() {
	document.querySelectorAll('.off__screen__add.active').forEach(function (e) {
		e.classList.remove('active')
	})
	document.querySelectorAll('.off__screen__toggle span').forEach(function (e) {
		e.textContent = '+'
	})
}

menuBtn.addEventListener('click', function () {
	menuBtn.classList.toggle('active')
	offScreen.classList.toggle('active')
	closeAllSubmenus()
})

// Rozwijanie podmenu w menu mobilnym
document.querySelectorAll('.off__screen__toggle > a[href="#"]').forEach(function (e) {
	e.addEventListener('click', function (e) {
		e.preventDefault()
		e.stopPropagation()

		const submenu = this.closest('li').querySelector('.off__screen__add')
		const isActive = submenu.classList.contains('active')

		closeAllSubmenus()

		if (!isActive) {
			submenu.classList.add('active')
			const span = this.querySelector('span')
			if (span) span.textContent = '–'
		}
	})
})

// Zamykanie menu po kliknięciu w link (z obsługą smooth scroll)
document.querySelectorAll('.off__screen__menu a[href]:not([href="#"])').forEach(function (e) {
	e.addEventListener('click', function (e) {
		const href = this.getAttribute('href').trim()

		menuBtn.classList.remove('active')
		offScreen.classList.remove('active')
		closeAllSubmenus()

		if (href.startsWith('#') && href.length > 1) {
			const target = document.querySelector(href)
			if (target) {
				e.preventDefault()
				setTimeout(() => {
					target.scrollIntoView({ behavior: 'smooth' })
				}, 350)
			}
		} else if (href.includes('#')) {
			const anchorId = href.split('#')[1]
			const anchorElement = document.querySelector('#' + anchorId)
			if (anchorElement) {
				e.preventDefault()
				window.location.href = '/'
				setTimeout(() => {
					anchorElement.scrollIntoView({ behavior: 'smooth' })
				}, 500)
			}
		}
	})
})

// Reset stanu menu przy powrocie z bfcache
window.addEventListener('pageshow', function (e) {
	if (e.persisted) {
		menuBtn.classList.remove('active')
		offScreen.classList.remove('active')
		closeAllSubmenus()
	}
})

// Reset menu, jeśli nie jesteśmy na stronie głównej
if (location.pathname !== '/' && !location.pathname.includes('index.html')) {
	menuBtn.classList.remove('active')
	offScreen.classList.remove('active')
	closeAllSubmenus()
}

// ======================
// LIGHTBOX GALERII
// ======================
const galleryItems = document.querySelectorAll('.gallery-item')

// Tworzenie lightboxa
const lightbox = document.createElement('div')
lightbox.className = 'lightbox'

const lightboxContent = document.createElement('div')
lightboxContent.className = 'lightbox-content'

const lightboxImg = document.createElement('img')
lightboxImg.id = 'lightbox-img'

const lightboxPrevBtn = document.createElement('div') // zmieniona nazwa, żeby nie kolidowała
lightboxPrevBtn.className = 'lightbox-prev'
lightboxPrevBtn.innerHTML = '<i class="fa fa-angle-left"></i>'

const lightboxNextBtn = document.createElement('div') // zmieniona nazwa
lightboxNextBtn.className = 'lightbox-next'
lightboxNextBtn.innerHTML = '<i class="fa fa-angle-right"></i>'

const closeArea = document.createElement('div')
closeArea.className = 'lightbox-close-area'

// Składanie struktury
lightbox.appendChild(closeArea)
lightbox.appendChild(lightboxContent)
lightboxContent.appendChild(lightboxImg)
lightbox.appendChild(lightboxPrevBtn)
lightbox.appendChild(lightboxNextBtn)
document.body.appendChild(lightbox)

let currentIndex = 0

function openLightbox(index) {
	currentIndex = index
	const fullSrc = galleryItems[index].dataset.full
	lightboxImg.src = fullSrc
	lightbox.style.display = 'flex'
}

galleryItems.forEach((item, index) => {
	item.addEventListener('click', () => openLightbox(index))
})

lightboxPrevBtn.addEventListener('click', e => {
	e.stopPropagation()
	currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length
	openLightbox(currentIndex)
})

lightboxNextBtn.addEventListener('click', e => {
	e.stopPropagation()
	currentIndex = (currentIndex + 1) % galleryItems.length
	openLightbox(currentIndex)
})

function closeLightbox() {
	lightbox.style.display = 'none'
}

closeArea.addEventListener('click', closeLightbox)
lightbox.addEventListener('click', e => {
	if (e.target === lightbox) closeLightbox()
})

// Klawiatura w lightboxie
document.addEventListener('keydown', e => {
	if (lightbox.style.display === 'flex') {
		if (e.key === 'ArrowLeft') lightboxPrevBtn.click()
		if (e.key === 'ArrowRight') lightboxNextBtn.click()
		if (e.key === 'Escape') closeLightbox()
	}
})

// ======================
// PAGINACJA OGŁOSZEŃ
// ======================

// Sprawdź, czy elementy paginacji istnieją na tej stronie (żeby nie wyrzucało błędów na innych podstronach)
const announcementPages = document.querySelectorAll('.announcements-page')
const pageNumbersContainer = document.getElementById('page-numbers')
const paginationPrevBtn = document.getElementById('prev-btn')
const paginationNextBtn = document.getElementById('next-btn')
const announcementsSection = document.querySelector('#announcements')

if (announcementPages.length > 0 && pageNumbersContainer && paginationPrevBtn && paginationNextBtn) {
	const totalPages = announcementPages.length
	let currentPage = 1

	const displayedLastPageNumber = 10 // ile ostatnich stron pokazujemy (możesz zmienić)

	function showPage(pageNumber) {
		announcementPages.forEach((page, index) => {
			page.hidden = index + 1 !== pageNumber
		})

		currentPage = pageNumber

		// Aktualizacja klasy active na przyciskach numerów stron
		document.querySelectorAll('.page-number').forEach(btn => {
			const btnPage = parseInt(btn.dataset.page)
			btn.classList.toggle('active', btnPage === pageNumber)
		})

		// Strzałki – dezaktywacja na końcach
		paginationPrevBtn.classList.toggle('disabled', currentPage === 1)
		paginationNextBtn.classList.toggle('disabled', currentPage === totalPages)

		// Smooth scroll do sekcji ogłoszeń
		if (announcementsSection) {
			announcementsSection.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	}

	function renderPagination() {
		pageNumbersContainer.innerHTML = ''

		const createPageButton = num => {
			const button = document.createElement('button')
			button.className = 'page-number'
			button.dataset.page = num
			button.textContent = num
			button.addEventListener('click', () => showPage(num))
			if (num === currentPage) button.classList.add('active')
			pageNumbersContainer.appendChild(button)
		}

		// Zawsze pokazujemy pierwsze 3 strony
		for (let i = 1; i <= Math.min(3, totalPages); i++) {
			createPageButton(i)
		}

		// Kropki, jeśli potrzeba
		if (totalPages > 4) {
			const dots = document.createElement('span')
			dots.className = 'page-number dots'
			dots.textContent = '...'
			pageNumbersContainer.appendChild(dots)
		}

		// Ostatnia strona (lub kilka ostatnich, jeśli displayedLastPageNumber jest mniejsze)
		const lastPageToShow = Math.max(totalPages, displayedLastPageNumber)
		if (totalPages > 3 && lastPageToShow > 3) {
			createPageButton(totalPages)
		}
	}

	// Eventy strzałek
	paginationPrevBtn.addEventListener('click', () => {
		if (currentPage > 1) showPage(currentPage - 1)
	})

	paginationNextBtn.addEventListener('click', () => {
		if (currentPage < totalPages) showPage(currentPage + 1)
	})

	// Inicjalizacja
	renderPagination()
	showPage(1)
}

// ======================
// SEKCJA AKTUALNOŚCI – KARUZELA 9 KART
// ======================
const newsData = [
	{
		image: '../img/592960151_1154488490130242_8877612135666923510_n.jpg',
		date: '15 grudnia 2025',
		title: 'Msza święta w Sanktuarium Gietrzwałdzkim',
		excerpt: 'W gietrzwałdzkim sanktuarium odbyła się msza tradycyjna z udziałem naszego duszpasterstwa.',
		link: 'msza-swieta-w-sanktuarium-gietrzwaldzkim.html',
	},
	{
		image: '../img/księża.jpg',
		title: 'Profesje wieczyste',
		date: '8 grudnia 2025',
		excerpt: 'Księża z naszej wspólnoty złożyli profesje wieczyste podczas uroczystej Mszy św.',
		link: '#artykul2',
	},
	{
		image: '../img/dzwon.jpg',
		title: 'Uroczyste poświęcenie dzwonu',
		date: '1 listopada 2025',
		excerpt: 'Nowy dzwon dla naszej kaplicy został poświęcony przez księdza biskupa.',
		link: '#artykul3',
	},
	{
		image: 'https://www.osmol.pl/wp-content/uploads/2021/03/Swieta-Lipka.webp',
		title: 'Pielgrzymka do Świętej Lipki',
		date: '20 października 2025',
		excerpt: 'Coroczna pielgrzymka duszpasterstwa do sanktuarium w Świętej Lipce.',
		link: '#artykul4',
	},
	{
		image: 'https://nikidw.edu.pl/wp-content/uploads/2024/12/advent-1883840_1280.jpg',
		title: 'Rekolekcje adwentowe',
		date: '5 grudnia 2025',
		excerpt: 'Rozpoczęły się rekolekcje adwentowe prowadzone przez ks. proboszcza.',
		link: '#artykul5',
	},
	{
		image: 'https://codziennypoznan.pl/wp-content/uploads/2025/12/Oplatek-Wigilia.png',
		title: 'Spotkanie opłatkowe',
		date: '20 grudnia 2025',
		excerpt: 'Tradycyjne spotkanie opłatkowe wspólnoty przed Bożym Narodzeniem.',
		link: '#artykul6',
	},
	{
		image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqU0azU1ut0lJKIy-C0UJTl7DdWTZWqb4ZMg&s',
		title: 'Msza św. Requiem',
		date: '10 listopada 2025',
		excerpt: 'Rozpoczęcie cyklu Mszy św. gregoriańskich za zmarłych.',
		link: '#artykul7',
	},
	{
		image: 'https://diecezja.pl/wp-content/uploads/2023/09/katecheza2.jpg',
		title: 'Katecheza dla młodzieży',
		date: '25 października 2025',
		excerpt: 'Spotkanie formacyjne dla młodzieży z duszpasterstwa.',
		link: '#artykul8',
	},
	{
		image: 'https://kurierostrowski.pl/wp-content/uploads/2019/12/roraty-fot2.jpg',
		title: 'Roraty 2025',
		date: '1 grudnia 2025',
		excerpt: 'Zapraszamy na codzienne Msze roratnie w okresie Adwentu.',
		link: '#artykul9',
	},
]

const newsGrid = document.getElementById('newsGrid')

function createNewsCard(item) {
	const card = document.createElement('article')
	card.className = 'news-card'

	card.innerHTML = `
    <img src="${item.image}" alt="${item.title}" class="news-card__image">
    <div class="news-card__content">
      <span class="date">${item.date}</span>
      <h3>${item.title}</h3>
      <p>${item.excerpt}</p>
      <a href="${item.link}" target="_blank" rel="noopener noreferrer">Czytaj dalej →</a>
    </div>
  `

	return card
}

if (newsGrid) {
	newsData.forEach(item => {
		newsGrid.appendChild(createNewsCard(item))
	})

	// Karuzela – przewijanie
	const prevBtn = document.querySelector('.news-carousel__prev')
	const nextBtn = document.querySelector('.news-carousel__next')

	const scrollAmount = 370 // szerokość karty + gap (dostosowane do 340px + 30px)

	nextBtn.addEventListener('click', () => {
		newsGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' })
	})

	prevBtn.addEventListener('click', () => {
		newsGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
	})

	// Opcjonalnie: ukrywanie strzałek na końcach
	newsGrid.addEventListener('scroll', () => {
		prevBtn.classList.toggle('disabled', newsGrid.scrollLeft <= 10)
		nextBtn.classList.toggle('disabled', newsGrid.scrollLeft + newsGrid.clientWidth >= newsGrid.scrollWidth - 10)
	})
}

// (Opcjonalnie zakomentowany Swiper – możesz odkomentować kiedy będzie potrzebny)
// var swiper = new Swiper('.slider-wrapper', { ... });

document.addEventListener('DOMContentLoaded', function () {
	// Aktualny rok
	const yearElement = document.getElementById('current-year')
	if (yearElement) {
		yearElement.textContent = new Date().getFullYear()
	}

	// Scroll to top button
	const scrollTopBtn = document.getElementById('scrollTopBtn')
	if (scrollTopBtn) {
		window.addEventListener('scroll', () => {
			if (window.scrollY > 300) {
				scrollTopBtn.classList.add('visible')
			} else {
				scrollTopBtn.classList.remove('visible')
			}
		})

		scrollTopBtn.addEventListener('click', () => {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		})
	}

	// ======================
	// ACCORDION – wiele paneli otwartych jednocześnie + ładna ikona
	// ======================
	const accordionHeaders = document.querySelectorAll('.accordion__header')

	if (accordionHeaders.length === 0) {
		console.warn('Nie znaleziono elementów .accordion__header – sprawdź HTML')
		return
	}

	accordionHeaders.forEach(header => {
		header.addEventListener('click', function () {
			const panel = this.nextElementSibling
			if (!panel || !panel.classList.contains('accordion__panel')) return

			const icon = this.querySelector('.accordion__icon')
			const isOpen = panel.classList.contains('open')

			if (isOpen) {
				// Zamknij tylko ten panel
				panel.classList.remove('open')
				this.classList.remove('active')
			} else {
				// Otwórz tylko ten panel
				panel.classList.add('open')
				this.classList.add('active')
			}
		})
	})
})

// ======================
// ROZJAŚNIENIE MINIATUREK PRZY HOVER / FOCUS / TAP (BEZ SKALOWANIA)
// ======================
document.addEventListener('DOMContentLoaded', () => {
	const galleryItems = document.querySelectorAll('.gallery-item')

	if (galleryItems.length === 0) return

	galleryItems.forEach(item => {
		// Ustawiamy płynne przejście tylko dla opacity (bez transform)
		item.style.transition = 'opacity 0.3s ease'

		// Hover myszką (desktop/laptop)
		item.addEventListener('mouseenter', () => {
			item.style.opacity = '1'
		})

		item.addEventListener('mouseleave', () => {
			item.style.opacity = '0.85'
		})

		// Focus (nawigacja klawiaturą – Tab)
		item.addEventListener('focus', () => {
			item.style.opacity = '1'
		})

		item.addEventListener('blur', () => {
			item.style.opacity = '0.85'
		})

		// Dotyk na urządzeniach mobilnych – krótkie rozjaśnienie przy tapnięciu
		item.addEventListener(
			'touchstart',
			() => {
				item.style.opacity = '1'
			},
			{ passive: true }
		)

		item.addEventListener('touchend', () => {
			setTimeout(() => {
				item.style.opacity = '0.85'
			}, 200)
		})

		item.addEventListener('touchcancel', () => {
			item.style.opacity = '0.85'
		})
	})
})

// ======================
// MOUSE DRAG TO SCROLL – PRZEWIJANIE GALERIĄ MYSZKĄ (bez zmian)
// ======================
document.addEventListener('DOMContentLoaded', () => {
	const galleryContainer = document.getElementById('gallery-container')
	if (!galleryContainer) return

	let isDown = false
	let startX
	let scrollLeft

	galleryContainer.addEventListener('mousedown', e => {
		isDown = true
		galleryContainer.classList.add('active')
		startX = e.pageX - galleryContainer.offsetLeft
		scrollLeft = galleryContainer.scrollLeft
	})

	galleryContainer.addEventListener('mouseleave', () => {
		isDown = false
		galleryContainer.classList.remove('active')
	})

	galleryContainer.addEventListener('mouseup', () => {
		isDown = false
		galleryContainer.classList.remove('active')
	})

	galleryContainer.addEventListener('mousemove', e => {
		if (!isDown) return
		e.preventDefault()
		const x = e.pageX - galleryContainer.offsetLeft
		const walk = (x - startX) * 2
		galleryContainer.scrollLeft = scrollLeft - walk
	})
})
