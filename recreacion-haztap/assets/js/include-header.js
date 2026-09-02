// Inyecta el header + menú fullscreen compartido antes de que corra gsap-menu.js
(function () {
    fetch('assets/partials/header-menu.html')
        .then(res => res.text())
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);
            document.dispatchEvent(new Event('haztap:header-ready'));
        });
})();
