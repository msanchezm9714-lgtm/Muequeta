/* Muequetá — comportamiento. Sin dependencias. */
(function () {
  'use strict';
  var C = window.MUEQUETA || { confirmado: {} };
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Datos confirmados / modo revisión ---------- */
  $$('[data-confirmar]').forEach(function (el) {
    if (C.confirmado && C.confirmado[el.getAttribute('data-confirmar')]) el.classList.add('ok');
  });

  /* ---------- Contacto ---------- */
  function waLink(msg) { return 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(msg || C.mensajeWhatsapp || ''); }
  $$('[data-wa]').forEach(function (a) {
    if (C.whatsapp) { a.href = waLink(a.getAttribute('data-msg')); a.target = '_blank'; a.rel = 'noopener'; }
    else { a.href = 'contacto.html#solicitar'; a.removeAttribute('target'); }
  });
  $$('[data-ct]').forEach(function (row) {
    var k = row.getAttribute('data-ct'), v = { wa: C.whatsapp, mail: C.correo, tel: C.telefono, ig: C.instagram, fb: C.facebook }[k];
    var out = $('[data-out]', row);
    if (!v) { row.removeAttribute('href'); return; }
    if (k === 'mail') { out.textContent = v; row.href = 'mailto:' + v; }
    else if (k === 'tel') { out.textContent = v; row.href = 'tel:' + v.replace(/[^\d+]/g, ''); }
    else if (k === 'wa') { row.href = waLink(); row.target = '_blank'; row.rel = 'noopener'; if (row.classList.contains('ch')) $('strong', row).textContent = 'Escribir por WhatsApp'; }
    else { row.href = v; row.target = '_blank'; row.rel = 'noopener'; }
    row.classList.add('ok');
  });
  $$('[data-cargo-manuel]').forEach(function (el) { el.textContent = C.cargoManuel || ''; });
  $$('[data-zonas]').forEach(function (ul) {
    ul.innerHTML = '';
    (C.zonas || []).forEach(function (z) { var li = document.createElement('li'); li.textContent = z; ul.appendChild(li); });
  });

  /* ---------- Cabecera ---------- */
  var header = $('[data-header]');
  var heroDark = document.body.getAttribute('data-hero') === 'dark';
  function setHeader() { header.classList.toggle('is-solid', !heroDark || window.scrollY > 40); }
  setHeader(); window.addEventListener('scroll', setHeader, { passive: true });

  var btn = $('.menu-btn'), nav = $('#nav');
  function closeNav() { btn.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); if (heroDark) setHeader(); }
  btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', open); nav.classList.toggle('open', open);
    if (open) header.classList.add('is-solid');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeNav(); btn.focus(); } });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });

  /* ---------- Revelado ---------- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var raf = function (fn) { var t = false; return function () { if (!t) { t = true; requestAnimationFrame(function () { t = false; fn(); }); } }; };

  /* ---------- Entrada del hero ---------- */
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('ready'); }); });
  var hero = $('.hero'), heroWrap = $('.hero-wrap');
  if (hero && !reduce.matches) {
    var hls = $$('.hl', hero);
    var hp = raf(function () {
      var rect = heroWrap.getBoundingClientRect(), p = clamp(-rect.top / (rect.height - window.innerHeight), 0, 1);
      hero.style.setProperty('--hp', (p * .5).toFixed(3));
      hero.style.setProperty('--dim', ease(seg(p, .08, .8)).toFixed(3));
      hls.forEach(function (el, i) {
        var t = ease(seg(p, .04 + i * .05, .4 + i * .05));
        el.style.transform = 'translateY(' + (-t * 70) + 'px)'; el.style.opacity = (1 - t).toFixed(3);
      });
    });
    window.addEventListener('scroll', hp, { passive: true }); window.addEventListener('resize', hp); hp();
  }

  /* ---------- Enfoque: sube a mayor velocidad que el scroll sobre el hero ---------- */
  var enf = $('.enfoque');
  if (enf && !reduce.matches) {
    var P = 0;
    var pull = raf(function () {
      P = .52 * window.innerHeight;
      enf.style.marginBottom = (-P) + 'px';
      enf.style.top = (-Math.min(window.scrollY * 2.1, P)) + 'px';
    });
    window.addEventListener('scroll', pull, { passive: true }); window.addEventListener('resize', pull); pull();
  }

  /* ---------- Entrada de izquierda a derecha ligada al scroll ---------- */
  var sl = $$('[data-sl]');
  if (sl.length && !reduce.matches) {
    var slU = raf(function () {
      var vh = window.innerHeight;
      sl.forEach(function (el, i) {
        var r = el.getBoundingClientRect();
        var t = ease(clamp((vh * .96 - r.top - i * 18) / (vh * .38), 0, 1));
        el.style.opacity = t.toFixed(3); el.style.translate = ((1 - t) * (el.getAttribute('data-sl') === 'r' ? 90 : -90)) + 'px 0';
      });
    });
    window.addEventListener('scroll', slU, { passive: true }); window.addEventListener('resize', slU); slU();
  }

  /* ---------- Tarjetas apiladas: la anterior se retrae ---------- */
  var cards = $$('.scard');
  if (cards.length && !reduce.matches) {
    var upd = raf(function () {
      var vh = window.innerHeight;
      cards.forEach(function (c, i) {
        var n = cards[i + 1]; if (!n) return;
        var topI = parseFloat(getComputedStyle(n).top) || 0;
        var t = clamp((vh - n.getBoundingClientRect().top) / (vh - topI), 0, 1);
        c.style.transform = 'translateY(' + (-t * 14) + 'px) scale(' + (1 - t * .06) + ')';
        c.style.setProperty('--dim', (t * .55).toFixed(3));
      });
    });
    window.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
  }

  /* ---------- Especies: sección fija, la imagen se transforma ---------- */
  var sp = $('[data-species]');
  if (sp && !reduce.matches) {
    var pin = $('.species-pin', sp), slides = $$('.sp-slide', sp), layers = $$('.orb-layer', sp), bars = $$('.bar', sp);
    var vis = function (el) { return el.getClientRects().length > 0; };
    var items = [], cum = [], total = 1, W = [1, 1, 1, 1, 1];
    function layout() {
      items = slides.map(function (_, i) { return i; }).filter(function (i) { return vis(slides[i]); });
      total = 0; cum = [];
      items.forEach(function (i) { cum.push(total); total += W[i] || 1; });
      pin.style.height = (total * 31 + 100) + 'svh';
      draw();
    }
    var stageEls = [$('.sp-title', sp), $('.sp-copy', sp), $('.orb', sp), $('.bars', sp)];
    function enter() {
      var vh = window.innerHeight, e = ease(clamp((vh - pin.getBoundingClientRect().top) / (vh * .85), 0, 1));
      stageEls[0].style.translate = ((1 - e) * -60) + 'px 0'; stageEls[0].style.opacity = e;
      stageEls[1].style.translate = ((1 - e) * -90) + 'px 0'; stageEls[1].style.opacity = e;
      stageEls[2].style.translate = ((1 - e) * 140) + 'px 0'; stageEls[2].style.opacity = e;
      stageEls[3].style.opacity = e;
    }
    var copyEl = $('.sp-copy', sp), mq = window.matchMedia('(max-width:859px)');
    function fitCopy(a) {
      if (!a) return;
      if (mq.matches) copyEl.style.height = a.offsetHeight + 'px'; else copyEl.style.height = '';
    }
    function draw() {
      enter();
      var rect = pin.getBoundingClientRect(), span = rect.height - window.innerHeight;
      var p = clamp(-rect.top / span, 0, 1) * total, k = 0;
      for (var q = 0; q < items.length; q++) if (p >= cum[q] - 1e-6) k = q;
      var cur = items[k];
      fitCopy(slides[cur]);
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === cur); s.classList.toggle('is-past', i < cur); });
      layers.forEach(function (l, i) { l.classList.toggle('is-active', i === cur); l.classList.toggle('is-past', i < cur); });
      bars.forEach(function (b, i) {
        var pos = items.indexOf(i), f = 0;
        if (pos > -1) f = pos < k ? 1 : pos > k ? 0 : clamp((p - cum[pos]) / (W[i] || 1), 0, 1);
        b.style.setProperty('--f', f.toFixed(3));
      });
    }
    bars.forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.getAttribute('data-i'), pos = items.indexOf(i); if (pos < 0) return;
        var rect = pin.getBoundingClientRect(), span = rect.height - window.innerHeight;
        window.scrollTo({ top: window.scrollY + rect.top + (cum[pos] / total) * span + 2, behavior: 'smooth' });
      });
    });
    var drawR = raf(draw);
    window.addEventListener('scroll', drawR, { passive: true });
    window.addEventListener('resize', layout);
    layout();
  }

  /* ---------- Onda: domo claro con halo degradado ---------- */
  var wave = $('[data-wave]');
  if (wave && !reduce.matches) {
    var svc = $('.servicios-home');
    var halo = $('.wave-halo', wave), solid = $('.wave-light', wave), wls = $$('.wl', wave);
    var vw = 0, vh = 0, rMax = 0;
    function size() { vw = window.innerWidth; vh = window.innerHeight; rMax = Math.hypot(vw / 1.89, vh / .7) * 1.35; drawW(); }
    function drawW() {
      var rect = wave.getBoundingClientRect();
      var enter = clamp((vh - rect.top) / (vh * .9), 0, 1);
      var p = clamp(-rect.top / (rect.height - vh), 0, 1);
      var e = ease(seg(p, .1, .78));
      var r = rMax * e;
      halo.style.setProperty('--r', r.toFixed(1) + 'px'); halo.style.setProperty('--rx', (r * 1.35).toFixed(1) + 'px');
      halo.style.visibility = e > 0 ? 'visible' : 'hidden';
      if (svc) {
        var P = 1.3 * vh, start = .2 * (rect.height - vh);
        svc.style.top = (-clamp((-rect.top - start) * 2.7, 0, P)) + 'px';
        svc.style.marginBottom = (-P) + 'px';
      }
      solid.style.opacity = seg(p, .9, .98).toFixed(3);
      wls.forEach(function (el, i) {
        var inn = ease(seg(enter, i * .08, .55 + i * .08));
        var out = ease(seg(p, .08 + i * .05, .42 + i * .05));
        el.style.transform = 'translateY(' + ((1 - inn) * 44 - out * 60) + 'px)';
        el.style.opacity = (inn * (1 - out)).toFixed(3);
      });
    }
    var drawWR = raf(drawW);
    window.addEventListener('scroll', drawWR, { passive: true });
    window.addEventListener('resize', size);
    size();
  }


  /* ---------- Carrusel de equipo ---------- */
  $$('[data-tc]').forEach(function (tc) {
    var cards = $$('.tcard', tc), prev = $('.tc-prev', tc), next = $('.tc-next', tc), live = $('[data-tc-live]', tc), cur = 0, x0 = null;
    function render() {
      cards.forEach(function (c, i) {
        var rel = i - cur;
        c.style.setProperty('--rel', rel); c.style.setProperty('--abs', Math.abs(rel));
        c.classList.toggle('is-sel', i === cur);
        c.setAttribute('aria-hidden', i === cur ? 'false' : 'true');
      });
      prev.setAttribute('aria-disabled', cur === 0); next.setAttribute('aria-disabled', cur === cards.length - 1);
      live.textContent = cards[cur].getAttribute('aria-label');
    }
    function go(n) { cur = clamp(n, 0, cards.length - 1); render(); }
    prev.addEventListener('click', function () { go(cur - 1); });
    next.addEventListener('click', function () { go(cur + 1); });
    cards.forEach(function (c, i) { c.addEventListener('click', function () { if (i !== cur) go(i); }); });
    tc.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(cur - 1); if (e.key === 'ArrowRight') go(cur + 1); });
    tc.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    tc.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); x0 = null; }, { passive: true });
    render();
  });


  /* ---------- Páginas internas: entrada del título y parallax ---------- */
  var ph = $('.page-hero');
  if (ph && !reduce.matches) {
    var h1 = $('h1', ph), k = 0;
    if (h1) {
      var words = h1.textContent.trim().split(/\s+/); h1.innerHTML = '';
      words.forEach(function (w) { var o = document.createElement('span'); o.className = 'rise inl'; o.style.setProperty('--k', k++); var i = document.createElement('span'); i.textContent = w; o.appendChild(i); h1.appendChild(o); h1.appendChild(document.createTextNode(' ')); });
    }
    $$('.eyebrow, .lede, .note', ph).forEach(function (el) { el.classList.add('rise-fade'); el.style.setProperty('--k', k + 1); });
    var phw = $('.wrap', ph);
    var phU = raf(function () { var p = clamp(window.scrollY / (ph.offsetHeight * .9), 0, 1); phw.style.opacity = (1 - p * 1.1).toFixed(3); phw.style.translate = '0 ' + (-p * 50) + 'px'; });
    window.addEventListener('scroll', phU, { passive: true }); phU();
  }

  /* ---------- Servicios: coreografía por sección ---------- */
  var svcs = $$('.svc');
  if (svcs.length && !reduce.matches) {
    var items = [];
    svcs.forEach(function (s, i) {
      var num = document.createElement('span'); num.className = 'svc-num'; num.setAttribute('aria-hidden', 'true'); num.textContent = '0' + (i + 1); s.appendChild(num);
      var head = $('.svc-head', s), prog = document.createElement('i'); prog.className = 'svc-prog'; head.appendChild(prog);
      var gl = $('.glyph', head); if (gl) $$('circle,path,rect,line,ellipse', gl).forEach(function (n) { n.setAttribute('pathLength', '1'); });
      var h2 = $('h2', head);
      if (h2) { var ws = h2.textContent.trim().split(/\s+/); h2.innerHTML = ''; ws.forEach(function (w, n) { var o = document.createElement('span'); o.className = 'wd'; var q = document.createElement('span'); q.textContent = w; o.appendChild(q); h2.appendChild(o); h2.appendChild(document.createTextNode(' ')); items.push({ t: 'word', el: q, ref: h2, i: n }); }); }
      if (gl) items.push({ t: 'draw', el: gl, ref: gl, i: 0 });
      $$('.lede', head).forEach(function (e) { items.push({ t: 'up', el: e, ref: e, i: 0 }); });
      var ph2 = $('.svc-photo', head); if (ph2) items.push({ t: 'clip', el: ph2, ref: ph2, i: 0 });
      $$('.svc-list li', s).forEach(function (li, n) { items.push({ t: 'item', el: li, ref: li, i: 0 }); });
      $$('.svc-note, .btn-row, .urgent', s).forEach(function (e) { items.push({ t: 'up', el: e, ref: e, i: 0 }); });
      items.push({ t: 'sec', el: s, ref: s, num: num, prog: prog });
    });
    var svU = raf(function () {
      var vh = window.innerHeight;
      items.forEach(function (it) {
        var r = it.ref.getBoundingClientRect(), t;
        if (it.t === 'word') { t = ease(clamp((vh * .94 - r.top - it.i * 26) / (vh * .3), 0, 1)); it.el.style.transform = 'translateY(' + ((1 - t) * 115) + '%)'; }
        else if (it.t === 'draw') { t = ease(clamp((vh * .92 - r.top) / (vh * .35), 0, 1)); it.el.style.setProperty('--dr', (1 - t).toFixed(3)); }
        else if (it.t === 'up') { t = ease(clamp((vh * .95 - r.top) / (vh * .3), 0, 1)); it.el.style.opacity = t.toFixed(3); it.el.style.translate = '0 ' + ((1 - t) * 36) + 'px'; }
        else if (it.t === 'item') { t = ease(clamp((vh * .96 - r.top) / (vh * .28), 0, 1)); it.el.style.opacity = t.toFixed(3); it.el.style.translate = ((1 - t) * 60) + 'px 0'; it.el.style.setProperty('--ln', t.toFixed(3)); }
        else if (it.t === 'clip') {
          t = ease(clamp((vh * .98 - r.top) / (vh * .5), 0, 1));
          it.el.style.clipPath = 'inset(' + ((1 - t) * 100) + '% 0 0 0 round 22px)';
          var im = $('img', it.el); if (im) im.style.transform = 'scale(' + (1.28 - .28 * t) + ') translateY(' + ((r.top + r.height / 2 - vh / 2) * -.05) + 'px)';
        }
        else if (it.t === 'sec') {
          var p = clamp((vh - r.top) / (vh + r.height), 0, 1);
          it.num.style.transform = 'translateY(' + ((p - .5) * -160) + 'px)';
          it.prog.style.setProperty('--sp', clamp((vh * .5 - r.top) / r.height, 0, 1).toFixed(3));
        }
      });
    });
    window.addEventListener('scroll', svU, { passive: true }); window.addEventListener('resize', svU); svU();
  }

  /* ---------- Índice de servicios (resaltado) ---------- */
  var idx = $('.index-nav');
  if (idx && 'IntersectionObserver' in window) {
    var links = $$('a', idx), map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var xo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { links.forEach(function (a) { a.classList.remove('on'); }); var a = map[e.target.id]; if (a) { a.classList.add('on'); var ul = a.closest('ul'); ul.scrollTo({ left: a.offsetLeft - (ul.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' }); } }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    $$('.svc').forEach(function (s) { xo.observe(s); });
  }

  /* ---------- Formulario ---------- */
  var form = $('#form-solicitud');
  if (form) {
    var st = $('.form-status', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var txt = 'Hola, quisiera solicitar atención veterinaria.\n' +
        'Nombre: ' + d.get('nombre') + '\nContacto: ' + d.get('contacto') + '\nUbicación aproximada: ' + d.get('ubicacion') +
        '\nEspecie: ' + d.get('especie') + '\nMotivo: ' + d.get('motivo');
      st.classList.add('show');
      if (C.whatsapp) {
        window.open('https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
        st.textContent = 'Abrimos WhatsApp con tu solicitud lista para enviar.';
      } else if (C.correo) {
        window.location.href = 'mailto:' + C.correo + '?subject=' + encodeURIComponent('Solicitud de atención') + '&body=' + encodeURIComponent(txt);
        st.textContent = 'Abrimos tu correo con la solicitud lista para enviar.';
      } else {
        st.textContent = 'Versión de revisión: el formulario aún no está conectado a un canal de contacto. Cuando el cliente confirme WhatsApp o correo (js/site-config.js), la solicitud se enviará por ahí.';
      }
    });
  }
})();
