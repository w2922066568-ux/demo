(() => {
  'use strict';
  const paths = {
    'sound-off': '<path d="M3 9h4l5-4v14l-5-4H3zM16 9l5 6m0-6-5 6"/>',
    sound: '<path d="M3 9h4l5-4v14l-5-4H3zM16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
    shrink: '<path d="M3 8h5V3m13 5h-5V3M8 21v-5H3m13 5v-5h5"/>',
    play: '<path d="M6 3.5v17L20 12z" fill="currentColor" stroke="none"/>',
    'arrow-right': '<path d="M3.5 12h16m-6-6 6 6-6 6"/>',
    chevron: '<path d="m9 5.5 6.5 6.5L9 18.5"/>',
    keyboard:
      '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M5 9h1m2 0h1m2 0h1m2 0h1m2 0h1M5 12h1m2 0h1m2 0h1m2 0h1m2 0h1M7 15.5h10"/>',
    wave: '<path d="M1 12h4l2-5 3 10 3-14 3 19 2-12 2 2h3"/>',
    route:
      '<circle cx="5" cy="17" r="2.5"/><circle cx="19" cy="6" r="2.5"/><path d="M5 14.5v-3a3 3 0 0 1 3-3h5m6 0v3a3 3 0 0 1-3 3h-5"/>',
    crosshair: '<circle cx="12" cy="12" r="6.5"/><path d="M12 1v5m0 12v5M1 12h5m12 0h5"/>',
    depth: '<path d="M12 2v14m-5-5 5 5 5-5M3 19l4 2 5-2 5 2 4-2"/>',
    close: '<path d="m5 5 14 14M19 5 5 19"/>',
    pause: '<path d="M6 4h4v16H6zm8 0h4v16h-4z" fill="currentColor" stroke="none"/>',
    ping: '<circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="10"/>',
    archive: '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v12h14V8m-10 4h6"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  };
  const icon = (name) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    (paths[name] || '') +
    '</svg>';
  window.HadalIcons = {
    icon,
    render: (root = document) =>
      root.querySelectorAll('[data-icon]').forEach((el) => (el.innerHTML = icon(el.dataset.icon))),
  };
  window.HadalIcons.render();
})();
