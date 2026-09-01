/*! ppaul/syl - profile v1.0.2 | MIT License | https://sylhermanos.com */
	const profilePages = document.getElementById('profile-pages');
	const profileGlobalNav = document.getElementById('profile-global-nav');
	const homeProfilePage = document.getElementById('page-company-profile');
	const verticalPages = document.querySelectorAll('[data-vertical-page]');
	const pageLinks = document.querySelectorAll('[data-page-link]');
	const monitorDots = document.querySelectorAll('.profile-monitor-dot');
	const themeToggles = document.querySelectorAll('[data-theme-toggle]');
	const mobileQuery = window.matchMedia('(max-width: 1024px) and (orientation: portrait)');
	let horizontalScrollLocked = false;
	let mobileNavStickAt = null;

	const isMobileLayout = () => mobileQuery.matches;

	// One nav is shared by both layouts. Its source location is in the mobile
	// document flow; desktop moves that same element outside the horizontal scroller.
	const placeGlobalNav = () => {
		if (!profileGlobalNav || !homeProfilePage) return;
		if (isMobileLayout()) {
			homeProfilePage.append(profileGlobalNav);
			return;
		}
		profilePages.after(profileGlobalNav);
	};

	const goToPage = (pageIndex) => {
		const sections = [...document.querySelectorAll('.profile-page')];
		const targetSection = sections[pageIndex];
		if (!targetSection) return;

		if (isMobileLayout()) {
			targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
			return;
		}

		profilePages.scrollTo({
			left: pageIndex * profilePages.clientWidth,
			behavior: 'smooth'
		});
	};

	const updateMobileControls = () => {
		if (isMobileLayout()) {
			document.body.style.overflow = 'auto';
			document.documentElement.style.overflow = 'auto';
			profilePages.style.display = 'block';
			profilePages.style.width = '100%';
			profilePages.style.height = 'auto';
			profilePages.style.maxHeight = 'none';
			profilePages.style.overflowX = 'hidden';
			profilePages.style.overflowY = 'visible';
			profilePages.style.scrollSnapType = 'y proximity';
			profilePages.style.scrollBehavior = 'smooth';
			profilePages.scrollLeft = 0;
			return;
		}

		document.body.style.overflow = 'hidden';
		document.documentElement.style.overflow = 'hidden';
		profilePages.style.display = 'flex';
		profilePages.style.width = '100vw';
		profilePages.style.height = '100vh';
		profilePages.style.maxHeight = '100vh';
		profilePages.style.overflowX = 'auto';
		profilePages.style.overflowY = 'hidden';
		profilePages.style.scrollSnapType = 'x mandatory';
		profilePages.style.scrollBehavior = 'smooth';
	};

	pageLinks.forEach((link) => {
		link.addEventListener('click', (event) => {
			event.preventDefault();
			const pageIndex = Number(link.dataset.pageLink);
			goToPage(pageIndex);
			syncActiveNavState(pageIndex);
		});
	});
	mobileQuery.addEventListener?.('change', () => {
		mobileNavStickAt = null;
		placeGlobalNav();
		updateMobileControls();
		syncActiveNavState(isMobileLayout() ? 0 : Math.round(profilePages.scrollLeft / profilePages.clientWidth));
	});
	placeGlobalNav();
	updateMobileControls();

	const galleryCarousel = document.querySelector('[data-gallery-carousel]');
	const galleryCards = galleryCarousel ? [...galleryCarousel.querySelectorAll('.profile-gallery-card')] : [];
	const galleryPagination = document.querySelector('[data-gallery-pagination]');
	const galleryPrev = document.querySelector('[data-gallery-prev]');
	const galleryNext = document.querySelector('[data-gallery-next]');

	if (galleryCarousel && galleryPagination && galleryCards.length) {
		let activeGalleryIndex = Math.floor(galleryCards.length / 2);
		let pointerStartX = 0;
		let isPointerDragging = false;
		let galleryAutoAdvance = null;

		const setActiveGalleryCard = (index) => {
			activeGalleryIndex = (index + galleryCards.length) % galleryCards.length;
			galleryCards.forEach((card, cardIndex) => {
				const distance = (cardIndex - activeGalleryIndex + galleryCards.length) % galleryCards.length;
				card.classList.toggle('is-active', cardIndex === activeGalleryIndex);
				card.classList.toggle('is-next', distance === 1);
				card.classList.toggle('is-prev', distance === galleryCards.length - 1);
			});
			[...galleryPagination.children].forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === activeGalleryIndex));
		};

		const pauseGalleryAutoAdvance = () => {
			if (galleryAutoAdvance) window.clearInterval(galleryAutoAdvance);
			galleryAutoAdvance = null;
		};

		const startGalleryAutoAdvance = () => {
			pauseGalleryAutoAdvance();
			galleryAutoAdvance = window.setInterval(() => setActiveGalleryCard(activeGalleryIndex + 1), 6000);
		};

		galleryCards.forEach((card, index) => {
			const dot = document.createElement('button');
			dot.type = 'button';
			dot.setAttribute('aria-label', `Show gallery image ${index + 1}`);
			dot.addEventListener('click', () => {
				setActiveGalleryCard(index);
				startGalleryAutoAdvance();
			});
			galleryPagination.append(dot);
			card.addEventListener('click', () => {
				setActiveGalleryCard(index);
				startGalleryAutoAdvance();
			});
		});

		setActiveGalleryCard(activeGalleryIndex);

		galleryPrev?.addEventListener('click', () => {
			setActiveGalleryCard(activeGalleryIndex - 1);
			startGalleryAutoAdvance();
		});
		galleryNext?.addEventListener('click', () => {
			setActiveGalleryCard(activeGalleryIndex + 1);
			startGalleryAutoAdvance();
		});
		galleryCarousel.addEventListener('pointerdown', (event) => {
			isPointerDragging = true;
			pointerStartX = event.clientX;
			pauseGalleryAutoAdvance();
		});
		galleryCarousel.addEventListener('pointerup', (event) => {
			if (!isPointerDragging) return;
			const delta = event.clientX - pointerStartX;
			isPointerDragging = false;
			if (Math.abs(delta) >= 36) setActiveGalleryCard(activeGalleryIndex + (delta < 0 ? 1 : -1));
			startGalleryAutoAdvance();
		});
		galleryCarousel.addEventListener('pointercancel', () => {
			isPointerDragging = false;
			startGalleryAutoAdvance();
		});
		galleryCarousel.addEventListener('keydown', (event) => {
			if (event.key === 'ArrowLeft') setActiveGalleryCard(activeGalleryIndex - 1);
			if (event.key === 'ArrowRight') setActiveGalleryCard(activeGalleryIndex + 1);
			if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') startGalleryAutoAdvance();
		});
		galleryCarousel.addEventListener('pointerenter', pauseGalleryAutoAdvance);
		galleryCarousel.addEventListener('pointerleave', startGalleryAutoAdvance);
		galleryCarousel.addEventListener('focusin', pauseGalleryAutoAdvance);
		galleryCarousel.addEventListener('focusout', startGalleryAutoAdvance);
		startGalleryAutoAdvance();
	}

	const teamGallery = document.querySelector('[data-team-gallery]');
	const teamSlides = teamGallery ? [...teamGallery.querySelectorAll('.profile-team-slide')] : [];
	const teamPagination = document.querySelector('[data-team-gallery-pagination]');
	const teamPrev = document.querySelector('[data-team-gallery-prev]');
	const teamNext = document.querySelector('[data-team-gallery-next]');

	if (teamGallery && teamPagination && teamSlides.length) {
		let activeTeamIndex = 0;
		let teamPointerStartX = 0;
		let isTeamDragging = false;
		let teamAutoAdvance = null;

		const setActiveTeamSlide = (index) => {
			activeTeamIndex = (index + teamSlides.length) % teamSlides.length;
			teamSlides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === activeTeamIndex));
			[...teamPagination.children].forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === activeTeamIndex));
		};

		const pauseTeamAutoAdvance = () => {
			if (teamAutoAdvance) window.clearInterval(teamAutoAdvance);
			teamAutoAdvance = null;
		};

		const startTeamAutoAdvance = () => {
			pauseTeamAutoAdvance();
			teamAutoAdvance = window.setInterval(() => setActiveTeamSlide(activeTeamIndex + 1), 6000);
		};

		teamSlides.forEach((slide, index) => {
			const dot = document.createElement('button');
			dot.type = 'button';
			dot.setAttribute('aria-label', `Show ${slide.querySelector('.profile-team-slide-caption span')?.textContent || 'team'} image`);
			dot.addEventListener('click', () => {
				setActiveTeamSlide(index);
				startTeamAutoAdvance();
			});
			teamPagination.append(dot);
		});

		teamPrev?.addEventListener('click', () => {
			setActiveTeamSlide(activeTeamIndex - 1);
			startTeamAutoAdvance();
		});
		teamNext?.addEventListener('click', () => {
			setActiveTeamSlide(activeTeamIndex + 1);
			startTeamAutoAdvance();
		});
		teamGallery.addEventListener('pointerdown', (event) => {
			isTeamDragging = true;
			teamPointerStartX = event.clientX;
			pauseTeamAutoAdvance();
		});
		teamGallery.addEventListener('pointerup', (event) => {
			if (!isTeamDragging) return;
			const delta = event.clientX - teamPointerStartX;
			isTeamDragging = false;
			if (Math.abs(delta) >= 36) setActiveTeamSlide(activeTeamIndex + (delta < 0 ? 1 : -1));
			startTeamAutoAdvance();
		});
		teamGallery.addEventListener('pointercancel', () => {
			isTeamDragging = false;
			startTeamAutoAdvance();
		});
		teamGallery.addEventListener('keydown', (event) => {
			if (event.key === 'ArrowLeft') setActiveTeamSlide(activeTeamIndex - 1);
			if (event.key === 'ArrowRight') setActiveTeamSlide(activeTeamIndex + 1);
			if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') startTeamAutoAdvance();
		});
		teamGallery.addEventListener('pointerenter', pauseTeamAutoAdvance);
		teamGallery.addEventListener('pointerleave', startTeamAutoAdvance);
		teamGallery.addEventListener('focusin', pauseTeamAutoAdvance);
		teamGallery.addEventListener('focusout', startTeamAutoAdvance);

		setActiveTeamSlide(activeTeamIndex);
		startTeamAutoAdvance();
	}

	const syncActiveNavState = (pageIndex) => {
		profileGlobalNav?.classList.toggle('is-home', pageIndex === 0);
		pageLinks.forEach((link) => {
			const isActive = Number(link.dataset.pageLink) === pageIndex;
			link.classList.toggle('is-active', isActive);
		});
		monitorDots.forEach((dot) => {
			const isActive = Number(dot.dataset.pageLink) === pageIndex;
			dot.classList.toggle('is-active', isActive);
		});
	};

	const whyChooseUsButton = document.getElementById('whychooseus_button');
	const whyChooseUsPanel = document.getElementById('company-profile-whychooseus-panel');
	const whyChooseUsSummary = document.getElementById('company-profile-page1-summary');
	if (whyChooseUsButton && whyChooseUsPanel && whyChooseUsSummary) {
		const whyChooseUsLabel = whyChooseUsButton.querySelector('span');
		const whyChooseUsIcon = whyChooseUsButton.querySelector('i');
		const setWhyChooseUsState = (isOpen) => {
			whyChooseUsSummary.classList.toggle('is-hidden', isOpen);
			whyChooseUsPanel.classList.toggle('is-open', isOpen);
			whyChooseUsButton.classList.toggle('is-open', isOpen);
			whyChooseUsButton.setAttribute('aria-expanded', String(isOpen));
			whyChooseUsPanel.setAttribute('aria-hidden', String(!isOpen));

			if (whyChooseUsLabel) {
				whyChooseUsLabel.textContent = isOpen ? 'show less' : 'show more...';
			}
			if (whyChooseUsIcon) {
				whyChooseUsIcon.classList.toggle('fa-eye', !isOpen);
				whyChooseUsIcon.classList.toggle('fa-eye-slash', isOpen);
			}
		};

		whyChooseUsButton.addEventListener('click', () => {
			const isOpen = whyChooseUsButton.getAttribute('aria-expanded') === 'true';
			setWhyChooseUsState(!isOpen);
		});
	}

	const syncMobileScrollState = () => {
		if (!isMobileLayout()) return;

		const sections = [...document.querySelectorAll('.profile-page')];
		const scrollPosition = Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop, profilePages.scrollTop);
		// Keep the current item active until the next page reaches the sticky header.
		const viewportMarker = scrollPosition + Math.max(96, profileGlobalNav?.offsetHeight || 0);
		let activeIndex = 0;
		sections.forEach((section, index) => {
			if (viewportMarker >= section.offsetTop) activeIndex = index;
		});
		syncActiveNavState(activeIndex);

		if (!profileGlobalNav) return;
		if (activeIndex !== 0) {
			profileGlobalNav.classList.remove('is-mobile-stuck');
			return;
		}

		if (mobileNavStickAt === null) {
			mobileNavStickAt = profileGlobalNav.getBoundingClientRect().top + scrollPosition;
		}
		profileGlobalNav.classList.toggle('is-mobile-stuck', scrollPosition >= mobileNavStickAt);
	};

	profilePages.addEventListener('scroll', () => {
		if (isMobileLayout()) {
			syncMobileScrollState();
			return;
		}
		const pageIndex = Math.round(profilePages.scrollLeft / profilePages.clientWidth);
		syncActiveNavState(pageIndex);
	});

	window.addEventListener('scroll', syncMobileScrollState, { passive: true });
	document.addEventListener('scroll', syncMobileScrollState, { capture: true, passive: true });
	mobileQuery.addEventListener?.('change', syncMobileScrollState);
	window.addEventListener('resize', () => { mobileNavStickAt = null; }, { passive: true });

	const applyTheme = (isDark) => {
		document.documentElement.classList.toggle('dark', isDark);
		localStorage.setItem('syl-theme', isDark ? 'dark' : 'light');
		themeToggles.forEach((toggle) => {
			toggle.setAttribute('aria-pressed', String(isDark));
			toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
		});
	};

	themeToggles.forEach((themeToggle) => themeToggle.addEventListener('click', () => {
		const isDark = document.documentElement.classList.toggle('dark');
		applyTheme(isDark);
	}));

	if (localStorage.getItem('syl-theme') === 'dark') {
		applyTheme(true);
	}

	const moveToNextHorizontalPage = (direction) => {
		if (horizontalScrollLocked) {
			return;
		}

		const currentPage = Math.round(profilePages.scrollLeft / profilePages.clientWidth);
		const nextPage = Math.max(0, Math.min(document.querySelectorAll('.profile-page').length - 1, currentPage + direction));
		if (nextPage === currentPage) return;

		horizontalScrollLocked = true;
		goToPage(nextPage);
		syncActiveNavState(nextPage);

		window.setTimeout(() => {
			horizontalScrollLocked = false;
		}, 700);
	};

	profilePages.addEventListener('wheel', (event) => {
		if (isMobileLayout()) {
			return;
		}

		if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
			return;
		}

		const movingDown = event.deltaY > 0;
		const scrollingTarget = event.target.closest('[data-vertical-page]');
		if (scrollingTarget) {
			const atTop = scrollingTarget.scrollTop <= 1;
			const atBottom = scrollingTarget.scrollTop + scrollingTarget.clientHeight >= scrollingTarget.scrollHeight - 1;
			if ((movingDown && !atBottom) || (!movingDown && !atTop)) return;
		}

		event.preventDefault();
		moveToNextHorizontalPage(movingDown ? 1 : -1);
	}, { passive: false });

	const policyOpeners = document.querySelectorAll('[data-policy-open]');
	let policyReturnControl = null;
	policyOpeners.forEach((opener) => {
		opener.addEventListener('click', () => {
			const dialog = document.getElementById(`${opener.dataset.policyOpen}-policy-dialog`);
			if (!dialog) return;
			policyReturnControl = opener;
			dialog.showModal();
			dialog.querySelector('[data-policy-close]')?.focus();
		});
	});

	document.querySelectorAll('.profile-policy-dialog').forEach((dialog) => {
		dialog.querySelector('[data-policy-close]')?.addEventListener('click', () => dialog.close());
		dialog.addEventListener('click', (event) => {
			if (event.target === dialog) dialog.close();
		});
		dialog.addEventListener('close', () => policyReturnControl?.focus());
	});

	syncActiveNavState(0);
	syncMobileScrollState();

	/*! syl-ppaul protection | sylhermanos.com */
	document.addEventListener('keydown', function(e) {
	if (e.key === 'F12') {
		e.preventDefault();
		return false;
	}
	if (e.ctrlKey && e.shiftKey && e.key === 'I') {
		e.preventDefault();
		return false;
	}
	if (e.ctrlKey && e.key === 'U') {
		e.preventDefault();
		return false;
	}
	if (e.ctrlKey && e.shiftKey && e.key === 'J') {
		e.preventDefault();
		return false;
	}
	if (e.ctrlKey && e.shiftKey && e.key === 'C') {
		e.preventDefault();
		return false;
	}
	if (e.ctrlKey && e.key === 'p') {
		e.preventDefault();
		return false;
	}
	if (e.ctrlKey && e.shiftKey && e.key === 'P') {
		e.preventDefault();
		return false;
	}
	if (e.key === 'PrintScreen') {
		e.preventDefault();
		blockScreenshotMoment();
		return false;
	}
	if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === 's' || e.key === '4')) {
		e.preventDefault();
		blockScreenshotMoment();
		return false;
	}
	});

	function blockScreenshotMoment() {
	document.documentElement.classList.add('screenshot-blocked');
	setTimeout(() => {
		document.documentElement.classList.remove('screenshot-blocked');
	}, 300);
	// Optional fallback: show warning
	const warning = document.createElement('div');
	warning.textContent = 'Screenshot is blocked. Please do not capture this content.';
	warning.style.position = 'fixed';
	warning.style.left = '50%';
	warning.style.top = '10px';
	warning.style.transform = 'translateX(-50%)';
	warning.style.background = 'rgba(0,0,0,0.8)';
	warning.style.color = '#fff';
	warning.style.padding = '8px 14px';
	warning.style.borderRadius = '8px';
	warning.style.zIndex = '999999999';
	warning.style.pointerEvents = 'none';
	document.body.appendChild(warning);
	setTimeout(() => warning.remove(), 1200);
	}

	window.addEventListener('visibilitychange', function() {
	if (document.visibilityState === 'hidden') {
		document.documentElement.classList.add('screenshot-blocked');
	} else {
		setTimeout(() => document.documentElement.classList.remove('screenshot-blocked'), 150);
	}
	});

	document.addEventListener('contextmenu', function(e) {
	// Prevent right-click context menu everywhere on the page (482)
	e.preventDefault();
	return false;
	});

	document.addEventListener('contextmenu', function(e) {
	if (e.target.tagName === 'IMG') {
		e.preventDefault();
		return false;
	}
	});


	window.print = function() {
	alert('Printing is disabled on this page.');
	return false;
	};

	window.addEventListener('beforeprint', function(e) {
	e.preventDefault();
	alert('Printing is disabled on this page.');
	});

	let devtoolsOpen = false;
	let alertInterval = null;

	const threshold = 160;

	const detectDevTools = () => {
	const isOpen =
		window.outerHeight - window.innerHeight > threshold ||
		window.outerWidth - window.innerWidth > threshold;

	if (isOpen) {
		if (!devtoolsOpen) {
		devtoolsOpen = true;
		alertInterval = setInterval(() => {
			alert('Developer tools detected. Your Device, IP Address and logs are detected! Please close the developer tools now for better experience.');
		}, 800);
		}
	} else {
		if (devtoolsOpen) {
		devtoolsOpen = false;
		clearInterval(alertInterval);
		alertInterval = null;
		}
	}
	};

	setInterval(detectDevTools, 500);
