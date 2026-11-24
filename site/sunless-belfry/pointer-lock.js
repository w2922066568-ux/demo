// Web browsers require a user gesture for pointer lock. A cutscene may finish
// outside that gesture, so capture on the player's next click or key press.
window.belfryPointerLock = (() => {
  let waitingFor = null;
  function cancel() {
    if (!waitingFor) return;
    waitingFor.removeEventListener('pointerdown', onGesture, true);
    window.removeEventListener('keydown', onGesture, true);
    waitingFor = null;
  }
  function defer(canvas) {
    if (waitingFor === canvas) return;
    cancel();
    waitingFor = canvas;
    canvas.addEventListener('pointerdown', onGesture, true);
    window.addEventListener('keydown', onGesture, true);
  }
  function onGesture(event) {
    if (!event.isTrusted || event.key === 'Escape' || event.repeat) return;
    request(waitingFor);
  }
  function request(canvas) {
    if (!canvas?.requestPointerLock) return;
    if (document.pointerLockElement === canvas) { cancel(); return; }
    if (navigator.userActivation?.isActive === false) { defer(canvas); return; }
    cancel();
    canvas.requestPointerLock()?.catch(error => {
      if (error.name === 'NotAllowedError' || error.name === 'SecurityError') defer(canvas);
    });
  }
  return {
    request,
    release() {
      cancel();
      if (document.pointerLockElement) document.exitPointerLock();
    }
  };
})();
