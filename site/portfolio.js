(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const cover = document.querySelector('#front-cover');
  if (cover) {
    const replay = document.querySelector('.opening-replay');
    const skip = cover.querySelector('button');
    let timer;
    function close() {
      clearTimeout(timer);
      if (cover.open) cover.close();
    }
    function open() {
      if (reduced.matches || cover.open || !cover.showModal) return;
      for (const image of cover.querySelectorAll('img[data-src]')) {
        const hero = document.querySelector('.opening-stage > img');
        image.src = image.closest('.valley') ? (hero.currentSrc || hero.src) : image.dataset.src;
        image.removeAttribute('data-src');
      }
      cover.showModal();
      timer = setTimeout(close, 2700);
    }
    cover.addEventListener('animationend', event => { if (event.animationName === 'jacket-lift') close(); });
    cover.addEventListener('close', () => clearTimeout(timer));
    skip.addEventListener('click', close);
    replay.addEventListener('click', open);
    function sync() {
      replay.hidden = reduced.matches || !cover.showModal;
      if (reduced.matches) close();
    }
    sync();
    reduced.addEventListener('change', sync);
    window.addEventListener('pagehide', close);
    const fresh = !location.hash && performance.getEntriesByType('navigation')[0]?.type !== 'back_forward';
    try {
      if (fresh && !reduced.matches && !sessionStorage.getItem('demo:cover-seen')) {
        open();
        sessionStorage.setItem('demo:cover-seen', '1');
      }
    } catch { if (fresh) open(); }
  }

  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => {
      const arriving = entries.filter(entry => entry.isIntersecting);
      arriving.forEach(({target}, i) => {
        observer.unobserve(target);
        if (reduced.matches) return;
        target.style.setProperty('--card-delay', (i % 4) * 35 + 'ms');
        target.classList.add(target.matches('.section-heading') ? 'section-arriving' : 'card-arriving');
      });
    }, {threshold:.08});
    document.querySelectorAll('.section-heading,.grid article,.art-grid figure').forEach(element => observer.observe(element));
  }

  const viewer = document.querySelector('#art-view');
  if (!viewer?.showModal) return;
  const photo = viewer.querySelector('img');
  const title = viewer.querySelector('strong');
  const original = viewer.querySelector('a');
  let exitAnimation;
  function dismiss() {
    if (!viewer.open || exitAnimation) return;
    if (reduced.matches) { viewer.close(); return; }
    exitAnimation = viewer.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.98)'}], {duration:150,easing:'ease-in'});
    exitAnimation.finished.then(() => viewer.close(), () => {});
  }
  for (const link of document.querySelectorAll('.art-grid figure>a')) {
    link.addEventListener('click', event => {
      if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const thumb = link.querySelector('img');
      photo.src = thumb.currentSrc || thumb.src;
      photo.alt = thumb.alt;
      title.textContent = link.nextElementSibling.textContent;
      original.href = link.href;
      viewer.showModal();
      const full = new Image();
      full.src = link.href;
      full.decode().then(() => { if (viewer.open && original.href === full.src) photo.src = full.src; }).catch(() => {});
    });
  }
  viewer.querySelector('button').addEventListener('click', dismiss);
  viewer.addEventListener('cancel', event => { event.preventDefault(); dismiss(); });
  viewer.addEventListener('click', event => { if (event.target === viewer) dismiss(); });
  viewer.addEventListener('close', () => { exitAnimation?.cancel(); exitAnimation = null; });
})();
