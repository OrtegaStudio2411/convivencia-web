/* ARCHIVO 3: script.js
   Guárdalo en la MISMA carpeta que index.html (convivencia-web/script.js) */

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

// 1. Menú hamburguesa (abrir/cerrar)
menuToggle.addEventListener('click', () => {
  const abierto = nav.classList.toggle('open');
  menuToggle.classList.toggle('open', abierto);
  menuToggle.setAttribute('aria-expanded', abierto);
});

// Cierra el menú al elegir un enlace (móviles)
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', false);
  });
});

// 2. Marca en el menú la sección que se está viendo
const secciones = document.querySelectorAll('main section[id]');
const enlaces = document.querySelectorAll('.nav a');
const observer = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (e.isIntersecting) {
      enlaces.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
secciones.forEach(s => observer.observe(s));

// 3. Año automático en el pie de página
document.getElementById('year').textContent = new Date().getFullYear();