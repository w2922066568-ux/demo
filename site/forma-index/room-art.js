(() => {
  'use strict';

  // The graphic is a three-leaf exhibition catalogue. Each plate uses the
  // gallery's own decoded cover, including in the self-contained edition.
  function mountFolio() {
    const about = document.querySelector('#about .about-grid');
    const cards = [...document.querySelectorAll('#workGrid .work-card')];
    if (!about || cards.length !== 3 || about.querySelector('.room-folio')) return;

    const stage = document.createElement('div');
    stage.className = 'room-folio';
    stage.setAttribute('aria-hidden', 'true');
    const shadow = document.createElement('span');
    shadow.className = 'folio-shadow';
    const camera = document.createElement('div');
    camera.className = 'folio-camera';
    const book = document.createElement('div');
    book.className = 'folio-book';

    for (const card of cards) {
      const face = document.createElement('div');
      face.className = 'folio-leaf';
      const image = document.createElement('img');
      image.alt = '';
      image.draggable = false;
      image.src = card.querySelector('img').src;
      const caption = document.createElement('span');
      caption.className = 'folio-caption';
      caption.lang = 'en';
      caption.textContent = card.querySelector('.card-info em').textContent;
      const mark = document.createElement('i');
      mark.className = 'folio-mark';
      face.append(image, caption, mark);
      book.append(face);
    }
    camera.append(book);
    stage.append(shadow, camera);
    about.append(stage);

    const finePointer = matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
    stage.addEventListener('pointermove', event => {
      if (!finePointer.matches) return;
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      stage.style.setProperty('--folio-yaw', (x * 17).toFixed(2) + 'deg');
      stage.style.setProperty('--folio-pitch', (-y * 9).toFixed(2) + 'deg');
    }, {passive:true});
    stage.addEventListener('pointerleave', () => {
      stage.style.removeProperty('--folio-yaw');
      stage.style.removeProperty('--folio-pitch');
    });
  }

  function mount() {
    const titles = [
      ['#works .section-eyebrow', 'Selected Works'],
      ['#notes .section-eyebrow', 'Field Notes'],
      ['#about .section-eyebrow', 'About the Exhibition']
    ];
    for (const [selector, label] of titles) {
      const heading = document.querySelector(selector);
      if (!heading) continue;
      // Only change the case of the existing English captions.
      const caption = [...heading.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      if (caption) caption.textContent = ' ' + label;
    }
    mountFolio();
  }
  window.FormaRooms = { mount };
})();
