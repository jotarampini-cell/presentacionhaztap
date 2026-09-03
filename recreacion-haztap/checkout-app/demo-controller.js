window.addEventListener('message', (event) => {
  const doc = document;
  function setReactValue(el, value) {
    if (!el) return;
    const proto = Object.getPrototypeOf(el);
    const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
    if (setter) {
        setter.call(el, value);
        el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
    }
  }

  function getEl(sel, index) {
    if (index !== undefined) {
      return doc.querySelectorAll(sel)[index];
    }
    return doc.querySelector(sel);
  }

  const { action, selector, value, index } = event.data;
  if (action === 'click') {
    const el = getEl(selector, index);
    if (el) {
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
  } else if (action === 'type') {
    const el = getEl(selector, index);
    if (el) setReactValue(el, value);
  } else if (action === 'scroll') {
    const el = getEl(selector, index);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

// Broadcast click events up to parent window to break automation
document.addEventListener('click', (e) => {
  if (e.isTrusted) { // Only real user clicks
    window.parent.postMessage({ type: 'USER_INTERACTION' }, '*');
  }
}, { capture: true });
