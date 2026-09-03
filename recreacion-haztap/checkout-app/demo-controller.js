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
    // Suppressed intentionally to avoid jumping
  }
});

// Suppress all React/App auto-scrolling to create an "Apple style" smooth presentation
Element.prototype.scrollIntoView = function() {
  console.log('Suppressed scrollIntoView to keep presentation smooth');
};
window.scrollTo = function() {
  console.log('Suppressed scrollTo to keep presentation smooth');
};

document.addEventListener('click', (e) => {
  if (e.isTrusted) {
    window.parent.postMessage({ type: 'USER_INTERACTION' }, '*');
  }
}, { capture: true });
