const { esc, nl2br, pad2 } = require('./render-helpers');

function renderHead() {
  return `<!DOCTYPE html>
<html lang="en">
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="assets/css/output.css">
	<link rel="stylesheet" href="assets/css/profile.css">
	<link rel="stylesheet" href="assets/Font-Awesome-7.x/css/all.min.css">
	<title>SYL Hermanos</title>
  <script type="text/javascript">
    (function(c, l, a, r, i, t, y) {
      c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "waircx02dk");
  </script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-0KBYN391NQ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-0KBYN391NQ');
  </script>

  <link rel="stylesheet" href="assets/css/mobile.css">
  <script src="assets/js/protect.js" defer></script>
</head>`;
}

function renderAboutGallery(items) {
  return items
    .map(
      (item, i) => `
									<article class="profile-gallery-card">
										<img src="${esc(item.image)}" alt="${esc(item.alt)}">
										<div class="profile-gallery-caption">
											<div>
												<span class="profile-gallery-caption-label">SYL Hermanos</span>
												<p>${nl2br(esc(item.tagline || ''))}</p>
											</div>
											<span class="profile-gallery-caption-index" aria-label="Gallery image">${pad2(i + 1)}</span>
										</div>
									</article>`
    )
    .join('');
}

function renderTeamGallery(items) {
  return items
    .map(
      (team, i) => `
									<article class="profile-team-slide">
										<img src="${esc(team.image)}" alt="${esc(team.alt)}">
										<div class="profile-team-slide-caption">
											<span>${esc(team.department)}</span>
											<p>${esc(team.tagline)}</p>
											<small>${pad2(i + 1)}</small>
										</div>
									</article>`
    )
    .join('');
}

function renderPrincipalRail(items) {
  if (!items.length) return '';
  const setOne = items
    .map(
      (p) => `
										<figure class="profile-principal-logo">
											<img src="${esc(p.image)}" alt="${esc(p.name)} logo">
										</figure>`
    )
    .join('');
  const setTwo = items
    .map((p) => `\n											<figure class="profile-principal-logo"><img src="${esc(p.image)}" alt=""></figure>`)
    .join('');
  return `
						<div class="profile-principal-rail" aria-label="SYL principals and partners">
							<div class="profile-principal-rail-track">
								<div class="profile-principal-rail-set">${setOne}
								</div>
								<div class="profile-principal-rail-set" aria-hidden="true">${setTwo}
								</div>
							</div>
						</div>`;
}

function renderAwardCards(awardItems) {
  return awardItems
    .map((award) => {
      const media = award.image
        ? `<img src="${esc(award.image)}" alt="${esc(award.title)}">`
        : `<i class="fa-solid ${esc(award.icon)}" aria-hidden="true"></i>`;
      const caption = award.image ? 'Award recognition' : 'Image coming soon';
      return `
											<article class="profile-award-card">
												${media}
												<h4>${esc(award.title)}</h4>
												<span>${caption}</span>
											</article>`;
    })
    .join('');
}

function renderAwardsRail(awardItems) {
  const set = renderAwardCards(awardItems);
  return [0, 1]
    .map(
      (copy) => `
									<div class="profile-content-rail-set"${copy ? ' aria-hidden="true"' : ''}>${set}
									</div>`
    )
    .join('');
}

function renderReviewCards(reviewProfiles) {
  return reviewProfiles
    .map(
      (review) => `
											<article class="profile-review-card">
												<div class="profile-review-card-top"><i class="fa-solid fa-user" aria-hidden="true"></i><div><strong>${esc(review.name)}</strong><span>${esc(review.type)}</span></div></div>
												<p class="profile-review-pending">Verified review will appear here after customer approval.</p>
											</article>`
    )
    .join('');
}

function renderReviewsRail(reviewProfiles) {
  const set = renderReviewCards(reviewProfiles);
  return [0, 1]
    .map(
      (copy) => `
									<div class="profile-content-rail-set"${copy ? ' aria-hidden="true"' : ''}>${set}
									</div>`
    )
    .join('');
}

function renderPrincipalDirectory(items) {
  return items
    .map(
      (principal) => `
								<article class="profile-principal-directory-card">
									<div class="profile-principal-directory-logo">
										<img src="${esc('assets/library/images/principals/' + principal.logo)}" alt="${esc(principal.name)} logo">
									</div>
									<div class="profile-principal-directory-content">
										<h3>${esc(principal.name)}</h3>
										<p>${esc(principal.summary)}</p>
										<a href="${esc(principal.url)}" target="_blank" rel="noreferrer">
											Visit brand site <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
										</a>
									</div>
								</article>`
    )
    .join('');
}

function renderCareerCards(openings) {
  return openings
    .map((opening) => {
      const requirements = opening.requirements.map((r) => `<li>${esc(r)}</li>`).join('');
      return `
								<article class="profile-career-card">
									<div class="profile-career-card-top"><span>${esc(opening.team)}</span><i class="fa-solid fa-briefcase" aria-hidden="true"></i></div>
									<h3>${esc(opening.title)}</h3>
									<ul>${requirements}</ul>
									<p class="profile-career-location"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${esc(opening.location)}</p>
								</article>`;
    })
    .join('');
}

function renderPage(data) {
  const {
    aboutGalleryItems,
    teamGalleryItems,
    principalLogoItems,
    awardItems,
    principalDirectoryItems,
    careerOpenings,
  } = data;

  const reviewProfiles = [
    { type: 'Customer 01', name: 'Lican****' },
    { type: 'Customer 02', name: 'Sam’s****' },
    { type: 'Business Partner 01', name: 'Jocelyn****' },
    { type: 'Business Partner 02', name: 'Mark****' },
    { type: 'Business Partner 03', name: 'Jenalyn****' },
  ];

  return `${renderHead()}

<body class="h-screen overflow-hidden">
	<main id="profile-pages" class="flex h-screen w-screen snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth overscroll-x-contain">
		<section id="page-company-profile" class="profile-page h-screen min-w-full snap-start" aria-label="Company Profile">
			<div class="profile-reference-layout mx-auto flex h-full max-w-[80rem] flex-col px-6 pb-24 pt-8 sm:px-10">
				<div class="profile-theme-logo profile-reference-logo mx-auto w-full max-w-[38rem]" role="img" aria-label="SYL Hermanos Group of Companies logo">
					<img class="profile-theme-logo-light" src="assets/library/images/uploads/sylhermanos-gc-a.png" alt="">
					<img class="profile-theme-logo-dark" src="assets/library/images/uploads/sylhermanos-gc-b.png" alt="">
				</div>
				<div class="profile-companies mt-5 grid grid-cols-2 gap-x-5 gap-y-3 text-center sm:grid-cols-4">
					<span>SYL Hermanos Trade Center, INC.</span>
					<span>SYL Hermanos Distributors, Inc.</span>
					<span>SYL Hermanos Food Services, Inc.</span>
					<span>SYL Hermanos Industrial Sales, Inc.</span>
				</div>
				<header id="profile-global-nav" class="profile-global-nav is-home">
					<nav class="profile-global-nav-layout" aria-label="Company sections">
						<div class="profile-theme-logo profile-global-nav-logo" role="img" aria-label="SYL Hermanos"><img class="profile-theme-logo-light" src="assets/library/images/uploads/sylhermanos-gc-a.png" alt=""><img class="profile-theme-logo-dark" src="assets/library/images/uploads/sylhermanos-gc-b.png" alt=""></div>
						<div class="profile-global-nav-links">
							<a class="profile-reference-nav-link is-active" href="#page-company-profile" data-page-link="0"><i class="fa-solid fa-house" aria-hidden="true"></i><span>HOME</span></a>
							<a class="profile-reference-nav-link" href="#page-gallery" data-page-link="1"><i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>ABOUT US</span></a>
							<a class="profile-reference-nav-link" href="#page-content-one" data-page-link="2"><i class="fa-solid fa-handshake" aria-hidden="true"></i><span>PRINCIPALS</span></a>
							<a class="profile-reference-nav-link" href="#page-content-two" data-page-link="3"><i class="fa-solid fa-briefcase" aria-hidden="true"></i><span>CAREERS</span></a>
							<a class="profile-reference-nav-link" href="#page-content-footer" data-page-link="4"><i class="fa-solid fa-envelope" aria-hidden="true"></i><span>CONTACT US</span></a>
							<button id="theme-toggle" class="profile-theme-button" type="button" data-theme-toggle aria-label="Switch to dark theme" aria-pressed="false"><span aria-hidden="true"><i class="fa-solid fa-sun"></i><i class="fa-solid fa-moon"></i></span></button>
						</div>
					</nav>
				</header>
				<div class="text-center company-profile-page1-summary" id="company-profile-page1-summary">
					<h1 class="py-8 profile-reference-tagline">Passionately build brands.</h1>
					<div class="profile-reference-copy mx-auto max-w-[70rem] text-left">
						<span class="py-2">
						SYL Hermanos Trade Center, Inc. (SYL) is a leading consumer goods distribution company preferred by other establishments in the Visayas. 
						Known for its transparency and instinctive direction, SYL, together with its subsidiaries that handle the diverse distribution business, 
						firmly believes in delivering excellent service to its customers while forging strong partnerships with their principals. 
						</span><br><br><span>
						Spearheaded by an innovative management and a dynamic team, service became a passion driven value within the organization and 
						providing 100% customer satisfaction was not just a byword but a part of the integrity and patrimony that goes with the name – SYL.
						<a href="#page-gallery" data-page-link="1">- read more...</a></span>
					</div>
				</div>

				<div class="px-6 mt-5 p-whychooseus" id="whychooseus">
					<div class="p-whychooseus-trigger">
						<h1 for="whychooseus">Why choose us?</h1>
						<button type="button" id="whychooseus_button" class="cursor-pointer" aria-expanded="false" aria-controls="company-profile-whychooseus-panel">
							<i class="fa-solid fa-eye"></i>
							<span>show more...</span>
						</button>
					</div>
					<div class="company-profile-whychooseus-panel" id="company-profile-whychooseus-panel" aria-hidden="true">
						<div class="company-profile-whychooseus-grid">
							<article class="company-profile-whychooseus-card">
								<div class="company-profile-whychooseus-icon"><i class="fa-solid fa-wallet"></i></div>
								<h3>Financial strength</h3>
								<p>SYL has built a reputation on its financial capacity and approach to business.</p>
							</article>
							<article class="company-profile-whychooseus-card">
								<div class="company-profile-whychooseus-icon"><i class="fa-solid fa-computer"></i></div>
								<h3>System support</h3>
								<p>Software programs developed by SYL’s IT team help enhance the system of distributorship.</p>
							</article>
							<article class="company-profile-whychooseus-card">
								<div class="company-profile-whychooseus-icon"><i class="fa-solid fa-mobile-screen-button"></i></div>
								<h3>Field enablement</h3>
								<p>POS systems for the sales team help speed up transactions and improve control.</p>
							</article>
							<article class="company-profile-whychooseus-card">
								<div class="company-profile-whychooseus-icon"><i class="fa-solid fa-chart-column"></i></div>
								<h3>Data-driven decisions</h3>
								<p>Timely and accurate reports and analysis give the business better direction and visibility.</p>
							</article>
							<article class="company-profile-whychooseus-card">
								<div class="company-profile-whychooseus-icon"><i class="fa-solid fa-handshake"></i></div>
								<h3>Partner alignment</h3>
								<p>Aligned with the needs of principals, transparency and planned strategies are done regularly.</p>
							</article>
							<article class="company-profile-whychooseus-card">
								<div class="company-profile-whychooseus-icon"><i class="fa-solid fa-shield-heart"></i></div>
								<h3>Core values</h3>
								<p>The value of integrity and transparency is practiced by management and employees every day.</p>
							</article>
						</div>
					</div>
				</div>


			</div>

		</section>

		<section id="page-gallery" class="profile-page h-screen min-w-full snap-start overflow-hidden" aria-label="About Us">
			<div class="h-full overflow-y-auto overscroll-y-contain" data-vertical-page>
				<div class="profile-about-shell">
					<section class="profile-about-section profile-gallery-shell" aria-labelledby="gallery-title">
						<div class="profile-gallery-frame">
							<button class="profile-gallery-nav profile-gallery-nav-prev" type="button" data-gallery-prev aria-label="Previous gallery image">
								<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
							</button>

							<div class="profile-gallery-carousel" data-gallery-carousel tabindex="0" aria-label="SYL Hermanos gallery. Use the arrow keys to change images.">${renderAboutGallery(aboutGalleryItems)}
							</div>

							<button class="profile-gallery-nav profile-gallery-nav-next" type="button" data-gallery-next aria-label="Next gallery image">
								<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
							</button>
						</div>
						<div class="profile-gallery-pagination" data-gallery-pagination aria-label="Gallery position"></div>
					</section>

					<section class="profile-about-section profile-company-details" aria-labelledby="details-title" id="company-details">
						<h2 id="details-title">Who is SYL?</h2>

						<p class="profile-company-summary">
							<span class="mt-2">SYL Hermanos Trade Center, Inc. (SYL) is a leading consumer goods distribution company. Known for its transparency and instinctive direction, SYL, together with its subsidiaries that handle the diverse distribution business, firmly believes in delivering excellent service to its customers while forging strong partnerships with its principals.
							</span>
							<span class="mt-2">
								Driven by the passion to build businesses and provide employment, SYL Hermanos Trade Center, Inc. was established. It is a company that offers value and delivers expectations to its principals in the Visayas Island through commitment, hard work, and zeal of one of the best teams in Panay and Negros.
							</span>
							<span class="mt-2">
								Spearheaded by an innovative management and a dynamic team, service became a passion driven value within the organization and providing 100% customer satisfaction was not just a byword but a part of the integrity and patrimony that goes with the name – SYL.
							</span>
							<span class="mt-2">
								Effectively making products available in a diverse community, SYL maintains its quality and service in every endeavor in the hopes of continuously contributing in the economic and social growth in the islands of Panay and Negros.
							</span>
							<span class="mt-2">
								While successfully making a name in the distribution industry, it has fostered values and standards worthy of a legacy that can address the needs of each principal. Experience and heritage in this line of business has made SYL a pioneer, not because of its past, but more importantly, what it can do for the future.
							</span>
						</p>


						<div class="profile-glass-grid profile-three-grid">
							<article class="profile-glass-card profile-company-purpose-row">
								<i class="fa-solid fa-bullseye"></i>
								<h3>Mission</h3>
								<p>To provide exceptional service through people who are passionate about building brands, cultivating new businesses, preserving partnerships, delivering exceptional results and exceeding expectations.</p>
							</article>
							<article class="profile-glass-card profile-company-purpose-row">
								<i class="fa-solid fa-eye"></i>
								<h3>Vision</h3>
								<p>To be the ultimate distribution partner and exceptional brand builder delivering superior business returns and expanded portfolio of world-class products as diverse as the communities we serve.</p>
							</article>
							<article class="profile-glass-card profile-company-purpose-row">
								<i class="fa-solid fa-compass"></i>
								<h3>Our Values</h3>
								<p>SYL keeps in mind its core values – integrity, innovation, development, excellence, efficiency, humility, entrepreneurial spirit and customer focus – practiced and lived by upper management and the staff, this has brought credibility and deeper purpose for the company down to its employees.</p>
							</article>
						</div>
						<div class="profile-company-beliefs">
							<article class="profile-company-philosophy">
								<p class="profile-about-kicker">Our philosophy</p>
								<h3>Respect the past.<br>Build the future.</h3>
								<p>SYL upholds and strongly believes in tradition—respect for elders, paying homage to the past, and honoring family. Adhering to these principles, even as the company is steered into the 21st century while facing more challenges, has maintained its business ethics, integrity, and honor.</p>
								<figure class="profile-philosophy-image">
									<img src="assets/library/images/pp/sylpp-layouts/syl-our-philosophy-a.png" alt="Illustration representing SYL's philosophy of elder experience, ethics, family values, and future progress">
								</figure>
								<div class="profile-philosophy-principles"><article><span>01</span><div><strong>Respect for elders</strong><p>Respect is a positive feeling of esteem. Knowledge and experience from our elders show that they are the master and we are the student. Their wisdom builds lives where learning from the past brings progress into the future.</p></div></article><article><span>02</span><div><strong>Homage to the past</strong><p>The past shows where we came from, who we are, and how we became what we are. Our families, communities, and societies are our heritage; we uphold it so we will always remember.</p></div></article><article><span>03</span><div><strong>Honoring family</strong><p>Family is the basic unit in every society. Values begin with parents and flow to their children. We love, serve, teach, and learn from one another as we grow into the world.</p></div></article></div>
							</article>
							<article class="profile-company-values">
								<p class="profile-about-kicker">Our core values</p>
								<h3>What we practice daily.</h3>
								<div class="profile-core-values-grid"><article><i class="fa-solid fa-shield-halved"></i><strong>Integrity</strong><p>We place honesty and transparency above all other interests.</p></article><article><i class="fa-solid fa-lightbulb"></i><strong>Innovation</strong><p>We encourage creativity, render new ideas, develop unique solutions, and support people bold enough to do so.</p></article><article><i class="fa-solid fa-seedling"></i><strong>Development</strong><p>We hire great people and provide them with an environment for learning and growth.</p></article><article><i class="fa-solid fa-award"></i><strong>Excellence</strong><p>We foster a habit of setting goals, detailed preparation, and commitment to continuous development.</p></article><article><i class="fa-solid fa-gauge-high"></i><strong>Efficiency</strong><p>We aim to do things right and achieve the best possible.</p></article><article><i class="fa-solid fa-hand-holding-heart"></i><strong>Humility</strong><p>We have the humility to recognize our errors and understand that we can always improve.</p></article><article><i class="fa-solid fa-rocket"></i><strong>Entrepreneurial spirit</strong><p>We foster business-minded people, find opportunity in every instance, and cultivate seeds that spring great enterprise.</p></article><article><i class="fa-solid fa-people-group"></i><strong>Customer focus</strong><p>We place responsibility before profits, anticipate customer needs, and exceed their expectations.</p></article></div>
							</article>
						</div>
					</section>

					<section class="profile-about-section profile-why-section" aria-labelledby="why-title">
						<p class="profile-about-kicker">&middot; Why choose us</p>
						<h2 id="why-title">Why choose SYL?</h2>
						<p class="profile-why-tagline">We love to passionately build brands for the realities of the field.</p>
						<div class="profile-why-grid">
							<article>
								<i class="fa-solid fa-wallet" aria-hidden="true"></i>
								<h3>Financial strength</h3>
								<p>SYL has built a reputation on its financial capacity and approach to business.</p>
							</article>
							<article>
								<i class="fa-solid fa-computer" aria-hidden="true"></i>
								<h3>System support</h3>
								<p>Software programs developed by SYL’s IT team help enhance the system of distributorship.</p>
							</article>
							<article>
								<i class="fa-solid fa-mobile-screen-button" aria-hidden="true"></i>
								<h3>Field enablement</h3>
								<p>POS systems for the sales team help speed up transactions and improve control.</p>
							</article>
							<article>
								<i class="fa-solid fa-chart-column" aria-hidden="true"></i>
								<h3>Data-driven decisions</h3>
								<p>Timely and accurate reports and analysis give the business better direction and visibility.</p>
							</article>
							<article>
								<i class="fa-solid fa-handshake" aria-hidden="true"></i>
								<h3>Partner alignment</h3>
								<p>Aligned with the needs of principals, transparency and planned strategies are done regularly.</p>
							</article>
							<article>
								<i class="fa-solid fa-shield-heart" aria-hidden="true"></i>
								<h3>Core values</h3>
								<p>Integrity and transparency are practiced by management and employees every day.</p>
							</article>
						</div>


						<section class="profile-team-showcase" aria-labelledby="team-title">
							<div class="profile-team-showcase-copy">
								<p class="profile-about-kicker">The people behind the work</p>
								<h3 id="team-title">Meet Our Team</h3>
								<p>Composed of young and dynamic employees, SYL is made up of:</p>
								<ol class="profile-team-departments">
									<li>Human Resources</li>
									<li>Audit</li>
									<li>Information Technology</li>
									<li>Sales</li>
									<li>Warehouse &amp; Logistics</li>
									<li>Finance &amp; Accounting</li>
								</ol>
							</div>
							<div class="profile-team-gallery-frame">
								<button class="profile-team-gallery-nav" type="button" data-team-gallery-prev aria-label="Show previous team"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
								<div class="profile-team-gallery" data-team-gallery tabindex="0" aria-label="Meet the SYL teams. Use the arrow keys to change departments.">${renderTeamGallery(teamGalleryItems)}
								</div>
								<button class="profile-team-gallery-nav" type="button" data-team-gallery-next aria-label="Show next team"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
							</div>
							<div class="profile-team-gallery-pagination" data-team-gallery-pagination aria-label="Team gallery position"></div>
							<div class="profile-team-context">
								<article>
									<span>Across the Visayas</span>
									<p>Covering the trade industry in the Visayas, our sales force has strategically placed its distribution reach of the different products in various commercial routes from supermarkets, groceries, department stores, market stalls and sari-sari stores.</p>
								</article>
								<article>
									<span>Our commitment to people</span>
									<p>SYL practices and is highly committed to developing its leaders by recognizing and rewarding them for their integrity, hard work, quality performance and excellence. That same courtesy is extended towards the staff’s well-being, where loyalty and a long-term career with the company become a choice and a priority.</p>
								</article>
							</div>
						</section>
					</section>

					<section class="profile-about-section profile-goals-section" aria-labelledby="goals-title">
						<p class="profile-about-kicker">&middot; Direction</p>
						<h2 id="goals-title">Company Goals</h2>
						<div class="profile-goals-narrative">
							<article>
								<span>Technology with purpose</span>
								<p>SYL is open to changes and is trying to step into the world of technology where everything is just a click away, making the system more efficient and reliable. Creating its own IT team can become a tool to achieve the company’s goals.</p>
							</article>
							<article>
								<span>Growth with expertise</span>
								<p>SYL would like to be established not just as the premier and preferred distribution company but as the industry expert. It aims to improve on its products and services so it can entice qualified prospects. This goal can generate new principal and customer growth while maintaining strong relationships with the current ones.</p>
							</article>
						</div>
						<div class="profile-goal-focus" aria-label="Company goal focus areas"><span>Efficiency</span><span>Reliability</span><span>Industry expertise</span><span>Lasting partnerships</span></div>
					</section>

					<section class="profile-about-section" aria-labelledby="edge-title">
						<p class="profile-about-kicker">&middot; Our edge</p>
						<h2 id="edge-title">What we can offer.</h2>
						<div class="profile-edge-flow">
							<div>
								<i class="fa-solid fa-location-dot"></i>
								<strong>Visayas</strong>
								<span>Regional understanding</span>
							</div>
							<b>→</b>
							<div>
								<i class="fa-solid fa-boxes-stacked"></i>
								<strong>Distribution</strong>
								<span>Practical execution</span>
							</div>
							<b>→</b>
						 <div>
							 <i class="fa-solid fa-handshake"></i>
							 <strong>Partnership</strong>
							 <span>Long-term value</span>
						 </div>
					 </div>
						<ol class="profile-edge-list">
							<li><i class="fa-solid fa-wallet" aria-hidden="true"></i><div><strong>Financial capacity</strong><p>SYL has built a reputation on its financial capacity and approach to business.</p></div></li>
							<li><i class="fa-solid fa-laptop-code" aria-hidden="true"></i><div><strong>System support</strong><p>Software programs developed by SYL’s IT team help enhance the system of distributorship.</p></div></li>
							<li><i class="fa-solid fa-mobile-screen-button" aria-hidden="true"></i><div><strong>Field enablement</strong><p>POS system for the salesman.</p></div></li>
							<li><i class="fa-solid fa-chart-column" aria-hidden="true"></i><div><strong>Clear decisions</strong><p>Timely and accurate reports and analysis.</p></div></li>
							<li><i class="fa-solid fa-handshake" aria-hidden="true"></i><div><strong>Principal alignment</strong><p>Aligned with the needs of the principals, transparency and panned out strategies are done regularly.</p></div></li>
							<li><i class="fa-solid fa-shield-heart" aria-hidden="true"></i><div><strong>Values in practice</strong><p>Value of integrity and transparency are one of the corporate values practiced by management and the employees.</p></div></li>
						</ol>
						<div class="profile-locations" aria-labelledby="locations-title">
							<div><p class="profile-about-kicker">Our locations &amp; warehouses</p><h3 id="locations-title">Across the Visayas.</h3></div>
							<ol><li>Iloilo City</li><li>Roxas City</li><li>Bacolod City</li><li>Dumaguete City</li></ol>
						</div>
					 </section>

					<section class="profile-about-section profile-principals-section" aria-labelledby="partners-title">
						<p class="profile-about-kicker">&middot; Principals</p>
						<h2 id="partners-title">Our Partners &amp; Happy Principals</h2>
						<p class="profile-principals-lead">Built on shared direction, transparent service, and lasting regional relationships.</p>${renderPrincipalRail(principalLogoItems)}

				 </section>


					<section class="profile-about-section profile-recognition-section" aria-labelledby="recognition-title">
						<p class="profile-about-kicker">&middot; Recognition &amp; connection</p>
						<h2 id="recognition-title">Awards &amp; Connect</h2>
						<div class="profile-rail-heading"><h3>Our awards</h3><p>Milestones and recognition from the distribution industry.</p></div>
						<div class="profile-content-rail profile-awards-rail" aria-label="SYL awards">
							<div class="profile-content-rail-track">${renderAwardsRail(awardItems)}
							</div>
						</div>
						<div class="profile-reviews-module" hidden>
							<div class="profile-rail-heading profile-review-heading"><div><h3>Customer &amp; business partner reviews</h3><p>Feedback from the customers and partners we serve.</p></div><span>Review highlights</span></div>
							<div class="profile-content-rail profile-reviews-rail" aria-label="Customer and business partner reviews">
							<div class="profile-content-rail-track">${renderReviewsRail(reviewProfiles)}
							</div>
						</div>
							</div>
						<div class="profile-office-connect">
							<article class="profile-office-details">
								<p class="profile-about-kicker">Our office</p>
								<h3>Visit SYL.</h3>
								<address>Roscom Building, Muelle Loney Street,<br>Iloilo City, Philippines 5000</address>
								<a href="https://www.google.com/maps/search/?api=1&amp;query=Roscom%20Building%2C%20Muelle%20Loney%20Street%2C%20Iloilo%20City%2C%20Philippines%205000" target="_blank" rel="noreferrer"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Open in Google Maps</a>
							</article>
							<div class="profile-office-map"><iframe title="Map to SYL Hermanos office" src="https://www.google.com/maps?q=Roscom%20Building%2C%20Muelle%20Loney%20Street%2C%20Iloilo%20City%2C%20Philippines%205000&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
							<aside class="profile-office-social">
								<p class="profile-about-kicker">Social media</p>
								<h3>Follow SYL.</h3>
								<div class="profile-facebook-plugin"><iframe title="SYL Hermanos on Facebook" src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fsylhermanos&amp;width=340&amp;height=185&amp;small_header=true&amp;adapt_container_width=true&amp;hide_cover=false&amp;show_facepile=true" width="340" height="185" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe></div>
							</aside>
						</div>
						<div class="profile-social-row">
							<a href="https://www.facebook.com/sylhermanos" target="_blank" rel="noreferrer" aria-label="SYL Hermanos on Facebook">
								<i class="fa-brands fa-facebook-f"></i> Facebook
							</a>
							<a hidden="true" href="https://www.instagram.com/sylhermanos" target="_blank" rel="noreferrer" aria-label="SYL Hermanos on Instagram">
								<i class="fa-brands fa-instagram"></i> Instagram
							</a>
							<a href="https://www.linkedin.com/company/sylhermanos/" target="_blank" rel="noreferrer" aria-label="SYL Hermanos on LinkedIn">
								<i class="fa-brands fa-linkedin-in"></i> LinkedIn
							</a>
							<a href="mailto:info@sylhermanos.com">
								<i class="fa-solid fa-envelope"></i> Contact us
							</a>
						</div>
				 </section>
				</div>
			</div>
		</section>

		<section id="page-content-one" class="profile-page h-screen min-w-full snap-start overflow-hidden" aria-label="Principals">
			<div class="h-full overflow-y-auto overscroll-y-contain" data-vertical-page>
				<div class="profile-about-shell">
					<section class="profile-about-section profile-principals-directory" aria-labelledby="principals-title">
						<div class="profile-principals-header">
							<div>
								<p class="profile-about-kicker">&middot; Principals</p>
								<h2 id="principals-title">Trusted partnerships, built to grow.</h2>
							</div>
							<p class="profile-about-lead">SYL Hermanos works with respected brands to bring quality products, dependable service, and practical market reach to communities across the Visayas.</p>
						</div>
						<div class="profile-principal-directory-grid">${renderPrincipalDirectory(principalDirectoryItems)}
						</div>
						<div class="profile-principal-partnership-cta">
							<div><p class="profile-about-kicker">Open to meaningful brand partnerships</p><h3>Let’s build your reach in the Visayas.</h3><p>We welcome brands that value reliable distribution, local market understanding, and long-term growth.</p></div>
							<a href="#page-content-footer" data-page-link="4">Book an appointment <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
						</div>
					</section>
				</div>
			</div>
		</section>
		<section id="page-content-two" class="profile-page h-screen min-w-full snap-start overflow-hidden" aria-label="Careers">
			<div class="h-full overflow-y-auto overscroll-y-contain" data-vertical-page>
				<div class="profile-about-shell">
					<section class="profile-about-section profile-careers-section" aria-labelledby="careers-title">
						<div class="profile-careers-intro"><p class="profile-about-kicker">&middot; Careers</p><h2 id="careers-title">Build your career with SYL.</h2><p class="profile-about-lead">SYL Hermanos Group of Companies is a leading consumer-goods distribution company in the Visayas; as we grow and our manpower needs evolve, we continue to seek qualified, professional people for opportunities across the organization.</p></div>
						<div class="profile-careers-heading"><div><p class="profile-about-kicker">Current opportunities</p><h3>Find where you can contribute.</h3></div><span><i class="fa-solid fa-briefcase" aria-hidden="true"></i> ${careerOpenings.length} designated openings</span></div>
						<div class="profile-career-grid">${renderCareerCards(careerOpenings)}
						</div>
						<div class="profile-careers-apply">
							<div><p class="profile-about-kicker">Apply with SYL</p><h3>Ready to take the next step?</h3><p>Send your résumé or bio-data to <a href="mailto:careers_ilo@sylhermanos.com">careers_ilo@sylhermanos.com</a>, or submit your application personally at our Iloilo office.</p></div>
							<address>SYL Hermanos Trade Center, Inc.<br>Roscom Building, Muelle Loney Street<br>Iloilo City, Philippines 5000<br><a href="tel:+63333371349">(033) 337-1349</a> · <a href="tel:+63333378098">337-8098</a> · <a href="tel:+63333374377">337-4377</a></address>
						</div>
					</section>
				</div>
			</div>
		</section>
		<section id="page-content-footer" class="profile-page h-screen min-w-full snap-start overflow-hidden" aria-label="Contact Us">
			<div class="h-full overflow-y-auto overscroll-y-contain" data-vertical-page>
				<div class="profile-about-shell">
					<section class="profile-about-section profile-contact-section" aria-labelledby="contact-title">
						<p class="profile-about-kicker">&middot; Contact</p>
						<h2 id="contact-title">Let&rsquo;s keep in touch.</h2>
						<p class="profile-about-lead">Connect with SYL Hermanos for business inquiries, career opportunities, and partnership conversations across the Visayas.</p>
						<div class="profile-office-connect">
							<article class="profile-office-details">
								<p class="profile-about-kicker">Our office</p>
								<h3>Visit SYL.</h3>
								<address>Roscom Building, Muelle Loney Street,<br>Iloilo City, Philippines 5000</address>
								<a href="https://www.google.com/maps/search/?api=1&amp;query=Roscom%20Building%2C%20Muelle%20Loney%20Street%2C%20Iloilo%20City%2C%20Philippines%205000" target="_blank" rel="noreferrer"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Open in Google Maps</a>
							</article>
							<div class="profile-office-map"><iframe title="Map to SYL Hermanos office" src="https://www.google.com/maps?q=Roscom%20Building%2C%20Muelle%20Loney%20Street%2C%20Iloilo%20City%2C%20Philippines%205000&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
							<aside class="profile-office-social">
								<p class="profile-about-kicker">Social media</p>
								<h3>Follow SYL.</h3>
								<div class="profile-facebook-plugin"><iframe title="SYL Hermanos on Facebook" src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fsylhermanos&amp;tabs&amp;width=340&amp;height=130&amp;small_header=true&amp;adapt_container_width=true&amp;hide_cover=true&amp;show_facepile=false" width="340" height="130" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe></div>
							</aside>
						</div>
						<div class="profile-social-row">
							<a href="https://www.facebook.com/sylhermanos" target="_blank" rel="noreferrer"><i class="fa-brands fa-facebook-f" aria-hidden="true"></i> Facebook</a>
							<a hidden="true" href="https://www.instagram.com/sylhermanos" target="_blank" rel="noreferrer"><i class="fa-brands fa-instagram" aria-hidden="true"></i> Instagram</a>
							<a href="https://www.linkedin.com/company/sylhermanos/" target="_blank" rel="noreferrer"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i> LinkedIn</a>
							<a href="mailto:administrator@sylhermanos.com"><i class="fa-solid fa-envelope" aria-hidden="true"></i> Contact us</a>
						</div>
						<footer class="profile-site-footer" aria-label="Website footer">
							<p>&copy; 2026 SYL Hermanos. All Rights Reserved.</p>
							<div><button type="button" data-policy-open="terms">Terms of Use</button><button type="button" data-policy-open="privacy">Privacy Policy</button></div>
						</footer>
					</section>
				</div>
			</div>
		</section>
	</main>

	<dialog class="profile-policy-dialog" id="terms-policy-dialog" aria-labelledby="terms-policy-title">
		<div class="profile-policy-dialog-inner">
			<div class="profile-policy-dialog-header"><div><p class="profile-about-kicker">SYL Hermanos</p><h2 id="terms-policy-title">Terms of Use</h2></div><button class="profile-policy-back" type="button" data-policy-close aria-label="Return to the previous page"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i><span>Back</span></button></div>
			<div class="profile-policy-content"><p>This website provides information about SYL Hermanos Trade Center, Inc., its services, career opportunities, and business partnerships.</p><h3>Respect for original work</h3><p>Unless otherwise stated, the website&rsquo;s original content, visual presentation, written materials, and brand assets belong to SYL Hermanos or their respective owners. They may not be reproduced, republished, or presented as another party&rsquo;s work without appropriate permission.</p><p>Digital and AI tools can make copying easy, but they do not replace the value of original human work. We encourage visitors and partners to build their own ideas, content, and corporate identity with the same respect for creative effort.</p><h3>Use of this website</h3><p>Please use this website lawfully and responsibly. Do not attempt to disrupt the site, misuse contact channels, submit misleading information, or use the site in a way that may harm SYL Hermanos, its partners, employees, or visitors.</p><h3>Our commitment</h3><p>We are passionate about building brands, serving communities, and connecting distribution expertise with practical IT innovation. Thank you for engaging with SYL Hermanos respectfully.</p></div>
		</div>
	</dialog>

	<dialog class="profile-policy-dialog" id="privacy-policy-dialog" aria-labelledby="privacy-policy-title">
		<div class="profile-policy-dialog-inner">
			<div class="profile-policy-dialog-header"><div><p class="profile-about-kicker">SYL Hermanos</p><h2 id="privacy-policy-title">Privacy Policy</h2></div><button class="profile-policy-back" type="button" data-policy-close aria-label="Return to the previous page"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i><span>Back</span></button></div>
			<div class="profile-policy-content"><p><strong>Effective date: August 30, 2026.</strong> SYL Hermanos Trade Center, Inc. respects your privacy and is committed to protecting the personal information you share through www.sylhermanos.com and our services. This policy describes how we collect, use, store, disclose, and protect personal data in line with the Philippine Data Privacy Act of 2012 and applicable issuances of the National Privacy Commission.</p><h3>1. Information collection and use</h3><p>We collect information you voluntarily provide when you contact us, request assistance, or use our services. This may include your name, email address, contact number, delivery or postal address, and company details. We use it to respond to inquiries, fulfill orders and services, provide support, and meet legal, regulatory, and tax obligations.</p><h3>2. Log data and cookies</h3><p>Our web servers may record technical information such as IP address, browser and device details, pages visited, access times, and referring URLs. We use this information for administration, fraud prevention, and website improvement. Cookies may be used to improve user experience and usage statistics; you may control cookies through your browser settings.</p><h3>3. Data sharing, retention, and security</h3><p>We do not sell, rent, or trade personal information. Where accredited service providers assist us, they may access personal data only to perform assigned work and are required to protect it. We retain data only as long as necessary for the purpose collected or as required by law, then securely dispose of, delete, or anonymize it. We use reasonable organizational, physical, and technical safeguards, although no online transmission or storage method is completely secure.</p><h3>4. Your rights</h3><p>Subject to applicable law, you may ask to be informed about, access, correct, object to, erase or block, or obtain a portable copy of your personal data. You may also raise a concern with the National Privacy Commission.</p><h3>5. External links and children</h3><p>External websites linked from this site have their own practices and policies. Our services are not directed to children under 13, and we do not knowingly collect their personal information.</p><h3>6. Updates and contact</h3><p>We may update this policy when our practices or legal obligations change. For privacy questions or to exercise your data-subject rights, contact the Data Protection Officer at <a href="mailto:administrator@sylhermanos.com">administrator@sylhermanos.com</a> or (033) 337-1349, 337-8098, or 337-4377. You may also write to SYL Hermanos Trade Center, Inc., Roscom Building, Muelle Loney Street, Iloilo City, Philippines 5000.</p></div>
		</div>
	</dialog>

	<nav class="profile-monitor fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center rounded-full px-5" aria-label="Page progress">
		<div class="flex items-center gap-1.5" id="monitor-dots">
			<button class="profile-monitor-dot is-active" type="button" data-page-link="0" aria-label="Go to page 1"></button>
			<button class="profile-monitor-dot" type="button" data-page-link="1" aria-label="Go to page 2"></button>
			<button class="profile-monitor-dot" type="button" data-page-link="2" aria-label="Go to page 3"></button>
			<button class="profile-monitor-dot" type="button" data-page-link="3" aria-label="Go to page 4"></button>
			<button class="profile-monitor-dot" type="button" data-page-link="4" aria-label="Go to page 5"></button>
		</div>
	</nav>

	<script src="assets/js/landingpage.js"></script>
</body>
</html>
`;
}

module.exports = { renderPage };
