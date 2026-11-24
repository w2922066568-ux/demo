(() => {
  const home = new URL('./', document.currentScript.src);
  const page = new URL(location.href);
  const onHome = page.pathname.replace(/index\.html$/, '') === home.pathname;
  const key = 'portfolio-passage:' + home.pathname;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const read = () => { try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; } };
  const remember = value => { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {} };
  function useRect(rect) {
    if (!Array.isArray(rect) || rect.length !== 4 || !rect.every(Number.isFinite)) return;
    document.documentElement.style.setProperty('--passage-inset', rect.map(n => Math.max(0,Math.min(98,n))+'%').join(' '));
  }
  function arrive(event) {
    event?.viewTransition?.ready.catch(() => {});
    const last = read();
    const historyVisit = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
    const traversed = window.navigation?.activation?.navigationType === 'traverse';
    const back = onHome && (event?.persisted || traversed || historyVisit || last?.returning);
    document.documentElement.dataset.direction = back ? 'back' : 'forward';
    if (!onHome && last?.path === page.pathname) useRect(last.rect);
    if (back) {
      const link = [...document.querySelectorAll('article .cover')].find(a => a.href === last?.href);
      if (link) useRect(bounds(link));
      else useRect(last?.rect);
    }
  }
  function bounds(link) {
    const r=link.getBoundingClientRect();
    return [100*r.top/innerHeight,100*(innerWidth-r.right)/innerWidth,100*(innerHeight-r.bottom)/innerHeight,100*r.left/innerWidth];
  }
  addEventListener('pagereveal', arrive);
  addEventListener('pageswap', event => { event.viewTransition?.ready.catch(() => {}); });
  addEventListener('pageshow', arrive);
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const a = event.target.closest?.('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const dest = new URL(a.href);
    if (dest.origin !== home.origin || !dest.pathname.startsWith(home.pathname)) return;
    const card = a.closest('article');
    if (onHome && card && !dest.pathname.includes('/media/')) {
      const cover = card.querySelector('.cover');
      const rect = bounds(cover);
      remember({path:dest.pathname,href:cover.href,rect,section:card.closest('section').id});
      useRect(rect);
    }
    if (!onHome && dest.pathname === home.pathname) {
      const last=read();
      if (last) remember({...last,returning:true});
      if (document.referrer && new URL(document.referrer).pathname === home.pathname &&
          new URL(document.referrer).origin === home.origin && last?.path === page.pathname && history.length>1) {
        event.preventDefault();
        history.back();
      }
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    if (!onHome && !document.querySelector('.header .wordmark')) {
      const back=document.createElement('a');
      back.className='portfolio-return';
      back.href=new URL('#browser',home).href;
      back.textContent='‹ 作品集';
      back.setAttribute('aria-label','返回作品集');
      document.body.append(back);
      const sync=()=>{back.hidden=!!document.pointerLockElement || !!document.fullscreenElement;};
      document.addEventListener('pointerlockchange',sync);
      document.addEventListener('fullscreenchange',sync);
      sync();
    }
    if (!('onpagereveal' in window) && !reduced.matches && !onHome && read()?.path === page.pathname) {
      document.body.classList.add('passage-fallback');
    }
  });
})();
