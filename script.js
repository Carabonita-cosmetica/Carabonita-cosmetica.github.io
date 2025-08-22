'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ============================
     HAMBURGUESA / MENÚ MÓVIL
     ============================ */
  const burger = document.querySelector('.hamburger');
  const nav = document.getElementById('primary-nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Cerrar al clickear un link
    document.querySelectorAll('.nav-link').forEach(a =>
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      })
    );
  }

  /* ============================
     SCROLLSPY (link activo)
     ============================ */
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');

  if (sections.length && links.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
        }
      });
    }, { threshold: 0.6 });
    sections.forEach(s => spy.observe(s));
  }

  /* ============================
     FADE-IN
     ============================ */
  const toReveal = document.querySelectorAll('.fade-in');
  if (toReveal.length) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          o.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    toReveal.forEach(el => obs.observe(el));
  }

  /* ============================
     PARALLAX SUAVE EN HERO
     ============================ */
  const parallax = document.querySelector('.hero .parallax');
  if (parallax) {
    window.addEventListener('scroll', () => {
      parallax.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }, { passive: true });
  }

  /* ============================
     LIGHTBOX (Consultorios)
     ============================ */
  const lb = document.getElementById('lightbox');
  const lbContent = lb?.querySelector('.lb-content');
  const lbClose = lb?.querySelector('.lb-close');

  function openLightbox({ type, src, poster }) {
    if (!lb || !lbContent) return;

    lbContent.innerHTML = '';
    if (type === 'image') {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      lbContent.appendChild(img);
    } else if (type === 'video') {
      const video = document.createElement('video');
      video.src = src;
      if (poster) video.poster = poster;
      video.controls = true;
      video.autoplay = true;
      lbContent.appendChild(video);
    }
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lb || !lbContent) return;
    const v = lbContent.querySelector('video');
    if (v) { v.pause(); v.src = ''; }
    lbContent.innerHTML = '';
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }


  lbClose?.addEventListener('click', closeLightbox);
  lb?.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox(); // click en fondo
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
  
    /* ============================
     CAROUSEL (Consultorios)
     ============================ */
  const carousels = document.querySelectorAll('[data-carousel]');

  carousels.forEach((carousel) => {
    const track = carousel.querySelector('[data-track]');
    const slides = Array.from(track.children);
    const prevBtn = carousel.querySelector('[data-prev]');
    const nextBtn = carousel.querySelector('[data-next]');
    const dotsWrap = carousel.querySelector('[data-dots]');
    let index = Math.max(slides.findIndex(s => s.classList.contains('is-active')), 0);

    // Dots
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.className = 'c-dot' + (i === index ? ' is-active' : '');
      b.setAttribute('aria-label', `Ir a slide ${i + 1}`);
      dotsWrap.appendChild(b);
      b.addEventListener('click', () => go(i));
      return b;
    });

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    }
    function go(newIndex) {
      index = (newIndex + slides.length) % slides.length;
      update();
    }

    prevBtn?.addEventListener('click', () => go(index - 1));
    nextBtn?.addEventListener('click', () => go(index + 1));

    // Abrir lightbox al hacer click en la slide (imagen o video)
    track.addEventListener('click', (e) => {
      const slide = e.target.closest('.c-slide');
      if (!slide) return;
      const type = slide.dataset.lightbox;
      const src = slide.dataset.src;
      const poster = slide.dataset.poster || '';
      if (type && src) openLightbox({ type, src, poster });
    });

    update();
  });


  /* ============================
     FORMSPREE (opcional)
     ============================ */
  const form = document.getElementById('contact-form');
  const status = document.querySelector('.form-status');

  if (form && status) {
    form.addEventListener('submit', async (e) => {
      // Si no configuraste tu endpoint de Formspree, no interceptamos
      if (!form.action.includes('/f/XXXXXXXX')) return;

      e.preventDefault();
      status.textContent = 'Enviando…';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          status.textContent = '¡Gracias! Te responderé a la brevedad.';
          form.reset();
        } else {
          status.textContent = 'Ups, hubo un error. Probá nuevamente.';
        }
      } catch {
        status.textContent = 'Error de conexión.';
      }
    });
  }
});
