/* ARCHIVO 3: script.js
   Guárdalo en la MISMA carpeta que index.html (convivencia-web/script.js) */

// Marca que JavaScript está activo (así el contenido nunca queda oculto si falla el script)
document.documentElement.classList.add('js');

/* ---------- 1. Menú hamburguesa ---------- */
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

function cerrarMenu() {
  nav.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}
menuToggle.addEventListener('click', () => {
  const abierto = nav.classList.toggle('open');
  menuToggle.classList.toggle('open', abierto);
  menuToggle.setAttribute('aria-expanded', abierto);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));

/* ---------- 2. NUEVO: barra de progreso de lectura ---------- */
const barra = document.getElementById('progress');
function actualizarProgreso() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const avance = total > 0 ? window.scrollY / total : 0;
  barra.style.transform = `scaleX(${Math.min(avance, 1)})`;
}
window.addEventListener('scroll', actualizarProgreso, { passive: true });
window.addEventListener('resize', actualizarProgreso);
actualizarProgreso();

/* ---------- 3. NUEVO: pestañas que filtran las recomendaciones ---------- */
const pestanas = document.querySelectorAll('.tab');
const tarjetas = document.querySelectorAll('#cards .card');

pestanas.forEach(tab => {
  tab.addEventListener('click', () => {
    const filtro = tab.dataset.filter;
    pestanas.forEach(t => {
      const activa = t === tab;
      t.classList.toggle('active', activa);
      t.setAttribute('aria-selected', activa);
    });
    tarjetas.forEach(card => {
      const visible = filtro === 'todas' || card.dataset.cat.split(' ').includes(filtro);
      card.hidden = !visible;
      if (visible) { // reinicia la animación de aparición
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = '';
      }
    });
  });
});

/* ---------- 4. NUEVO: quiz de autoevaluación ---------- */
// Para cambiar o añadir preguntas, edita este arreglo.
const preguntas = [
  {
    texto: '¿Cuál de estas acciones es una muestra de convivencia ciudadana?',
    opciones: ['Dejar la basura en el parque si no hay papelera cerca', 'Ceder el asiento a una persona que lo necesita', 'Subir el volumen de la música en un espacio compartido'],
    correcta: 1,
    explicacion: 'Ceder el asiento muestra solidaridad y respeto por las necesidades de los demás, que son bases de la convivencia.'
  },
  {
    texto: 'Recibes una noticia alarmante por una cadena de mensajes. ¿Qué conviene hacer primero?',
    opciones: ['Reenviarla para que todos estén informados', 'Verificarla en fuentes confiables antes de compartirla', 'Publicarla con un comentario personal'],
    correcta: 1,
    explicacion: 'Verificar la información evita difundir noticias falsas, que se propagan con rapidez y pueden causar daño.'
  },
  {
    texto: 'Un compañero es objeto de burlas en un grupo de chat. ¿Cuál es la mejor reacción?',
    opciones: ['No participar en las burlas, apoyar a la persona y avisar a un adulto', 'Reírse para no quedar fuera del grupo', 'Ignorarlo, porque es un asunto de internet'],
    correcta: 0,
    explicacion: 'Apoyar a la víctima y pedir ayuda a un adulto ayuda a detener el ciberacoso; ignorarlo o reírse lo refuerza.'
  }
];

const quiz = document.getElementById('quiz');
let actual = 0, puntos = 0;

function mostrarPregunta() {
  const p = preguntas[actual];
  quiz.innerHTML = `
    <div class="quiz-meta"><span>Pregunta ${actual + 1} de ${preguntas.length}</span><span>Aciertos: ${puntos}</span></div>
    <div class="quiz-bar"><div style="width:${(actual / preguntas.length) * 100}%"></div></div>
    <h3>${p.texto}</h3>
    <div class="options">
      ${p.opciones.map((o, i) => `<button class="option" data-i="${i}">${o}</button>`).join('')}
    </div>
    <div id="respuesta"></div>`;
  quiz.querySelectorAll('.option').forEach(btn => btn.addEventListener('click', () => responder(btn)));
}

function responder(btn) {
  const p = preguntas[actual];
  const elegida = Number(btn.dataset.i);
  const acierto = elegida === p.correcta;
  if (acierto) puntos++;

  const botones = quiz.querySelectorAll('.option');
  botones.forEach((b, i) => {
    b.disabled = true;
    if (i === p.correcta) b.classList.add('correct');
  });
  if (!acierto) btn.classList.add('wrong');

  const ultima = actual === preguntas.length - 1;
  document.getElementById('respuesta').innerHTML = `
    <div class="feedback ${acierto ? 'ok' : 'no'}"><strong>${acierto ? 'Correcto.' : 'No es correcto.'}</strong> ${p.explicacion}</div>
    <button class="btn dark" id="siguiente">${ultima ? 'Ver resultado' : 'Siguiente pregunta'}</button>`;
  document.getElementById('siguiente').addEventListener('click', () => {
    if (ultima) mostrarResultado(); else { actual++; mostrarPregunta(); }
  });
}

function mostrarResultado() {
  const mensaje = puntos === preguntas.length
    ? 'Excelente: respondiste todo correctamente.'
    : puntos >= 2 ? 'Buen resultado. Repasa las secciones de la página para reforzar lo que falta.'
    : 'Te recomendamos volver a leer las secciones y volver a intentarlo.';
  quiz.innerHTML = `
    <div class="score">${puntos} / ${preguntas.length}</div>
    <p>${mensaje}</p>
    <button class="btn dark" id="reiniciar">Intentar de nuevo</button>`;
  document.getElementById('reiniciar').addEventListener('click', () => { actual = 0; puntos = 0; mostrarPregunta(); });
}
mostrarPregunta();

/* ---------- 5. Aparición suave al hacer scroll ---------- */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

/* ---------- 6. Enlace activo en el menú ---------- */
const secciones = document.querySelectorAll('main section[id]');
const enlaces = document.querySelectorAll('.nav a');
const navObserver = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (e.isIntersecting) {
      enlaces.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
secciones.forEach(s => navObserver.observe(s));

/* ---------- 7. Año automático en el pie ---------- */
document.getElementById('year').textContent = new Date().getFullYear();