import { articles, events, questions, photographs } from './content.js';

const main = document.querySelector('#main');
const dialog = document.querySelector('#media-dialog');
const header = document.querySelector('#site-header');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const arrow = '<span aria-hidden="true">→</span>';
const play = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z" fill="currentColor"/></svg>';
const image = (name, alt, cls = '', eager = false) => `<img class="${cls}" src="assets/${name}" alt="${escape(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const link = (href, text, cls = 'text-link') => `<a class="${cls}" href="${href}">${text} ${arrow}</a>`;
const symbol = (cls = '') => `<img class="sacred-symbol ${cls}" src="assets/symbol.svg" alt="The Pierology emblem">`;
const label = text => `<p class="eyebrow">${text}</p>`;
const title = (kicker, heading, intro = '') => `<div class="page-heading wrap">${label(kicker)}<h1>${heading}</h1>${intro ? `<p class="page-intro">${intro}</p>` : ''}</div>`;
const articleLink = article => `#/article/${article.id}`;
const categoryLink = category => `#/news?category=${encodeURIComponent(category)}`;

const slides = [
  { image: 'tuscany.jpg', kicker: 'WELCOME TO THE WORLD OF PIEROLOGY', title: '<span class="hero-title-phrase">A faith.</span> <span class="hero-title-phrase">A mystery.</span><br class="hero-title-break"><span class="hero-title-phrase">A way of life.</span>', subtitle: 'Some questions bring us closer to something greater.', cta: 'Discover Pierology', href: '#/beliefs' },
  { image: 'vito.jpg', kicker: 'FROM THE BELVITO ACCOUNTS', title: 'An ordinary question.<br>An extraordinary unease.', subtitle: '“Have you been to lunch?” The latest account from the old streets.', cta: 'Read the account', href: '#/article/the-question-at-dusk' },
  { image: 'candle.jpg', kicker: 'THE SACRED WRITINGS', title: 'Nine characters.<br>An enduring mystery.', subtitle: 'KPF57APQ4. Discover the symbol at the heart of the sacred tales.', cta: 'Explore the symbol', href: '#/symbol' }
];
let slideIndex = 0;
let galleryIndex = 0;
let galleryOpen = false;

function networkPanel() {
  return `<aside class="network-panel"><div class="network-title">PIEROLOGY <strong>NETWORK</strong></div><button class="network-art" data-video="full" aria-label="Watch Piero: the ten-hour contemplation"><span class="broadcast-label">ON DEMAND</span>${symbol()}<span class="network-wordmark">PIEROLOGY</span><span class="network-caption">THE ETERNAL REFRAIN</span><span class="network-watch">${play} WATCH NOW</span></button><div class="network-bottom"><h2>A moment for Piero.</h2><p>One name. Ten hours.<br>Nothing special to add.</p><a href="#/media">Explore the Network ${arrow}</a></div></aside>`;
}

function hero() {
  return `<section class="hero" aria-label="Featured stories"><div class="hero-photo" id="hero-photo" style="background-image:url('assets/tuscany.jpg')"></div><div class="hero-shade"></div><div class="hero-layout wrap"><div class="hero-story" id="hero-story"></div>${networkPanel()}<div class="hero-controls"><div class="slide-selectors">${slides.map((_, i) => `<button class="slide-dot ${i === 0 ? 'active' : ''}" data-slide="${i}" aria-label="Show featured story ${i + 1}" aria-pressed="${i === 0}"></button>`).join('')}<span id="slide-count">01 / 03</span></div><div class="slide-arrows"><button data-slide-step="-1" aria-label="Previous featured story">←</button><button data-slide-step="1" aria-label="Next featured story">→</button></div></div></div><div class="hero-photo-credit">VAL D’ORCIA, ITALY · A PLACE FOR CONTEMPLATION</div></section>`;
}

function setSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  const slide = slides[slideIndex];
  document.querySelector('#hero-photo').style.backgroundImage = `url('assets/${slide.image}')`;
  document.querySelector('#hero-story').innerHTML = `${label(slide.kicker)}<h1>${slide.title}</h1><p class="hero-subtitle">${slide.subtitle}</p>${link(slide.href, slide.cta, 'button gold')}`;
  document.querySelectorAll('[data-slide]').forEach(button => {
    const active = Number(button.dataset.slide) === slideIndex;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('#slide-count').textContent = `0${slideIndex + 1} / 03`;
  document.querySelector('.hero-photo-credit').textContent = ['VAL D’ORCIA, ITALY · A PLACE FOR CONTEMPLATION', 'THE BELVITO ACCOUNTS · ILLUSTRATIVE PHOTOGRAPHY', 'SACRED WRITINGS · KPF57APQ4'][slideIndex];
}

function quickLinks() {
  const links = [['#/beliefs', '?', 'The Eternal', 'Question'], ['#/piero', 'P', 'Piero', 'Almighty'], ['#/symbol', '⌘', 'The Sacred', 'Symbol'], ['#/news?category=Faith%20%26%20practice', '☼', 'Faith &', 'Practice'], [categoryLink('Belvito accounts'), 'V', 'The Belvito', 'Accounts'], ['#/media', '♫', 'Music &', 'Film']];
  return `<nav class="discovery-strip wrap" aria-label="Explore the faith"><div class="discovery-intro">A WORLD TO<br><strong>DISCOVER</strong><span>Begin your exploration</span></div>${links.map(([href, mark, a, b], i) => `<a href="${href}"><span class="discovery-icon icon-${i}">${mark}</span><span>${a}<br>${b}</span></a>`).join('')}</nav>`;
}

function newsRow(article) {
  return `<article class="news-row"><a class="news-image" href="${articleLink(article)}" tabindex="-1" aria-hidden="true">${image(article.image, '')}</a><div><a class="category" href="${categoryLink(article.category)}">${article.category}</a><h3><a href="${articleLink(article)}">${article.title}</a></h3><p class="date">${article.date}</p><p class="news-excerpt">${article.excerpt}</p>${link(articleLink(article), 'Read the story')}</div></article>`;
}

function sacredBook() {
  return `<div class="sacred-book" aria-label="The Sacred Writings of Pierology"><span class="book-top">THE SACRED WRITINGS</span>${symbol()}<span class="book-code">KPF57APQ4</span><span class="book-bottom">PIEROLOGY</span></div>`;
}

function home() {
  return `${hero()}${quickLinks()}<div class="home-editorial wrap"><aside class="left-column"><section class="side-feature"><h2 class="section-label">WHAT IS PIEROLOGY?</h2>${image('villa.jpg', 'A quiet villa among the Tuscan hills')}<h3>A question without an answer.<br>A faith without an end.</h3><p>Discover the beliefs, traditions, and sacred mysteries that bring the faithful together.</p>${link('#/beliefs', 'Learn more')}</section><section class="side-feature book-feature"><h2 class="section-label">THE SACRED WRITINGS</h2><a href="#/symbol" tabindex="-1" aria-hidden="true">${sacredBook()}</a><p>Nine characters. Countless contemplations. Explore the story of the sacred symbol.</p>${link('#/symbol', 'Explore the writings')}</section></aside><section class="news-column"><div class="section-heading"><h2>PIEROLOGY TODAY</h2><span>NEWS FROM OUR WORLD</span></div>${articles.slice(0, 4).map(newsRow).join('')}${link('#/news', 'All Pierology news', 'button outline news-more')}</section><aside class="right-column"><section class="faq-widget"><h2 class="section-label">FREQUENTLY ASKED<br>QUESTIONS</h2>${questions.slice(0, 6).map(([q], i) => `<a href="#/faq?open=${i}">${q}<span aria-hidden="true">›</span></a>`).join('')}${link('#/faq', 'View all questions')}</section><section class="gathering-widget"><h2 class="section-label">COME TOGETHER</h2>${image('candle.jpg', 'A lit candle in a quiet interior')}<span class="date-box"><strong>04</strong> OCTOBER</span><p class="category">AN INVITATION TO CONTEMPLATE</p><h3>The Sunday<br>Contemplation</h3><p>A little time. An eternal question.<br>A moment with Piero.</p>${link('#/events', 'Explore gatherings')}</section><section class="grace-widget">${symbol()}<h3>“Nothing special<br>to add.”</h3><p>A simple expression of grace.<br>A daily tradition of our faith.</p>${link('#/article/nothing-special-to-add', 'Discover the tradition')}</section></aside></div><section class="eternal-feature"><div class="wrap eternal-inner"><div>${label('THE CENTRAL MYSTERY OF OUR FAITH')}<h2>Some questions are<br>meant to stay with us.</h2><p>For the faithful, contemplation begins where translation ends.</p>${link('#/beliefs', 'Explore the Eternal Question', 'button outline light')}</div><div class="equivalence"><p><span>prosciutto</span><em>=</em><span>ham</span></p><div class="equivalence-rule"></div><p><span>prosciutto crudo</span><em>=</em><span>prosciutto crudo</span></p><small>IL MISTERO DELLA FEDE</small></div></div></section><section class="home-media wrap"><div class="section-heading"><h2>WATCH. LISTEN. CONTEMPLATE.</h2>${link('#/media', 'Explore the Network')}</div><div class="media-grid">${videoCard()}${audioCard()}<a class="photo-promo" href="#/photos">${image('villa.jpg', 'Sunlight over a Tuscan villa')}<div>${label('THROUGH THE LENS')}<h3>Places of stillness.</h3><span class="text-link">Explore the photo gallery ${arrow}</span></div></a></div></section><section class="closing-quote wrap">${symbol()}<p>One name brings us together.</p><h2>Piero.</h2><span>NOTHING SPECIAL TO ADD.</span></section>`;
}

function videoCard() {
  return `<article class="video-card"><button class="video-thumbnail" data-video="full" aria-label="Watch the ten-hour contemplation">${image('candle.jpg', '')}<span class="round-play">${play}</span><span class="duration">10:00:00</span></button><div class="video-caption">${label('THE ETERNAL REFRAIN')}<h3><button data-video="full">Piero. Ten hours of contemplation.</button></h3><p>The complete film on YouTube, with the original Piero refrain.</p></div></article>`;
}

function audioCard() {
  return `<article class="video-card"><a class="video-thumbnail" href="#/media?tab=music" aria-label="Listen to just the Piero audio">${image('tuscany.jpg', '')}<span class="round-play">${play}</span><span class="duration">AUDIO</span></a><div class="video-caption">${label('THE ORIGINAL RECORDING')}<h3><a href="#/media?tab=music">Piero. Just the audio.</a></h3><p>The original refrain, on repeat. Listen for as long as you wish.</p></div></article>`;
}

function newsPage(params) {
  const chosen = params.get('category') || 'All stories';
  const categories = ['All stories', ...new Set(articles.map(a => a.category))];
  const filtered = chosen === 'All stories' ? articles : articles.filter(a => a.category === chosen);
  return `${title('THE PIEROLOGY CHRONICLE', 'Pierology Today', 'The stories, observances, and unexplained encounters of our world.')}<div class="wrap"><nav class="filter-bar" aria-label="Filter news">${categories.map(category => `<a class="${chosen === category ? 'active' : ''}" href="${category === 'All stories' ? '#/news' : categoryLink(category)}" ${chosen === category ? 'aria-current="page"' : ''}>${category}</a>`).join('')}</nav><div class="news-grid">${filtered.map(a => `<article class="journal-card"><a href="${articleLink(a)}" tabindex="-1" aria-hidden="true">${image(a.image, '')}</a><div>${label(a.category)}<h2><a href="${articleLink(a)}">${a.title}</a></h2><p class="date">${a.date}</p><p>${a.excerpt}</p>${link(articleLink(a), 'Read the story')}</div></article>`).join('') || '<p class="empty-state">No stories in this collection yet. <a href="#/news">View all stories.</a></p>'}</div></div>`;
}

function articlePage(id) {
  const article = articles.find(a => a.id === id);
  if (!article) return notFound();
  return `<article class="article-page"><div class="article-heading wrap">${link('#/news', 'The Pierology Chronicle', 'back-link')}${label(article.category)}<h1>${article.title}</h1><p class="date">${article.date} <span>·</span> THE PIEROLOGY CHRONICLE</p></div><div class="article-photo wrap">${image(article.image, photographs.find(p => p.image === article.image).caption, '', true)}<small>Illustrative photography · ${photographs.find(p => p.image === article.image).photographer}</small></div><div class="article-copy"><p class="article-lead">${article.introduction}</p>${article.body.map((p, i) => `${i === 2 ? `<blockquote>${article.quote}</blockquote>` : ''}<p>${p}</p>`).join('')}${article.media ? `<button class="button gold" data-video="full">Watch the complete film ${arrow}</button>` : ''}<div class="article-signoff">${symbol()}<span>NOTHING SPECIAL TO ADD.</span></div></div><section class="related wrap"><div class="section-heading"><h2>CONTINUE EXPLORING</h2></div><div class="related-grid">${articles.filter(a => a.id !== id && (a.category === article.category || a.id === 'the-nine-characters')).slice(0, 2).map(newsRow).join('')}</div></section></article>`;
}

function beliefsPage() {
  return `${title('AN INTRODUCTION TO OUR FAITH', 'What is Pierology?', 'A devotion to Piero. A question without an answer. A way of being together.')}<section class="belief-intro wrap"><div class="belief-photo">${image('tuscany.jpg', 'A winding road through the Tuscan countryside', '', true)}<span>A PLACE FOR CONTEMPLATION</span></div><div class="belief-copy">${label('THE ETERNAL QUESTION')}<h2>Where understanding ends,<br>contemplation begins.</h2><p>At the heart of Pierology is a question that nobody can answer. It is our <em>mistero della fede</em> — the mystery of faith.</p><div class="doctrine-equations"><p>prosciutto <span>=</span> ham</p><p>prosciutto crudo <span>=</span> prosciutto crudo</p></div><p>Why does one become something else in translation, while the other remains itself? The faithful stay with this question as a matter of finding absolution. An answer is neither promised nor required.</p></div></section><section class="principles wrap"><article><span>01</span><h2>Piero Almighty</h2><p>The divine name at the center of the faith. Spoken in reverence, repeated in contemplation.</p>${link('#/piero', 'Discover Piero')}</article><article><span>02</span><h2>The sacred symbol</h2><p>KPF57APQ4 runs through the sacred tales. Nine characters whose meaning is held in mystery.</p>${link('#/symbol', 'Explore the writings')}</article><article><span>03</span><h2>The daily grace</h2><p>“Nothing special to add.” A simple, customary way of acknowledging Piero almighty.</p>${link('#/article/nothing-special-to-add', 'Read about the tradition')}</article></section><section class="adversary-feature wrap">${image('vito.jpg', 'Figures in a misty Italian street')}<div>${label('LIGHT, SHADOW, AND THE SACRED TALES')}<h2>The figure in the shadows.</h2><p>Vito Belvito is the Adversary of Pierology. Dark and mysterious, he wanders through the sacred tales with a question that fills those who hear it with dread.</p><blockquote>“Have you been to lunch?”</blockquote>${link(categoryLink('Belvito accounts'), 'Read the Belvito accounts')}</div></section>`;
}

function pieroPage() {
  return `${title('THE NAME AT THE HEART OF OUR FAITH', 'Piero Almighty', 'One name. An abiding presence. Nothing special to add.')}<div class="piero-presentation wrap"><div class="piero-monogram">${symbol()}<span>PIERO</span><small>KPF57APQ4</small></div><div class="prose"><h2>A name to return to.</h2><p>Piero is the divine figure at the center of Pierology. His name is the refrain of our contemplation, the constant beside the unanswered question.</p><p>The faith makes room for ordinary acts of reverence: a moment of listening, a return to the sacred tales, or the simple grace offered at the end of a conversation.</p><blockquote>“Nothing special to add.”</blockquote><p>These words honor Piero almighty. They need no embellishment.</p>${link('#/media', 'Listen to the eternal refrain', 'button gold')}</div></div><div class="narrow closing-quote"><h2>A simple beginning.</h2><p>Read the question. Listen to the name.<br>Stay for a moment.</p>${link('#/beliefs', 'Discover the beliefs of Pierology')}</div>`;
}

function symbolPage() {
  return `${title('THE SACRED WRITINGS', 'KPF57APQ4', 'The symbol that runs through the sacred tales of Pierology.')}<div class="symbol-presentation wrap"><div class="book-display">${sacredBook()}</div><div class="prose">${label('NINE CHARACTERS. ONE ENDURING MYSTERY.')}<h2>A sign of the faith.</h2><p>Throughout the sacred tales, KPF57APQ4 represents Pierology. The sequence is preserved exactly, a meeting point for the faithful and a mystery in its own right.</p><p>Its meaning is not reduced to a single explanation. Like the Eternal Question, it invites contemplation.</p><div class="symbol-spelling" aria-label="K P F 5 7 A P Q 4">K P F 5 7 A P Q 4</div><p>Read the writings. Return to the question. Let the mystery remain.</p>${link('#/article/the-nine-characters', 'Read the introduction', 'button gold')}</div></div><section class="wrap related"><div class="section-heading"><h2>FROM THE SACRED TALES</h2></div><div class="related-grid">${[articles[0], articles[5]].map(newsRow).join('')}</div></section>`;
}

function eventsPage() {
  return `${title('A TIME TO COME TOGETHER', 'Gatherings & Events', 'Make room for contemplation, shared readings, and the name of Piero.')}<div class="wrap event-intro"><p>These observances are invitations to take part at home, on your own or with fellow readers. Save a date to your calendar and join in wherever you are.</p></div><div class="wrap events-list">${events.map(event => `<article class="event-card" id="${event.id}">${image(event.image, '')}<div class="event-date"><strong>${event.day}</strong><span>${event.month}</span></div><div class="event-info">${label(event.category)}<h2>${event.title}</h2><p class="event-time">${event.date}<br>${event.time}</p><p>${event.description}</p><p class="event-location">${event.location}</p><button class="button outline" data-calendar="${event.id}">Add to calendar <span aria-hidden="true">＋</span></button></div></article>`).join('')}</div><div class="narrow event-note"><h2>Bring only your curiosity.</h2><p>There is no registration or attendance requirement. The readings and recordings are available to everyone.</p>${link('#/media', 'Visit the media library')}</div>`;
}

function mediaPage(params) {
  const music = params.get('tab') === 'music';
  return `${title('THE PIEROLOGY NETWORK', 'A name worth returning to.', 'Films and recordings for moments of contemplation.')}<div class="wrap"><nav class="filter-bar" aria-label="Media categories"><a href="#/media" class="${!music ? 'active' : ''}" ${!music ? 'aria-current="page"' : ''}>Films & videos</a><a href="#/media?tab=music" class="${music ? 'active' : ''}" ${music ? 'aria-current="page"' : ''}>Music & recordings</a></nav>${music ? `<section class="audio-feature"><div class="record-art">${symbol()}<strong>PIERO</strong><span>THE ETERNAL REFRAIN</span></div><div class="audio-info">${label('THE ORIGINAL RECORDING')}<h2>Piero. On repeat.</h2><p>The original voice, the natural rhythm, and one name repeated. A companion to the Eternal Question.</p><audio id="refrain" src="piero-loop.wav" loop preload="metadata"></audio><div class="audio-controls"><button class="audio-play" id="toggle-refrain" aria-label="Play the Piero refrain">${play}</button><div><strong>The eternal refrain</strong><span id="audio-state">Ready to listen · continuous loop</span></div></div><label class="volume-label" for="audio-volume">Volume <input id="audio-volume" type="range" min="0" max="1" value="0.7" step="0.05"></label><p class="small-print">Audio transcript: “Piero”, repeated. Playback begins only when you press play.</p><a class="text-link" href="piero-loop.wav" download>Download the original refrain ↓</a></div></section>` : `<div class="media-grid single-film">${videoCard()}</div><div class="media-note"><h2>A film with one word.</h2><p>A black screen. The name “piero” in white. The voice of the original recording, repeated for exactly ten hours. Watch on YouTube, and stay for as long as you wish.</p>${link('#/media?tab=music', 'Prefer just the audio?')}</div>`}</div>`;
}

function photosPage() {
  return `${title('THROUGH THE LENS', 'Places of stillness.', 'An illustrated companion to the world of Pierology.')}<div class="photo-grid wrap">${photographs.map((photo, i) => `<figure><button data-photo="${i}" aria-label="View photograph: ${photo.title}">${image(photo.image, photo.caption)}<span class="photo-expand" aria-hidden="true">＋</span></button><figcaption><h2>${photo.title}</h2><p>${photo.caption}</p><small>PHOTOGRAPHY: ${photo.photographer}</small></figcaption></figure>`).join('')}</div><p class="wrap gallery-note">The photographs illustrate the stories and atmosphere of Pierology. ${link('#/credits', 'View photography credits')}</p>`;
}

function faqPage(params) {
  return `${title('A PLACE TO BEGIN', 'Frequently Asked Questions', 'An introduction to the faith, its traditions, and its enduring mysteries.')}<section class="faq-list narrow">${questions.map(([q, a], i) => `<details ${params.get('open') === String(i) ? 'open' : ''}><summary>${q}<span aria-hidden="true">＋</span></summary><p>${a}</p></details>`).join('')}</section><div class="narrow closing-quote"><p>And the one question nobody can answer?</p><h2>That is where the faith begins.</h2>${link('#/beliefs', 'Explore the Eternal Question')}</div>`;
}

function searchPage(params) {
  const query = params.get('q')?.trim() || '';
  const lower = query.toLocaleLowerCase();
  const found = query ? articles.filter(a => `${a.title} ${a.category} ${a.excerpt} ${a.introduction} ${a.body.join(' ')}`.toLocaleLowerCase().includes(lower)) : [];
  return `${title('EXPLORE OUR WORLD', 'Search Pierology')}<div class="search-results narrow"><form class="inline-search" id="results-search"><label class="sr-only" for="results-query">Search terms</label><input id="results-query" name="q" type="search" required value="${escape(query)}" placeholder="What would you like to explore?"><button class="button gold">Search</button></form><p class="search-summary">${found.length} ${found.length === 1 ? 'story' : 'stories'} ${query ? `for “${escape(query)}”` : 'found'}</p>${found.map(newsRow).join('') || `<div class="empty-state"><h2>No stories found.</h2><p>Try “Piero”, “Belvito”, “prosciutto”, or “KPF57APQ4”.</p>${link('#/news', 'Explore all stories')}</div>`}</div>`;
}

function creditsPage() {
  return `${title('WITH THANKS', 'Photography & Credits')}<div class="narrow prose credits"><p>The photography throughout this site is illustrative. It depicts real places and is not presented as documentary evidence of the fictional stories.</p>${photographs.map(p => `<p><strong>${p.title}</strong><br>Photograph by <a href="${p.source}" target="_blank" rel="noopener noreferrer">${p.photographer} on Unsplash ↗</a></p>`).join('')}<p>Photographs are used under the <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash License</a>. Jost and Libre Caslon Display are distributed under the SIL Open Font License.</p><p>The Piero audio and video were provided and created for this project. The Pierology emblem, writings, and page designs were created for this fictional world.</p><p>Pierology is an independent work of satire and is not affiliated with the Church of Scientology.</p></div>`;
}

function notFound() {
  return `${title('A PATH NOT YET WRITTEN', 'This page could not be found.')}<div class="narrow empty-state">${link('#/', 'Return to Pierology', 'button gold')}</div>`;
}

function route() {
  const url = new URL((location.hash.slice(1) || '/'), location.origin);
  const path = url.pathname;
  main.querySelectorAll('audio,video').forEach(media => media.pause());
  if (dialog.open) dialog.close();
  const renderers = { '/': home, '/news': () => newsPage(url.searchParams), '/beliefs': beliefsPage, '/piero': pieroPage, '/symbol': symbolPage, '/events': eventsPage, '/media': () => mediaPage(url.searchParams), '/photos': photosPage, '/faq': () => faqPage(url.searchParams), '/search': () => searchPage(url.searchParams), '/credits': creditsPage };
  document.body.classList.toggle('home-page', path === '/');
  main.innerHTML = path.startsWith('/article/') ? articlePage(path.split('/')[2]) : (renderers[path] || notFound)();
  document.querySelectorAll('.primary-nav a').forEach(a => {
    const active = a.getAttribute('href') === `#${path}` || (path.startsWith('/article/') && a.getAttribute('href') === '#/news');
    active ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
  header.classList.remove('menu-open');
  document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
  document.querySelector('.menu-toggle').setAttribute('aria-label', 'Open navigation');
  document.querySelector('#search-form').hidden = true;
  if (path === '/') setSlide(0);
  const audio = document.querySelector('#refrain');
  if (audio) {
    audio.volume = .7;
    audio.addEventListener('play', updateAudioState);
    audio.addEventListener('pause', updateAudioState);
    audio.addEventListener('error', () => { document.querySelector('#audio-state').textContent = 'The recording could not be loaded. Please try again.'; });
  }
  document.title = `${main.querySelector('h1')?.innerText.replace(/\s+/g, ' ') || 'Pierology'} — Pierology`;
  window.scrollTo(0, 0);
}

function updateAudioState() {
  const audio = document.querySelector('#refrain');
  const button = document.querySelector('#toggle-refrain');
  if (!audio || !button) return;
  button.innerHTML = audio.paused ? play : '<span aria-hidden="true">Ⅱ</span>';
  button.setAttribute('aria-label', audio.paused ? 'Play the Piero refrain' : 'Pause the Piero refrain');
  document.querySelector('#audio-state').textContent = audio.paused ? 'Paused · continuous loop' : 'Now playing · continuous loop';
}

function openVideo() {
  galleryOpen = false;
  main.querySelectorAll('audio').forEach(audio => audio.pause());
  document.querySelector('#dialog-title').textContent = 'Piero — The ten-hour contemplation';
  document.querySelector('#dialog-content').innerHTML = `<iframe title="Piero — Ten hours of contemplation on YouTube" src="https://www.youtube-nocookie.com/embed/4GpNXT_PuXU?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><div class="video-transcript"><p>Audio transcript: “Piero”, repeated in contemplation.</p><a href="https://www.youtube.com/watch?v=4GpNXT_PuXU" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></div>`;
  dialog.classList.remove('photo-dialog');
  dialog.showModal();
}

function openPhoto(index) {
  galleryIndex = (index + photographs.length) % photographs.length;
  galleryOpen = true;
  const photo = photographs[galleryIndex];
  document.querySelector('#dialog-title').textContent = photo.title;
  document.querySelector('#dialog-content').innerHTML = `<img class="lightbox-photo" src="assets/${photo.image}" alt="${escape(photo.caption)}"><div class="lightbox-bottom"><button class="icon-button" data-photo-step="-1" aria-label="Previous photograph">←</button><p>${photo.caption}<small>Photography: ${photo.photographer} · ${galleryIndex + 1} / ${photographs.length}</small></p><button class="icon-button" data-photo-step="1" aria-label="Next photograph">→</button></div>`;
  dialog.classList.add('photo-dialog');
  if (!dialog.open) dialog.showModal();
}

function downloadCalendar(id) {
  const event = events.find(e => e.id === id);
  if (!event) return;
  const encode = value => value.replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll(',', '\\,').replaceAll(';', '\\;');
  const calendar = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Pierology//Observances//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${event.id}-2026@pierology.local`, 'DTSTAMP:20260926T120000Z', `DTSTART:${event.start}`, `DTEND:${event.end}`, `SUMMARY:${encode(event.title)}`, `DESCRIPTION:${encode(event.description + '\nNothing special to add.')}`, `LOCATION:${encode(event.location)}`, 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
  const url = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `pierology-${event.id}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#announcement').textContent = `Calendar file downloaded for ${event.title}. Open it to add the observance to your calendar.`;
}

document.addEventListener('click', event => {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.dataset.slide !== undefined) setSlide(Number(target.dataset.slide));
  if (target.dataset.slideStep) setSlide(slideIndex + Number(target.dataset.slideStep));
  if (target.dataset.video) openVideo();
  if (target.dataset.photo !== undefined) openPhoto(Number(target.dataset.photo));
  if (target.dataset.photoStep) {
    const step = target.dataset.photoStep;
    openPhoto(galleryIndex + Number(step));
    dialog.querySelector(`[data-photo-step="${step}"]`).focus();
  }
  if (target.dataset.calendar) downloadCalendar(target.dataset.calendar);
  if (target.matches('.close-dialog')) dialog.close();
  if (target.matches('.menu-toggle')) {
    const open = header.classList.toggle('menu-open');
    target.setAttribute('aria-expanded', String(open));
    target.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }
  if (target.matches('.search-toggle')) {
    const form = document.querySelector('#search-form');
    form.hidden = !form.hidden;
    if (!form.hidden) document.querySelector('#site-search').focus();
  }
  if (target.id === 'toggle-refrain') {
    const audio = document.querySelector('#refrain');
    if (audio.paused) audio.play().catch(() => { document.querySelector('#audio-state').textContent = 'Playback could not start. Please try again.'; });
    else audio.pause();
  }
});

document.addEventListener('submit', event => {
  if (event.target.matches('#search-form,#results-search')) {
    event.preventDefault();
    const query = new FormData(event.target).get('q').trim();
    if (query) location.hash = `/search?q=${encodeURIComponent(query)}`;
  }
});
document.addEventListener('input', event => {
  if (event.target.id === 'audio-volume') document.querySelector('#refrain').volume = Number(event.target.value);
});
dialog.addEventListener('close', () => {
  // Removing the YouTube iframe also stops its playback.
  document.querySelector('#dialog-content').replaceChildren();
  galleryOpen = false;
});
dialog.addEventListener('click', event => { if (event.target === dialog && (event.clientX < dialog.getBoundingClientRect().left || event.clientX > dialog.getBoundingClientRect().right || event.clientY < dialog.getBoundingClientRect().top || event.clientY > dialog.getBoundingClientRect().bottom)) dialog.close(); });
document.addEventListener('keydown', event => {
  if (dialog.open && galleryOpen && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
    openPhoto(galleryIndex + (event.key === 'ArrowLeft' ? -1 : 1));
  }
  if (event.key === 'Escape' && !dialog.open) {
    document.querySelector('#search-form').hidden = true;
    header.classList.remove('menu-open');
    document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
    document.querySelector('.menu-toggle').setAttribute('aria-label', 'Open navigation');
  }
});
window.addEventListener('hashchange', () => { route(); main.focus({ preventScroll: true }); });
route();
